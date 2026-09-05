import { CDPBrowser } from './cdp_browser.js';

async function diagnose() {
  const browser = new CDPBrowser();
  await browser.start();

  try {
    // Login as Admin
    await browser.navigate('http://localhost:5173/login');
    await browser.click('button:has-text("Admin")');
    await new Promise(r => setTimeout(r, 800));

    // Navigate to Contacts
    await browser.navigate('http://localhost:5173/contacts');
    await new Promise(r => setTimeout(r, 500));

    // Click Add Contact
    await browser.click('button:has-text("Add Contact")');
    await new Promise(r => setTimeout(r, 500));

    // Inspect form inputs
    const inputsInfo = await browser.eval(`(() => {
      const inputs = Array.from(document.querySelectorAll('form input, form select'));
      return inputs.map(i => ({
        tag: i.tagName,
        type: i.type,
        placeholder: i.placeholder,
        value: i.value,
        name: i.name,
        required: i.required
      }));
    })()`);
    console.log('Form inputs before fill:', inputsInfo);

    // Fill form
    await browser.fill('input[placeholder*="Acme"]', 'Rahul Sharma');
    await browser.fill('input[type="email"]', 'rahul@gmail.com');
    await browser.fill('input[placeholder="9876543210"]', '9876543210');

    const inputsAfterFill = await browser.eval(`(() => {
      const inputs = Array.from(document.querySelectorAll('form input, form select'));
      return inputs.map(i => ({
        placeholder: i.placeholder,
        value: i.value
      }));
    })()`);
    console.log('Form inputs after fill:', inputsAfterFill);

    // Click Create Contact
    const clickRes = await browser.click('button:has-text("Create Contact")');
    console.log('Clicked button result:', clickRes);

    await new Promise(r => setTimeout(r, 1000));

    const errorsAfterSubmit = await browser.eval(`(() => {
      const errEls = Array.from(document.querySelectorAll('.text-red-600, .text-red-500'));
      return errEls.map(e => e.innerText);
    })()`);
    console.log('Errors after submit:', errorsAfterSubmit);

    const isModalOpen = await browser.eval(`!!document.querySelector('form')`);
    console.log('Is modal still open:', isModalOpen);

    const tableRows = await browser.eval(`(() => {
      const rows = Array.from(document.querySelectorAll('table tbody tr'));
      return rows.map(r => r.innerText).filter(t => t.includes('Rahul Sharma'));
    })()`);
    console.log('Matching table rows:', tableRows);

  } finally {
    await browser.close();
  }
}

diagnose().catch(console.error);
