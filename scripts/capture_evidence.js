import { CDPBrowser } from './cdp_browser.js';
import path from 'path';

const ARTIFACT_DIR = '/home/one-piece/.gemini/antigravity-ide/brain/4ca264d6-82c3-4d70-aaf0-aa68310420d5';

async function captureEvidence() {
  const browser = new CDPBrowser();
  await browser.start();

  try {
    // 1. Landing Page Public (Sign In visibility & public feature cards)
    console.log('Capturing Landing Page...');
    await browser.clearLocalStorage();
    await browser.navigate('http://localhost:5173/');
    await browser.captureScreenshot(path.join(ARTIFACT_DIR, 'evidence_landing_public.png'));

    // 2. Login Page with invalid submission
    console.log('Capturing Login validation...');
    await browser.navigate('http://localhost:5173/login');
    await browser.fill('input[type="email"]', 'invalid-email');
    await browser.click('button[type="submit"]');
    await new Promise(r => setTimeout(r, 600));
    await browser.captureScreenshot(path.join(ARTIFACT_DIR, 'evidence_login_validation.png'));

    // 3. Login as Admin & Reach Dashboard
    console.log('Capturing Dashboard...');
    await browser.click('button:has-text("Admin")');
    await new Promise(r => setTimeout(r, 1000));
    await browser.captureScreenshot(path.join(ARTIFACT_DIR, 'evidence_dashboard_authenticated.png'));

    // 4. Contact validation
    console.log('Capturing Contact validation...');
    await browser.navigate('http://localhost:5173/contacts');
    await browser.click('button:has-text("Add Contact")');
    await new Promise(r => setTimeout(r, 500));
    await browser.fill('input[placeholder*="Acme"]', '12');
    await browser.fill('input[type="email"]', 'invalid-email');
    await browser.fill('input[placeholder="9876543210"]', 'abc123');
    await browser.click('button:has-text("Create Contact")');
    await new Promise(r => setTimeout(r, 500));
    await browser.captureScreenshot(path.join(ARTIFACT_DIR, 'evidence_contact_validation.png'));
    await browser.click('button:has-text("Cancel")');
    await new Promise(r => setTimeout(r, 400));

    // 5. Product validation
    console.log('Capturing Product validation...');
    await browser.navigate('http://localhost:5173/products');
    await browser.click('button:has-text("Add Product")');
    await new Promise(r => setTimeout(r, 500));
    await browser.fill('input[placeholder*="Ergonomic"]', '123');
    await browser.fill('form input[type="number"]', '-10');
    await browser.click('button:has-text("Save Product")');
    await new Promise(r => setTimeout(r, 500));
    await browser.captureScreenshot(path.join(ARTIFACT_DIR, 'evidence_product_validation.png'));
    await browser.click('button:has-text("Cancel")');
    await new Promise(r => setTimeout(r, 400));

    // 6. Invoice Modal
    console.log('Capturing Invoice Modal...');
    await browser.navigate('http://localhost:5173/dashboard');
    await browser.click('button:has-text("New Invoice")');
    await new Promise(r => setTimeout(r, 500));
    await browser.captureScreenshot(path.join(ARTIFACT_DIR, 'evidence_invoice_modal.png'));
    await browser.click('button:has-text("Cancel")');
    await new Promise(r => setTimeout(r, 400));

    // 7. Bill Modal
    console.log('Capturing Bill Modal...');
    await browser.click('button:has-text("New Bill")');
    await new Promise(r => setTimeout(r, 500));
    await browser.captureScreenshot(path.join(ARTIFACT_DIR, 'evidence_bill_modal.png'));
    await browser.click('button:has-text("Cancel")');
    await new Promise(r => setTimeout(r, 400));

    // 8. Payment Modal
    console.log('Capturing Payment Modal...');
    await browser.click('button:has-text("Record Payment")');
    await new Promise(r => setTimeout(r, 500));
    await browser.captureScreenshot(path.join(ARTIFACT_DIR, 'evidence_payment_modal.png'));
    await browser.click('button:has-text("Cancel")');
    await new Promise(r => setTimeout(r, 400));

    // 9. Journal Entry (Unbalanced validation)
    console.log('Capturing Journal Entry unbalanced validation...');
    await browser.navigate('http://localhost:5173/journal-entries');
    await browser.click('button:has-text("New Journal Entry")');
    await new Promise(r => setTimeout(r, 500));
    await browser.eval(`(() => {
      const debits = Array.from(document.querySelectorAll('input[placeholder="Debit ₹"]'));
      const credits = Array.from(document.querySelectorAll('input[placeholder="Credit ₹"]'));
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      if (debits[0]) { setter.call(debits[0], '50000'); debits[0].dispatchEvent(new Event('input', { bubbles: true })); }
      if (credits[1]) { setter.call(credits[1], '30000'); credits[1].dispatchEvent(new Event('input', { bubbles: true })); }
    })()`);
    await new Promise(r => setTimeout(r, 500));
    await browser.captureScreenshot(path.join(ARTIFACT_DIR, 'evidence_journal_unbalanced.png'));
    await browser.click('button:has-text("Cancel")');
    await new Promise(r => setTimeout(r, 400));

    // 10. Mobile Responsive Layout (390x844)
    console.log('Capturing Mobile Responsive layout...');
    await browser.setViewport(390, 844);
    await browser.navigate('http://localhost:5173/dashboard');
    await new Promise(r => setTimeout(r, 800));
    await browser.captureScreenshot(path.join(ARTIFACT_DIR, 'evidence_mobile_responsive.png'));
    await browser.setViewport(1440, 900);

    console.log('All 10 evidence screenshots captured successfully!');
  } finally {
    await browser.close();
  }
}

captureEvidence().catch(console.error);
