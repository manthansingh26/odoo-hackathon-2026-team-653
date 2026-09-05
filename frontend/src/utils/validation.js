/**
 * Centralized Validation Utilities for Urban Furniture Accounting System.
 * Ensures consistent, professional field-level and form-level validation across all forms.
 */

// Email RFC-compliant regex
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Indian Mobile regex (10 digits starting with 6-9, optional +91 or 0 prefix)
export const INDIAN_PHONE_REGEX = /^(?:\+91[\-\s]?|0)?[6-9]\d{9}$/;

// Indian Pincode regex (strictly 6 numeric digits)
export const INDIAN_PINCODE_REGEX = /^\d{6}$/;

/**
 * Validates full name or entity name.
 * Requires meaningful text containing letters; rejects pure numbers or pure symbols.
 */
export function validateName(name, fieldLabel = 'Full name') {
  if (!name || typeof name !== 'string' || !name.trim()) {
    return `${fieldLabel} is required.`;
  }
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return `${fieldLabel} must be at least 2 characters.`;
  }
  if (/^\d+$/.test(trimmed)) {
    return `${fieldLabel} cannot contain only numbers.`;
  }
  if (/^[^a-zA-Z0-9]+$/.test(trimmed)) {
    return `${fieldLabel} cannot contain only symbols.`;
  }
  if (!/[a-zA-Z]/.test(trimmed)) {
    return `${fieldLabel} must contain valid letters.`;
  }
  return null;
}

/**
 * Validates email address format.
 */
export function validateEmail(email, required = true) {
  if (!email || !email.trim()) {
    return required ? 'Email address is required.' : null;
  }
  const trimmed = email.trim();
  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Enter a valid email address (e.g. name@company.com).';
  }
  return null;
}

/**
 * Validates Indian mobile/phone number.
 * Rejects letters and non-10-digit formats.
 */
export function validatePhone(phone, required = true) {
  if (!phone || !phone.trim()) {
    return required ? 'Mobile number is required.' : null;
  }
  const trimmed = phone.trim();
  if (/[a-zA-Z]/.test(trimmed)) {
    return 'Mobile number cannot contain letters.';
  }
  if (!INDIAN_PHONE_REGEX.test(trimmed)) {
    return 'Enter a valid 10-digit mobile number (e.g. 9876543210).';
  }
  return null;
}

/**
 * Normalizes phone number to standard format.
 */
export function normalizePhone(phone) {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return `+91 ${digits.slice(1, 6)} ${digits.slice(6)}`;
  }
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone.trim();
}

/**
 * Validates Indian 6-digit Pincode.
 */
export function validatePincode(pincode, required = false) {
  if (!pincode || !pincode.toString().trim()) {
    return required ? 'Pincode is required.' : null;
  }
  const trimmed = pincode.toString().trim();
  if (!INDIAN_PINCODE_REGEX.test(trimmed)) {
    return 'Pincode must contain exactly 6 digits.';
  }
  return null;
}

/**
 * Validates city or state.
 */
export function validateCityState(val, fieldLabel = 'City', required = false) {
  if (!val || !val.trim()) {
    return required ? `${fieldLabel} is required.` : null;
  }
  const trimmed = val.trim();
  if (!/[a-zA-Z]/.test(trimmed)) {
    return `${fieldLabel} must contain valid letters.`;
  }
  if (/^\d+$/.test(trimmed) || /^[^a-zA-Z0-9]+$/.test(trimmed)) {
    return `${fieldLabel} cannot contain only numbers or symbols.`;
  }
  return null;
}

/**
 * Validates outstanding balance or monetary amount.
 */
export function validateAmount(amount, fieldLabel = 'Amount', allowZero = false) {
  if (amount === '' || amount === null || amount === undefined) {
    return `${fieldLabel} is required.`;
  }
  const num = Number(amount);
  if (isNaN(num)) {
    return `${fieldLabel} must be a valid number.`;
  }
  if (allowZero ? num < 0 : num <= 0) {
    return allowZero ? `${fieldLabel} cannot be negative.` : `${fieldLabel} must be greater than zero.`;
  }
  return null;
}

/**
 * Complete Contact form validator.
 */
export function validateContactForm(formData) {
  const errors = {};

  const nameErr = validateName(formData.name, 'Full name / Entity');
  if (nameErr) errors.name = nameErr;

  const emailErr = validateEmail(formData.email, true);
  if (emailErr) errors.email = emailErr;

  const phoneErr = validatePhone(formData.mobile || formData.phone, true);
  if (phoneErr) errors.mobile = phoneErr;

  if (formData.city) {
    const cityErr = validateCityState(formData.city, 'City', false);
    if (cityErr) errors.city = cityErr;
  }

  if (formData.state) {
    const stateErr = validateCityState(formData.state, 'State', false);
    if (stateErr) errors.state = stateErr;
  }

  if (formData.pincode) {
    const pinErr = validatePincode(formData.pincode, false);
    if (pinErr) errors.pincode = pinErr;
  }

  if (formData.outstanding !== '' && formData.outstanding !== undefined) {
    const outNum = Number(formData.outstanding);
    if (isNaN(outNum) || outNum < 0) {
      errors.outstanding = 'Outstanding balance cannot be negative.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Complete Product form validator.
 */
export function validateProductForm(formData, existingProducts = [], currentId = null) {
  const errors = {};

  const nameErr = validateName(formData.name, 'Product name');
  if (nameErr) errors.name = nameErr;

  if (!formData.code || !formData.code.trim()) {
    errors.code = 'Product SKU / Item code is required.';
  } else {
    const cleanSku = formData.code.trim().toUpperCase();
    if (cleanSku.length < 3) {
      errors.code = 'Product SKU must be at least 3 characters.';
    } else {
      const isDuplicate = existingProducts.some(
        p => p.id !== currentId && (p.code?.toUpperCase() === cleanSku || p.sku?.toUpperCase() === cleanSku)
      );
      if (isDuplicate) {
        errors.code = `SKU "${cleanSku}" is already assigned to another product.`;
      }
    }
  }

  const salesErr = validateAmount(formData.salesPrice, 'Sales price', false);
  if (salesErr) errors.salesPrice = salesErr;

  if (formData.purchasePrice !== '' && formData.purchasePrice !== undefined) {
    const purchaseErr = validateAmount(formData.purchasePrice, 'Cost price', true);
    if (purchaseErr) errors.purchasePrice = purchaseErr;
  }

  if (formData.type !== 'Service') {
    if (formData.stock !== '' && formData.stock !== undefined) {
      const stockNum = Number(formData.stock);
      if (isNaN(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) {
        errors.stock = 'Stock must be a non-negative integer.';
      }
    }
    if (formData.minStock !== '' && formData.minStock !== undefined) {
      const minStockNum = Number(formData.minStock);
      if (isNaN(minStockNum) || minStockNum < 0) {
        errors.minStock = 'Low stock threshold cannot be negative.';
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Complete Invoice or Bill form validator.
 */
export function validateInvoiceOrBillForm({
  contactId,
  date,
  dueDate,
  items,
  discount = 0,
  grandTotal,
  isBill = false
}) {
  const errors = {};
  const partyLabel = isBill ? 'Vendor' : 'Customer';

  if (!contactId) {
    errors.contactId = `Please select a ${partyLabel}.`;
  }

  if (!date) {
    errors.date = `${isBill ? 'Bill' : 'Invoice'} date is required.`;
  }

  if (!dueDate) {
    errors.dueDate = 'Due date is required.';
  } else if (date && new Date(dueDate) < new Date(date)) {
    errors.dueDate = 'Due date cannot be earlier than issue date.';
  }

  if (!items || items.length === 0) {
    errors.items = 'At least one line item is required.';
  } else {
    items.forEach((it, idx) => {
      if (!isBill && !it.productId) {
        errors[`item_${idx}_product`] = 'Product selection is required.';
      }
      if (isBill && (!it.description || !it.description.trim())) {
        errors[`item_${idx}_description`] = 'Description is required.';
      }
      const qty = Number(it.quantity);
      if (isNaN(qty) || qty <= 0) {
        errors[`item_${idx}_quantity`] = 'Quantity must be greater than zero.';
      }
      const price = Number(it.unitPrice);
      if (isNaN(price) || price < 0) {
        errors[`item_${idx}_price`] = 'Unit price cannot be negative.';
      }
    });
  }

  const numDiscount = Number(discount || 0);
  if (isNaN(numDiscount) || numDiscount < 0) {
    errors.discount = 'Discount cannot be negative.';
  }

  if (grandTotal <= 0) {
    errors.grandTotal = 'Total amount must be greater than ₹0.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Complete Payment form validator.
 */
export function validatePaymentForm({ contactId, amount, date, method, reference }) {
  const errors = {};

  if (!contactId) {
    errors.contactId = 'Contact party is required.';
  }

  const amtErr = validateAmount(amount, 'Payment amount', false);
  if (amtErr) errors.amount = amtErr;

  if (!date) {
    errors.date = 'Payment date is required.';
  }

  if (!method) {
    errors.method = 'Payment method is required.';
  }

  if (!reference || !reference.trim()) {
    errors.reference = 'Reference / UTR number is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Complete Journal Entry validator.
 */
export function validateJournalEntryForm({ date, reference, description, lines }) {
  const errors = {};

  if (!date) {
    errors.date = 'Voucher date is required.';
  }

  if (!description || !description.trim()) {
    errors.description = 'Voucher Narration / Description is required.';
  } else if (description.trim().length < 3) {
    errors.description = 'Description must be at least 3 characters.';
  }

  if (!lines || lines.length < 2) {
    errors.lines = 'A journal entry must contain at least 2 lines (debit & credit).';
  } else {
    lines.forEach((line, idx) => {
      if (!line.accountId && !line.accountName) {
        errors[`line_${idx}_account`] = 'Account is required.';
      }
      const debit = Number(line.debit || 0);
      const credit = Number(line.credit || 0);
      if (isNaN(debit) || debit < 0) {
        errors[`line_${idx}_debit`] = 'Debit cannot be negative.';
      }
      if (isNaN(credit) || credit < 0) {
        errors[`line_${idx}_credit`] = 'Credit cannot be negative.';
      }
      if (debit > 0 && credit > 0) {
        errors[`line_${idx}_balance`] = 'A line cannot have both debit and credit.';
      }
    });
  }

  const totalDebit = (lines || []).reduce((sum, l) => sum + (Number(l.debit) || 0), 0);
  const totalCredit = (lines || []).reduce((sum, l) => sum + (Number(l.credit) || 0), 0);
  const difference = Math.abs(totalDebit - totalCredit);

  if (totalDebit <= 0 || totalCredit <= 0) {
    errors.balance = 'Journal entry must contain positive debit and credit amounts.';
  } else if (totalDebit !== totalCredit) {
    errors.balance = `Journal entry is not balanced. Difference: ₹${difference.toLocaleString('en-IN')}.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    totalDebit,
    totalCredit,
    difference
  };
}

/**
 * Complete Signup / Registration validator.
 */
export function validateSignupForm({ name, email, password }) {
  const errors = {};

  const nameErr = validateName(name, 'Full name');
  if (nameErr) errors.name = nameErr;

  const emailErr = validateEmail(email, true);
  if (emailErr) errors.email = emailErr;

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
