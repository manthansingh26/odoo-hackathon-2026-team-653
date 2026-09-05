import { CDPBrowser } from './cdp_browser.js';

async function diagnoseProd() {
  const browser = new CDPBrowser();
  await browser.start();

  try {
    // Login as Admin
    await browser.navigate('http://localhost:5173/login');
    await browser.click('button:has-text("Admin")');
    await new Promise(r => setTimeout(r, 800));

    // Navigate to Products
    await browser.navigate('http://localhost:5173/products');
    await new Promise(r => setTimeout(r, 500));

    // Click Add Product
    await browser.click('button:has-text("Add Product")');
    await new Promise(r => setTimeout(r, 500));

    // Inspect inputs before fill
    const inputsInfo = await browser.eval(`(() => {
      const inputs = Array.from(document.querySelectorAll('form input, form select'));
      return inputs.map(i => ({
        tag: i.tagName,
        type: i.type,
        placeholder: i.placeholder,
        value: i.value
      }));
    })()`);
    console.log('Product inputs before fill:', inputsInfo);

    // Fill form
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

    const inputsAfterFill = await browser.eval(`(() => {
      const inputs = Array.from(document.querySelectorAll('form input'));
      return inputs.map(i => ({
        placeholder: i.placeholder,
        value: i.value
      }));
    })()`);
    console.log('Product inputs after fill:', inputsAfterFill);

    const clickRes = await browser.click('button:has-text("Save Product")');
    console.log('Clicked Save Product result:', clickRes);

    await new Promise(r => setTimeout(r, 1000));

    const isModalOpen = await browser.eval(`!!document.querySelector('form')`);
    console.log('Is modal still open:', isModalOpen);

    const tableRows = await browser.eval(`(() => {
      const rows = Array.from(document.querySelectorAll('table tbody tr'));
      return rows.map(r => r.innerText).filter(t => t.includes('TEST-CHAIR-001'));
    })()`);
    console.log('Matching table rows:', tableRows);

  } finally {
    await browser.close();
  }
}

diagnoseProd().catch(console.error);
