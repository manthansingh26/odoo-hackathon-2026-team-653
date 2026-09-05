import { prisma } from '../config/db.js'
import { httpError } from './journal.service.js'

// Email RFC-compliant regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

// Indian Phone regex (10 digits, optional +91 or 0 prefix)
const INDIAN_PHONE_REGEX = /^(?:\+91[\-\s]?|0)?[6-9]\d{9}$/

export async function listContacts() {
  return prisma.contact.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      _count: {
        select: { transactions: true },
      },
    },
  })
}

export async function createContact(data) {
  const { name, type, email, phone } = data

  if (!name || typeof name !== 'string' || !name.trim()) {
    throw httpError(400, 'Contact name is required')
  }

  const trimmedName = name.trim()
  if (trimmedName.length < 2) {
    throw httpError(400, 'Contact name must be at least 2 characters')
  }
  if (!/[a-zA-Z]/.test(trimmedName)) {
    throw httpError(400, 'Contact name must contain valid letters and cannot be only numbers or symbols')
  }

  if (!type || !['CUSTOMER', 'VENDOR'].includes(type.toUpperCase())) {
    throw httpError(400, 'Contact type must be CUSTOMER or VENDOR')
  }

  const cleanEmail = email && typeof email === 'string' && email.trim() ? email.trim().toLowerCase() : null
  if (cleanEmail) {
    if (!EMAIL_REGEX.test(cleanEmail)) {
      throw httpError(400, 'Invalid email address format (e.g. name@domain.com)')
    }
    const existing = await prisma.contact.findUnique({
      where: { email: cleanEmail },
    })
    if (existing) {
      throw httpError(409, `Contact with email "${cleanEmail}" already exists`)
    }
  }

  let cleanPhone = null
  if (phone && typeof phone === 'string' && phone.trim()) {
    const trimmedPhone = phone.trim()
    if (/[a-zA-Z]/.test(trimmedPhone)) {
      throw httpError(400, 'Phone number cannot contain letters')
    }
    if (!INDIAN_PHONE_REGEX.test(trimmedPhone)) {
      throw httpError(400, 'Enter a valid 10-digit mobile number (e.g. 9876543210)')
    }
    cleanPhone = trimmedPhone
  }

  return prisma.contact.create({
    data: {
      name: trimmedName,
      type: type.toUpperCase(),
      email: cleanEmail,
      phone: cleanPhone,
    },
  })
}
