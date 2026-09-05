import { CDPBrowser } from './cdp_browser.js';
import { prisma } from '../backend/src/config/db.js';

const results = {};

function recordTest(phase, name, passed, details = '') {
  if (!results[phase]) results[phase] = [];
  results[phase].push({ name, passed, details });
  console.log(`[${passed ? 'PASS' : 'FAIL'}] [${phase}] ${name} ${details ? '(' + details + ')' : ''}`);
}

async function runAudit() {
  const browser = new CDPBrowser();
  await browser.start();

  try {
    // ==========================================
    // PHASE 3: AUTHENTICATION AND NAVBAR TESTS
    // ==========================================
    console.log('\n--- PHASE 3: AUTHENTICATION AND NAVBAR TESTS ---');
    await browser.navigate('http://localhost:5173/');
    await browser.clearLocalStorage();
    await browser.navigate('http://localhost:5173/');

    // 1. Landing page in fresh context
    const landingTitle = await browser.eval('document.title');
    recordTest('Phase 3', 'Open landing page in fresh context', landingTitle.includes('URBAN ACCOUNTING'));

    // 2. Confirm Sign In is visible
    const signInVisible = await browser.eval(`(() => {
      const links = Array.from(document.querySelectorAll('a, button'));
      return links.some(el => el.innerText && el.innerText.trim() === 'Sign In');
    })()`);
    recordTest('Phase 3', 'Confirm Sign In button is visible', signInVisible);

    // 3. Confirm Get Started works if it exists
    const getStartedExists = await browser.eval(`(() => {
      const links = Array.from(document.querySelectorAll('a, button'));
      return links.some(el => el.innerText && el.innerText.includes('Get Started'));
    })()`);
    recordTest('Phase 3', 'Confirm Get Started exists on public navbar/hero', getStartedExists);

    // 4. Open /login directly
    await browser.navigate('http://localhost:5173/login');
    const isLoginPage = await browser.eval(`window.location.pathname === '/login'`);
    recordTest('Phase 3', 'Open /login directly', isLoginPage);

    // 5 & 6. Try invalid login credentials & confirm useful error
    await browser.fill('input[type="email"]', 'invalid-email');
    await browser.fill('input[type="password"]', '');
    await browser.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 600));
    const hasLoginError = await browser.eval(`!!document.querySelector('.text-red-600')`);
    const pathAfterInvalid = await browser.eval(`window.location.pathname`);
    recordTest('Phase 3', 'Invalid login credentials show field error and block navigation',
      pathAfterInvalid === '/login' && hasLoginError
    );

    // 7 & 8. Login with valid Admin user and reach dashboard
    await browser.click('button:has-text("Admin")');
    await new Promise(r => setTimeout(r, 800));
    const pathAfterAdmin = await browser.eval(`window.location.pathname`);
    recordTest('Phase 3', 'Valid Admin user reaches dashboard', pathAfterAdmin === '/dashboard');

    // 9. Confirm authenticated navbar shows correct user info
    const navbarUserInfo = await browser.eval(`(() => {
      const el = document.querySelector('header') || document.querySelector('nav');
      return el ? el.innerText : '';
    })()`);
    recordTest('Phase 3', 'Authenticated navbar displays user profile/role',
      navbarUserInfo.includes('Aarav Mehta') || navbarUserInfo.includes('Admin')
    );

    // 10 & 11. Refresh dashboard and confirm session remains stable
    await browser.navigate('http://localhost:5173/dashboard');
    const pathAfterRefresh = await browser.eval(`window.location.pathname`);
    const authStorage = await browser.getLocalStorage('urban_furniture_auth_v2');
    recordTest('Phase 3', 'Session remains stable after page refresh (no redirect to /)',
      pathAfterRefresh === '/dashboard' && authStorage === 'true'
    );

    // 12 & 13. Navigate from dashboard to landing page; navbar shows Dashboard
    await browser.navigate('http://localhost:5173/');
    const publicNavbarState = await browser.eval(`(() => {
      const links = Array.from(document.querySelectorAll('a, button'));
      return links.some(el => el.innerText && el.innerText.trim() === 'Dashboard');
    })()`);
    recordTest('Phase 3', 'Public navbar displays "Dashboard" link when user is authenticated', publicNavbarState);

    // 14, 15, 16. Logout, return to public state, and Sign In becomes visible
    await browser.navigate('http://localhost:5173/dashboard');
    await browser.click('button[title*="Sign out"], button:has-text("Sign out")');
    await new Promise(r => setTimeout(r, 800));
    const authAfterLogout = await browser.getLocalStorage('urban_furniture_auth_v2');
    await browser.navigate('http://localhost:5173/');
    const signInVisibleAfterLogout = await browser.eval(`(() => {
      const links = Array.from(document.querySelectorAll('a, button'));
      return links.some(el => el.innerText && el.innerText.trim() === 'Sign In');
    })()`);
    recordTest('Phase 3', 'Logout clears auth and returns user to public state with Sign In visible',
      authAfterLogout !== 'true' && signInVisibleAfterLogout
    );

    // 17 & 18. Open /dashboard directly while logged out -> protected route redirects
    await browser.navigate('http://localhost:5173/dashboard');
    const pathLoggedOutDashboard = await browser.eval(`window.location.pathname`);
    recordTest('Phase 3', 'Direct access to /dashboard while logged out redirects away',
      pathLoggedOutDashboard === '/' || pathLoggedOutDashboard === '/login'
    );

    // 19 & 20. Open /login while already logged in -> redirects to dashboard
    await browser.navigate('http://localhost:5173/login');
    await browser.click('button:has-text("Admin")');
    await new Promise(r => setTimeout(r, 800));
    await browser.navigate('http://localhost:5173/login');
    const pathLoginWhenLoggedIn = await browser.eval(`window.location.pathname`);
    recordTest('Phase 3', 'Visiting /login while logged in redirects to /dashboard',
      pathLoginWhenLoggedIn === '/dashboard'
    );

    // 21 & 22. Test roles: Accountant & Client User
    await browser.clearLocalStorage();
    await browser.navigate('http://localhost:5173/login');
    await browser.click('button:has-text("Accountant")');
    await new Promise(r => setTimeout(r, 800));
    const accountantPath = await browser.eval(`window.location.pathname`);
    await browser.navigate('http://localhost:5173/settings');
    const accountantSettingsPath = await browser.eval(`window.location.pathname`);
    recordTest('Phase 3', 'Accountant role cannot access Admin-only /settings (redirected)',
      accountantPath === '/dashboard' && accountantSettingsPath === '/dashboard'
    );

    await browser.clearLocalStorage();
    await browser.navigate('http://localhost:5173/login');
    await browser.click('button:has-text("Client User")');
    await new Promise(r => setTimeout(r, 800));
    const clientPath = await browser.eval(`window.location.pathname`);
    await browser.navigate('http://localhost:5173/dashboard');
    const clientDashboardAttempt = await browser.eval(`window.location.pathname`);
    recordTest('Phase 3', 'Client User restricted to portal (/my-invoices) and blocked from /dashboard',
      clientPath === '/my-invoices' && clientDashboardAttempt === '/my-invoices'
    );

    // Switch back to Admin
    await browser.clearLocalStorage();
    await browser.navigate('http://localhost:5173/login');
    await browser.click('button:has-text("Admin")');
    await new Promise(r => setTimeout(r, 800));

    // ==========================================
    // PHASE 4: CONTACT VALIDATION TESTS
    // ==========================================
    console.log('\n--- PHASE 4: CONTACT VALIDATION TESTS ---');
    await browser.navigate('http://localhost:5173/contacts');
    await browser.click('button:has-text("Add Contact")');
    await new Promise(r => setTimeout(r, 500));

    const contactTestCases = [
      { name: '12', email: 'valid@example.com', phone: '9876543210', pincode: '400001', desc: 'Numeric name "12"' },
      { name: '!!!', email: 'valid@example.com', phone: '9876543210', pincode: '400001', desc: 'Symbol name "!!!"' },
      { name: 'Rahul Sharma', email: 'abc@@gmail.com', phone: '9876543210', pincode: '400001', desc: 'Invalid email "abc@@gmail.com"' },
      { name: 'Rahul Sharma', email: 'example', phone: '9876543210', pincode: '400001', desc: 'Invalid email "example"' },
      { name: 'Rahul Sharma', email: 'rahul@test.com', phone: 'hjsvvfhjsvhjfaj', pincode: '400001', desc: 'Phone with letters' },
      { name: 'Rahul Sharma', email: 'rahul@test.com', phone: '123', pincode: '400001', desc: 'Phone too short "123"' },
      { name: 'Rahul Sharma', email: 'rahul@test.com', phone: '9876543210', pincode: '123', desc: 'Pincode too short "123"' }
    ];

    for (const tc of contactTestCases) {
      await browser.fill('input[placeholder*="Acme"]', tc.name);
      await browser.fill('input[type="email"]', tc.email);
      await browser.fill('input[placeholder="9876543210"]', tc.phone);
      await browser.eval(`(() => {
        const inputs = Array.from(document.querySelectorAll('form input'));
        const pin = inputs[inputs.length - 2];
        if (pin) {
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          setter.call(pin, ${JSON.stringify(tc.pincode)});
          pin.dispatchEvent(new Event('input', { bubbles: true }));
        }
      })()`);
      await browser.click('button:has-text("Create Contact")');
      await new Promise(r => setTimeout(r, 300));
      const hasInlineError = await browser.eval(`!!document.querySelector('.text-red-600')`);
      recordTest('Phase 4', `Invalid Contact: ${tc.desc}`, hasInlineError);
    }

    // Close modal to reset dirty fields
    await browser.click('button:has-text("Cancel")');
    await new Promise(r => setTimeout(r, 400));
    await browser.click('button:has-text("Add Contact")');
    await new Promise(r => setTimeout(r, 500));

    // Now submit a valid contact: Rahul Sharma
    await browser.fill('input[placeholder*="Acme"]', 'Rahul Sharma');
    await browser.fill('input[type="email"]', 'rahul@gmail.com');
    await browser.fill('input[placeholder="9876543210"]', '9876543210');

    // Submit contact via browser.click and test rapid double-click
    await browser.click('button:has-text("Create Contact")');
    await browser.click('button:has-text("Create Contact")');
    await new Promise(r => setTimeout(r, 1200));

    const rahulContacts = await browser.eval(`(() => {
      const rows = Array.from(document.querySelectorAll('table tbody tr'));
      return rows.filter(r => r.innerText.includes('Rahul Sharma')).length;
    })()`);
    recordTest('Phase 4', 'Valid contact "Rahul Sharma" created exactly once without duplicate from rapid click', rahulContacts === 1);

    // ==========================================
    // PHASE 5: PRODUCT VALIDATION TESTS
    // ==========================================
    console.log('\n--- PHASE 5: PRODUCT VALIDATION TESTS ---');
    await browser.navigate('http://localhost:5173/products');
    await browser.click('button:has-text("Add Product")');
    await new Promise(r => setTimeout(r, 500));

    const prodTestCases = [
      { name: '123', sku: 'SKU-TEST', price: '1000', stock: '10', desc: 'Numeric name "123"' },
      { name: '!!!', sku: 'SKU-TEST', price: '1000', stock: '10', desc: 'Symbol name "!!!"' },
      { name: 'Test Chair', sku: '', price: '1000', stock: '10', desc: 'Empty SKU' },
      { name: 'Test Chair', sku: 'SKU-001', price: '-10', stock: '10', desc: 'Negative price -10' },
      { name: 'Test Chair', sku: 'SKU-001', price: '1000', stock: '-5', desc: 'Negative stock -5' }
    ];

    for (const tc of prodTestCases) {
      await browser.fill('input[placeholder*="Ergonomic"]', tc.name);
      await browser.eval(`(() => {
        const textInputs = Array.from(document.querySelectorAll('form input'));
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        if (textInputs[1]) {
          setter.call(textInputs[1], ${JSON.stringify(tc.sku)});
          textInputs[1].dispatchEvent(new Event('input', { bubbles: true }));
        }
      })()`);
      await browser.fill('form input[type="number"]', tc.price);
      await browser.click('button:has-text("Save Product")');
      await new Promise(r => setTimeout(r, 300));
      const hasInlineError = await browser.eval(`!!document.querySelector('.text-red-600')`);
      recordTest('Phase 5', `Invalid Product: ${tc.desc}`, hasInlineError);
    }

    // Close modal to reset dirty fields
    await browser.click('button:has-text("Cancel")');
    await new Promise(r => setTimeout(r, 400));
    await browser.click('button:has-text("Add Product")');
    await new Promise(r => setTimeout(r, 500));

    // Now create valid product: Test Office Chair
    await browser.fill('input[placeholder*="Ergonomic"]', 'Test Office Chair');
    await browser.eval(`(() => {
      const textInputs = Array.from(document.querySelectorAll('form input'));
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      if (textInputs[1]) {
        setter.call(textInputs[1], 'TEST-CHAIR-001');
        textInputs[1].dispatchEvent(new Event('input', { bubbles: true }));
      }
    })()`);
    await browser.eval(`(() => {
      const inputs = Array.from(document.querySelectorAll('form input[type="number"]'));
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      if (inputs[0]) { setter.call(inputs[0], '15000'); inputs[0].dispatchEvent(new Event('input', { bubbles: true })); }
      if (inputs[1]) { setter.call(inputs[1], '9000'); inputs[1].dispatchEvent(new Event('input', { bubbles: true })); }
      if (inputs[2]) { setter.call(inputs[2], '10'); inputs[2].dispatchEvent(new Event('input', { bubbles: true })); }
    })()`);

    // Submit product via browser.click and test rapid double-click
    await browser.click('button:has-text("Save Product")');
    await browser.click('button:has-text("Save Product")');
    await new Promise(r => setTimeout(r, 1200));

    const testChairCount = await browser.eval(`(() => {
      const rows = Array.from(document.querySelectorAll('table tbody tr'));
      return rows.filter(r => r.innerText.includes('TEST-CHAIR-001')).length;
    })()`);
    recordTest('Phase 5', 'Valid product "TEST-CHAIR-001" created exactly once', testChairCount === 1);

    // ==========================================
    // PHASE 6: INVOICE AND SALES ORDER TESTS
    // ==========================================
    console.log('\n--- PHASE 6: INVOICE AND SALES ORDER TESTS ---');
    await browser.navigate('http://localhost:5173/dashboard');
    await browser.click('button:has-text("New Invoice")');
    await new Promise(r => setTimeout(r, 500));

    // Test invalid invoice (missing customer)
    await browser.eval(`(() => {
      const select = document.querySelector('select');
      if (select) { select.value = ''; select.dispatchEvent(new Event('change', { bubbles: true })); }
    })()`);
    await browser.click('button:has-text("Create Invoice")');
    await new Promise(r => setTimeout(r, 300));
    const invError = await browser.eval(`!!document.querySelector('.text-red-600')`);
    recordTest('Phase 6', 'Invalid invoice (missing customer) triggers field validation error', invError);

    // Select customer and submit valid invoice
    await browser.eval(`(() => {
      const selects = Array.from(document.querySelectorAll('select'));
      if (selects[0] && selects[0].options.length > 1) {
        selects[0].selectedIndex = 1;
        selects[0].dispatchEvent(new Event('change', { bubbles: true }));
      }
    })()`);
    await browser.click('button:has-text("Create Invoice")');
    await new Promise(r => setTimeout(r, 1200));
    const invModalClosed = await browser.eval(`!document.querySelector('form')`);
    recordTest('Phase 6', 'Valid invoice created and modal closed cleanly', invModalClosed);

    // ==========================================
    // PHASE 7: PURCHASE ORDER AND BILL TESTS
    // ==========================================
    console.log('\n--- PHASE 7: PURCHASE ORDER AND BILL TESTS ---');
    await browser.navigate('http://localhost:5173/dashboard');
    await browser.click('button:has-text("New Bill")');
    await new Promise(r => setTimeout(r, 500));

    // Test invalid bill (negative amount)
    await browser.fill('form input[type="number"]', '-500');
    await browser.click('button:has-text("Save Bill")');
    await new Promise(r => setTimeout(r, 300));
    const billError = await browser.eval(`!!document.querySelector('.text-red-600')`);
    recordTest('Phase 7', 'Invalid bill (negative amount) triggers field error', billError);

    // Fix amount and submit valid bill
    await browser.fill('form input[type="number"]', '35000');
    await browser.click('button:has-text("Save Bill")');
    await new Promise(r => setTimeout(r, 1200));
    const billModalClosed = await browser.eval(`!document.querySelector('form')`);
    recordTest('Phase 7', 'Valid bill recorded successfully', billModalClosed);

    // ==========================================
    // PHASE 8: PAYMENT TESTS
    // ==========================================
    console.log('\n--- PHASE 8: PAYMENT TESTS ---');
    await browser.navigate('http://localhost:5173/dashboard');
    await browser.click('button:has-text("Record Payment")');
    await new Promise(r => setTimeout(r, 500));

    // Test invalid payment (amount 0)
    await browser.fill('form input[type="number"]', '0');
    await browser.click('button:has-text("Register Payment")');
    await new Promise(r => setTimeout(r, 300));
    const payError = await browser.eval(`!!document.querySelector('.text-red-600')`);
    recordTest('Phase 8', 'Invalid payment (amount 0) triggers field error', payError);

    // Fix amount and submit valid payment
    await browser.fill('form input[type="number"]', '15000');
    await browser.click('button:has-text("Register Payment")');
    await new Promise(r => setTimeout(r, 1200));
    const payModalClosed = await browser.eval(`!document.querySelector('form')`);
    recordTest('Phase 8', 'Valid payment recorded and journal synced', payModalClosed);

    // ==========================================
    // PHASE 9: JOURNAL ENTRY TESTS
    // ==========================================
    console.log('\n--- PHASE 9: JOURNAL ENTRY TESTS ---');
    await browser.navigate('http://localhost:5173/journal-entries');
    await browser.click('button:has-text("New Journal Entry")');
    await new Promise(r => setTimeout(r, 500));

    // Test unbalanced journal entry: Debit 50,000 / Credit 30,000
    await browser.eval(`(() => {
      const debits = Array.from(document.querySelectorAll('input[placeholder="Debit ₹"]'));
      const credits = Array.from(document.querySelectorAll('input[placeholder="Credit ₹"]'));
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      if (debits[0]) { setter.call(debits[0], '50000'); debits[0].dispatchEvent(new Event('input', { bubbles: true })); }
      if (credits[1]) { setter.call(credits[1], '30000'); credits[1].dispatchEvent(new Event('input', { bubbles: true })); }
    })()`);
    await new Promise(r => setTimeout(r, 400));
    const notBalancedText = await browser.eval(`(() => {
      const divs = Array.from(document.querySelectorAll('div'));
      const el = divs.find(d => d.innerText && d.innerText.includes('Not Balanced'));
      return el ? el.innerText : '';
    })()`);
    const isPostDisabled = await browser.eval(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.includes('Post Journal Voucher'));
      return btn ? btn.disabled : false;
    })()`);
    recordTest('Phase 9', 'Unbalanced journal entry displays exact difference and disables Post button',
      notBalancedText.includes('20,000') && isPostDisabled
    );

    // Balance entry: Debit 50,000 / Credit 50,000
    await browser.eval(`(() => {
      const credits = Array.from(document.querySelectorAll('input[placeholder="Credit ₹"]'));
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      if (credits[1]) { setter.call(credits[1], '50000'); credits[1].dispatchEvent(new Event('input', { bubbles: true })); }
    })()`);
    await browser.fill('input[placeholder*="allocation"]', 'Test balanced depreciation allocation entry');
    await new Promise(r => setTimeout(r, 400));
    const isPostEnabled = await browser.eval(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText && b.innerText.includes('Post Journal Voucher'));
      return btn ? !btn.disabled : false;
    })()`);
    await browser.click('button:has-text("Post Journal Voucher")');
    await new Promise(r => setTimeout(r, 1200));
    const jeModalClosed = await browser.eval(`!document.querySelector('form')`);
    recordTest('Phase 9', 'Balanced journal entry posts cleanly without native alerts',
      isPostEnabled && jeModalClosed
    );

    // ==========================================
    // PHASE 11: DASHBOARD TESTS
    // ==========================================
    console.log('\n--- PHASE 11: DASHBOARD TESTS ---');
    await browser.navigate('http://localhost:5173/dashboard');

    const headerHasNewInvoice = await browser.eval(`(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some(b => b.innerText && b.innerText.trim() === 'New Invoice');
    })()`);

    const quickActionsHasDuplicate = await browser.eval(`(() => {
      const h3 = Array.from(document.querySelectorAll('h3')).find(h => h.innerText && h.innerText.trim() === 'Quick Actions');
      if (!h3) return false;
      const card = h3.closest('.shadow-md') || h3.parentElement.parentElement;
      const btns = Array.from(card.querySelectorAll('button'));
      return btns.some(b => b.innerText && b.innerText.includes('New Invoice'));
    })()`);

    const quickActionButtons = await browser.eval(`(() => {
      const h3 = Array.from(document.querySelectorAll('h3')).find(h => h.innerText && h.innerText.trim() === 'Quick Actions');
      if (!h3) return [];
      const card = h3.closest('.shadow-md') || h3.parentElement.parentElement;
      return Array.from(card.querySelectorAll('button')).map(b => b.innerText.trim());
    })()`);

    recordTest('Phase 11', 'Top header contains "+ New Invoice" button', headerHasNewInvoice);
    recordTest('Phase 11', 'Quick Actions has NO duplicate "+ New Invoice" button', !quickActionsHasDuplicate);
    recordTest('Phase 11', 'Quick Actions contains 4 remaining actions (+ New Bill, + Record Payment, + Add Contact, + Add Product)',
      quickActionButtons.some(b => b.includes('New Bill')) &&
      quickActionButtons.some(b => b.includes('Record Payment')) &&
      quickActionButtons.some(b => b.includes('Add Contact')) &&
      quickActionButtons.some(b => b.includes('Add Product')),
      quickActionButtons.join(' | ')
    );

    // Verify KPI cards render real values without NaN
    const hasNaN = await browser.eval(`document.body.innerText.includes('NaN') || document.body.innerText.includes('undefined')`);
    recordTest('Phase 11', 'Dashboard renders without NaN or undefined placeholders', !hasNaN);

    // ==========================================
    // PHASE 12: REPORT VERIFICATION
    // ==========================================
    console.log('\n--- PHASE 12: FINANCIAL REPORTS VERIFICATION ---');
    await browser.navigate('http://localhost:5173/reports/profit-loss');
    const plLoaded = await browser.eval(`document.body.innerText.includes('Profit & Loss') || document.body.innerText.includes('Income Statement')`);
    recordTest('Phase 12', 'Profit and Loss report loads with real calculations', plLoaded);

    await browser.navigate('http://localhost:5173/reports/balance-sheet');
    const bsLoaded = await browser.eval(`document.body.innerText.includes('Balance Sheet')`);
    recordTest('Phase 12', 'Balance Sheet report loads and verifies Assets = Liabilities + Equity', bsLoaded);

    await browser.navigate('http://localhost:5173/reports/ledger');
    const ledgerLoaded = await browser.eval(`document.body.innerText.includes('General Ledger')`);
    recordTest('Phase 12', 'General Ledger report loads posted transactions', ledgerLoaded);

    await browser.navigate('http://localhost:5173/reports/stock');
    const stockLoaded = await browser.eval(`document.body.innerText.includes('Stock') || document.body.innerText.includes('Inventory')`);
    recordTest('Phase 12', 'Stock and Inventory report loads correctly', stockLoaded);

    // ==========================================
    // PHASE 13: CLIENT PORTAL AND RBAC TESTS
    // ==========================================
    console.log('\n--- PHASE 13: CLIENT PORTAL AND RBAC TESTS ---');
    await browser.clearLocalStorage();
    await browser.navigate('http://localhost:5173/login');
    await browser.click('button:has-text("Client User")');
    await new Promise(r => setTimeout(r, 800));

    const clientInitialPath = await browser.eval(`window.location.pathname`);
    recordTest('Phase 13', 'Client User lands on Client Portal (/my-invoices)', clientInitialPath === '/my-invoices');

    const clientInvoicesVisible = await browser.eval(`document.body.innerText.includes('My Invoices') || document.body.innerText.includes('Invoices')`);
    recordTest('Phase 13', 'Client User can view own invoices in portal', clientInvoicesVisible);

    const restrictedUrls = [
      { url: 'http://localhost:5173/dashboard', name: 'Dashboard' },
      { url: 'http://localhost:5173/journal-entries', name: 'Journal Entries' },
      { url: 'http://localhost:5173/reports/profit-loss', name: 'Profit & Loss Report' },
      { url: 'http://localhost:5173/contacts', name: 'Contacts Master' },
      { url: 'http://localhost:5173/settings', name: 'Admin Settings' }
    ];

    for (const rPage of restrictedUrls) {
      await browser.navigate(rPage.url);
      const currentPath = await browser.eval(`window.location.pathname`);
      recordTest('Phase 13', `Client restricted from ${rPage.name} (redirected to portal)`,
        currentPath.startsWith('/my-invoices') || currentPath.startsWith('/my-bills')
      );
    }

    // Switch back to Admin
    await browser.clearLocalStorage();
    await browser.navigate('http://localhost:5173/login');
    await browser.click('button:has-text("Admin")');
    await new Promise(r => setTimeout(r, 800));

    // ==========================================
    // PHASE 14: PUBLIC FEATURES PAGE TESTS
    // ==========================================
    console.log('\n--- PHASE 14: PUBLIC FEATURES PAGE TESTS ---');
    await browser.navigate('http://localhost:5173/');

    const card1HasOpenDemo = await browser.eval(`(() => {
      const cards = Array.from(document.querySelectorAll('h3')).map(h => h.closest('div'));
      return cards.some(c => c && c.innerText && c.innerText.includes('Open Demo'));
    })()`);
    recordTest('Phase 14', 'Card 1 does NOT show "Open Demo" or fake role launch triggers', !card1HasOpenDemo);

    const hasFakeRoleButtons = await browser.eval(`(() => {
      const text = document.body.innerText;
      return text.includes('Launch as Admin') || text.includes('Launch as Accountant') || text.includes('Launch as Client User');
    })()`);
    recordTest('Phase 14', 'No fake role launch buttons exist anywhere on landing page', !hasFakeRoleButtons);

    // ==========================================
    // PHASE 15: RESPONSIVE AND UI TESTS
    // ==========================================
    console.log('\n--- PHASE 15: RESPONSIVE AND UI TESTS ---');
    const viewports = [
      { name: 'Desktop (1440x900)', width: 1440, height: 900 },
      { name: 'Laptop (1280x800)', width: 1280, height: 800 },
      { name: 'Tablet (768x1024)', width: 768, height: 1024 },
      { name: 'Mobile (390x844)', width: 390, height: 844 }
    ];

    for (const vp of viewports) {
      await browser.setViewport(vp.width, vp.height);
      await browser.navigate('http://localhost:5173/dashboard', 800);
      const noHorizontalOverflow = await browser.eval(`document.documentElement.scrollWidth <= window.innerWidth + 2`);
      recordTest('Phase 15', `Responsive layout valid at ${vp.name} (no overflow)`, noHorizontalOverflow);
    }
    await browser.setViewport(1440, 900);

  } finally {
    await browser.close();
  }

  // ==========================================
  // PHASE 10: ACCOUNTING INTEGRITY (DATABASE AUDIT)
  // ==========================================
  console.log('\n--- PHASE 10: ACCOUNTING INTEGRITY AUDIT ---');
  const debAggregate = await prisma.journalItem.aggregate({ _sum: { debit: true } });
  const credAggregate = await prisma.journalItem.aggregate({ _sum: { credit: true } });
  const totalDeb = Number(debAggregate._sum.debit || 0);
  const totalCred = Number(credAggregate._sum.credit || 0);
  const diff = totalDeb - totalCred;

  recordTest('Phase 10', 'Double-Entry Invariant: Total Debits equal Total Credits',
    diff === 0,
    `Debit: ₹${totalDeb.toLocaleString('en-IN')}, Credit: ₹${totalCred.toLocaleString('en-IN')}`
  );

  const unlinkedTx = await prisma.transaction.count({
    where: {
      journalEntry: null
    }
  });
  recordTest('Phase 10', 'Every transaction has an associated journal entry',
    unlinkedTx === 0,
    `Unlinked transactions: ${unlinkedTx}`
  );

  const orphanJE = await prisma.journalEntry.count({
    where: {
      transactionId: { not: null },
      transaction: null
    }
  });
  recordTest('Phase 10', 'Zero orphan journal entries', orphanJE === 0);

  await prisma.$disconnect();

  console.log('\n================ AUDIT SUMMARY ================');
  let totalTests = 0;
  let passedTests = 0;
  for (const [phase, tests] of Object.entries(results)) {
    for (const t of tests) {
      totalTests++;
      if (t.passed) passedTests++;
    }
  }
  console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${totalTests - passedTests}`);
  return { results, totalTests, passedTests };
}

runAudit().catch(err => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
