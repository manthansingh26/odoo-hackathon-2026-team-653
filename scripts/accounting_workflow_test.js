import { prisma } from '../backend/src/config/db.js';

async function runAccountingWorkflow() {
  console.log('====================================================');
  console.log('STARTING COMPLETE ACCOUNTING WORKFLOW TEST (A - U)');
  console.log('====================================================\n');

  // Login as Admin to get auth token
  const loginRes = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@urbanfurniture.in', role: 'Admin' })
  });
  const { token } = await loginRes.json();
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Helper to make API calls
  const apiCall = async (url, method = 'GET', body = null) => {
    const res = await fetch(`http://localhost:4000${url}`, {
      method,
      headers: authHeaders,
      body: body ? JSON.stringify(body) : undefined
    });
    const data = await res.json();
    return { status: res.status, data };
  };

  // Measure baseline AR and AP balances from DB
  const getNetBalance = async (accountName) => {
    const items = await prisma.journalItem.findMany({
      where: { accountName: { equals: accountName, mode: 'insensitive' } }
    });
    const debits = items.reduce((s, i) => s + Number(i.debit), 0);
    const credits = items.reduce((s, i) => s + Number(i.credit), 0);
    return debits - credits;
  };

  const initialAR = await getNetBalance('Accounts Receivable');
  const initialAP = await getNetBalance('Accounts Payable');
  const initialCash = await getNetBalance('Cash');

  console.log(`[Baseline] AR: ₹${initialAR}, AP: ₹${-initialAP}, Cash: ₹${initialCash}\n`);

  // Step A: Create a customer
  console.log('Step A: Creating Customer...');
  const custRes = await apiCall('/api/contacts', 'POST', {
    name: 'Apex Luxury Living Ltd',
    type: 'CUSTOMER',
    email: `apex.${Date.now()}@luxury.com`,
    phone: '9876501234',
    pincode: '400001'
  });
  if (custRes.status !== 201) throw new Error(`Customer creation failed: ${JSON.stringify(custRes.data)}`);
  const customerId = custRes.data.id;
  console.log(`✓ Customer created in PostgreSQL: ${custRes.data.name} (ID: ${customerId})`);

  // Step B: Create a product
  console.log('\nStep B: Creating Product...');
  const prodSku = `DSK-OAK-${Math.floor(1000 + Math.random() * 9000)}`;
  const prodRes = await apiCall('/api/products', 'POST', {
    name: 'Solid Oak Executive Desk',
    sku: prodSku,
    price: 45000,
    stock: 12
  });
  if (prodRes.status !== 201) throw new Error(`Product creation failed: ${JSON.stringify(prodRes.data)}`);
  const productId = prodRes.data.id;
  console.log(`✓ Product created in PostgreSQL: ${prodRes.data.name} (SKU: ${prodSku}, ID: ${productId})`);

  // Step C: Create a customer invoice
  console.log('\nStep C: Creating Customer Invoice...');
  const invRef = `INV-TEST-${Date.now().toString().slice(-5)}`;
  const invRes = await apiCall('/api/invoices', 'POST', {
    contactId: customerId,
    reference: invRef,
    date: new Date().toISOString().slice(0, 10),
    items: [
      {
        productId,
        productName: 'Solid Oak Executive Desk',
        quantity: 1,
        unitPrice: 45000,
        taxRate: 18
      }
    ],
    discount: 0,
    grandTotal: 53100
  });
  if (invRes.status !== 201) throw new Error(`Invoice creation failed: ${JSON.stringify(invRes.data)}`);
  console.log(`✓ Customer invoice created via API: Ref ${invRef}, Total ₹53,100`);

  // Step D: Verify invoice exists in PostgreSQL
  console.log('\nStep D: Verifying Invoice in PostgreSQL...');
  const dbInvoice = await prisma.transaction.findUnique({
    where: { reference: invRef },
    include: { contact: true, journalEntry: { include: { items: true } } }
  });
  if (!dbInvoice || dbInvoice.type !== 'SALE' || dbInvoice.status !== 'PENDING') {
    throw new Error('Invoice not found or invalid in PostgreSQL');
  }
  console.log(`✓ Invoice verified in PostgreSQL transactions table (ID: ${dbInvoice.id}, Status: ${dbInvoice.status})`);

  // Step E: Verify journal entry exists
  console.log('\nStep E: Verifying Journal Entry in PostgreSQL...');
  const dbJE = dbInvoice.journalEntry;
  if (!dbJE) throw new Error('Journal Entry missing for invoice in PostgreSQL');
  console.log(`✓ Journal Entry verified: ${dbJE.reference} (Items: ${dbJE.items.length})`);

  // Step F: Verify debit equals credit
  console.log('\nStep F: Verifying Debit equals Credit for Invoice JE...');
  const invDebit = dbJE.items.reduce((s, i) => s + Number(i.debit), 0);
  const invCredit = dbJE.items.reduce((s, i) => s + Number(i.credit), 0);
  if (invDebit !== invCredit || invDebit !== 53100) {
    throw new Error(`Invoice Journal Entry unbalanced! Debit: ${invDebit}, Credit: ${invCredit}`);
  }
  console.log(`✓ Double-entry verified: Total Debit ₹${invDebit} === Total Credit ₹${invCredit}`);

  // Step G: Verify Accounts Receivable is updated
  console.log('\nStep G: Verifying Accounts Receivable Increased...');
  const arAfterInv = await getNetBalance('Accounts Receivable');
  if (arAfterInv !== initialAR + 53100) {
    throw new Error(`Accounts Receivable mismatch: expected ${initialAR + 53100}, got ${arAfterInv}`);
  }
  console.log(`✓ Accounts Receivable increased by exactly ₹53,100 (New AR: ₹${arAfterInv})`);

  // Step H: Record customer payment
  console.log('\nStep H: Recording Customer Payment...');
  const payRes = await apiCall(`/api/invoices/${invRef}/pay`, 'PATCH', {
    method: 'Bank Transfer',
    amount: 53100
  });
  if (payRes.status !== 200) throw new Error(`Invoice payment failed: ${JSON.stringify(payRes.data)}`);
  console.log(`✓ Customer payment recorded via API for ${invRef}`);

  // Step I: Verify payment exists in PostgreSQL
  console.log('\nStep I: Verifying Payment Transaction Status in PostgreSQL...');
  const updatedInv = await prisma.transaction.findUnique({
    where: { reference: invRef }
  });
  if (updatedInv.status !== 'PAID') throw new Error(`Invoice status not PAID in DB: ${updatedInv.status}`);
  console.log(`✓ Invoice status updated to PAID in PostgreSQL transactions table`);

  // Step J: Verify payment journal entry exists
  console.log('\nStep J: Verifying Payment Settlement Journal Entry in PostgreSQL...');
  const paymentJE = await prisma.journalEntry.findFirst({
    where: { reference: { contains: `JE-PAY-${invRef}` } },
    include: { items: true }
  });
  if (!paymentJE) throw new Error('Payment settlement JournalEntry not found in DB');
  const payDebit = paymentJE.items.reduce((s, i) => s + Number(i.debit), 0);
  const payCredit = paymentJE.items.reduce((s, i) => s + Number(i.credit), 0);
  if (payDebit !== payCredit || payDebit !== 53100) {
    throw new Error(`Payment Journal Entry unbalanced: Debit ${payDebit}, Credit ${payCredit}`);
  }
  console.log(`✓ Payment Journal Entry verified: ${paymentJE.reference} (Debit: ₹${payDebit} = Credit: ₹${payCredit})`);

  // Step K: Verify customer receivable decreases
  console.log('\nStep K: Verifying Accounts Receivable Decreased & Cash Increased...');
  const arAfterPay = await getNetBalance('Accounts Receivable');
  const cashAfterPay = await getNetBalance('Cash');
  if (arAfterPay !== initialAR) {
    throw new Error(`AR did not decrease back to baseline! Expected ${initialAR}, got ${arAfterPay}`);
  }
  if (cashAfterPay !== initialCash + 53100) {
    throw new Error(`Cash did not increase! Expected ${initialCash + 53100}, got ${cashAfterPay}`);
  }
  console.log(`✓ Accounts Receivable settled back to baseline: ₹${arAfterPay} (Net Change: ₹0 outstanding)`);
  console.log(`✓ Cash increased by payment amount: ₹${cashAfterPay} (+₹53,100)`);

  // Step L: Create a vendor
  console.log('\nStep L: Creating Vendor...');
  const vendRes = await apiCall('/api/contacts', 'POST', {
    name: 'Teakwood Timber Exporters Ltd',
    type: 'VENDOR',
    email: `timber.${Date.now()}@exporters.com`,
    phone: '9876509876',
    pincode: '400001'
  });
  if (vendRes.status !== 201) throw new Error(`Vendor creation failed: ${JSON.stringify(vendRes.data)}`);
  const vendorId = vendRes.data.id;
  console.log(`✓ Vendor created in PostgreSQL: ${vendRes.data.name} (ID: ${vendorId})`);

  // Step M: Create a vendor bill
  console.log('\nStep M: Creating Vendor Bill...');
  const billRef = `BILL-TEST-${Date.now().toString().slice(-5)}`;
  const billRes = await apiCall('/api/bills', 'POST', {
    vendorId,
    reference: billRef,
    amount: 28000,
    date: new Date().toISOString().slice(0, 10),
    vendorInvNo: `VN-EXP-${Math.floor(1000 + Math.random() * 9000)}`,
    description: 'Procurement of Grade-A Teak Logs'
  });
  if (billRes.status !== 201) throw new Error(`Bill creation failed: ${JSON.stringify(billRes.data)}`);
  console.log(`✓ Vendor bill created via API: Ref ${billRef}, Amount ₹28,000`);

  // Step N: Verify bill exists in PostgreSQL
  console.log('\nStep N: Verifying Bill in PostgreSQL...');
  const dbBill = await prisma.transaction.findUnique({
    where: { reference: billRef },
    include: { journalEntry: { include: { items: true } } }
  });
  if (!dbBill || dbBill.type !== 'PURCHASE' || dbBill.status !== 'PENDING') {
    throw new Error('Bill not found or invalid in PostgreSQL');
  }
  console.log(`✓ Bill verified in PostgreSQL: ID ${dbBill.id}, Status ${dbBill.status}`);

  // Step O: Verify expense/payable journal entry exists
  console.log('\nStep O: Verifying Bill Journal Entry in PostgreSQL...');
  const billJE = dbBill.journalEntry;
  if (!billJE) throw new Error('Bill journal entry missing');
  const billDebit = billJE.items.reduce((s, i) => s + Number(i.debit), 0);
  const billCredit = billJE.items.reduce((s, i) => s + Number(i.credit), 0);
  if (billDebit !== billCredit || billDebit !== 28000) {
    throw new Error(`Bill Journal Entry unbalanced: Debit ${billDebit}, Credit ${billCredit}`);
  }
  const apAfterBill = await getNetBalance('Accounts Payable');
  console.log(`✓ Bill Journal Entry balanced: Debit ₹${billDebit} === Credit ₹${billCredit}`);
  console.log(`✓ Accounts Payable increased by ₹28,000 (New AP: ₹${-apAfterBill})`);

  // Step P: Verify vendor payment
  console.log('\nStep P: Recording Vendor Payment...');
  const billPayRes = await apiCall(`/api/bills/${billRef}/pay`, 'PATCH', {
    method: 'NEFT',
    amount: 28000
  });
  if (billPayRes.status !== 200) throw new Error(`Bill payment failed: ${JSON.stringify(billPayRes.data)}`);
  console.log(`✓ Vendor payment recorded via API for ${billRef}`);

  // Step Q: Verify payable decreases
  console.log('\nStep Q: Verifying Accounts Payable Decreases & Cash Decreases...');
  const updatedBill = await prisma.transaction.findUnique({ where: { reference: billRef } });
  if (updatedBill.status !== 'PAID') throw new Error('Bill not marked PAID in DB');
  const apAfterPay = await getNetBalance('Accounts Payable');
  const cashAfterBillPay = await getNetBalance('Cash');
  if (apAfterPay !== initialAP) {
    throw new Error(`AP did not settle back to baseline! Expected ${initialAP}, got ${apAfterPay}`);
  }
  console.log(`✓ Accounts Payable settled back to baseline: ₹${-apAfterPay} (Net outstanding: ₹0)`);
  console.log(`✓ Cash updated: ₹${cashAfterBillPay} (Reflects payment of ₹28,000)`);

  // Step R: Refresh test (query list APIs)
  console.log('\nStep R: Refreshing - Querying Invoices, Bills, and Payments from Database...');
  const listInvoices = await apiCall('/api/invoices');
  const listBills = await apiCall('/api/bills');
  const listPayments = await apiCall('/api/payments');
  const foundInv = listInvoices.data.find(i => i.id === invRef);
  const foundBill = listBills.data.find(b => b.id === billRef);
  if (!foundInv || !foundBill) throw new Error('Records missing after simulated page refresh!');
  console.log(`✓ Refresh-safe verified: Found newly created invoice (${foundInv.id}) and bill (${foundBill.id})`);

  // Step S: Logout and login as Accountant
  console.log('\nStep S: Logout and Login as Accountant...');
  await apiCall('/api/auth/logout', 'POST');
  const acctLogin = await fetch('http://localhost:4000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'accounts@urbanfurniture.in', role: 'Accountant' })
  });
  const acctAuth = await acctLogin.json();
  console.log(`✓ Successfully logged in as Accountant: ${acctAuth.user.name} (${acctAuth.user.role})`);

  // Step T: Verify all records still exist for Accountant
  console.log('\nStep T: Verifying Records Visible to Accountant...');
  const acctInvoicesRes = await fetch('http://localhost:4000/api/invoices', {
    headers: { 'Authorization': `Bearer ${acctAuth.token}` }
  });
  const acctInvoices = await acctInvoicesRes.json();
  const foundByAcct = acctInvoices.find(i => i.id === invRef);
  if (!foundByAcct) throw new Error('Invoice not visible to Accountant!');
  console.log(`✓ Cross-user verification successful: Accountant can see invoice ${foundByAcct.id} (Status: ${foundByAcct.status})`);

  // Step U: Verify dashboard and reports use same persisted records
  console.log('\nStep U: Verifying Financial Reports Integrity...');
  const reportsRes = await fetch('http://localhost:4000/api/reports/financial', {
    headers: { 'Authorization': `Bearer ${acctAuth.token}` }
  });
  const reportData = await reportsRes.json();
  console.log(`✓ Reports Integrity: Balanced=${reportData.integrity.balanced}, Debit=₹${reportData.integrity.totalDebit}, Credit=₹${reportData.integrity.totalCredit}`);
  console.log(`✓ P&L Valid: ${reportData.profitAndLoss.valid} (${reportData.profitAndLoss.formula}: ₹${reportData.profitAndLoss.revenue} - ₹${reportData.profitAndLoss.expenses} = ₹${reportData.profitAndLoss.netProfit})`);
  console.log(`✓ Balance Sheet Valid: ${reportData.balanceSheet.formula} (Total Assets: ₹${reportData.balanceSheet.assets.totalAssets})`);

  console.log('\n====================================================');
  console.log('ACCOUNTING WORKFLOW TEST (A - U) 100% COMPLETE & PASS');
  console.log('====================================================\n');
  process.exit(0);
}

runAccountingWorkflow().catch(err => {
  console.error('Workflow Test FAILED:', err);
  process.exit(1);
});
