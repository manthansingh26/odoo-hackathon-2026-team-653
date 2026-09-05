import { prisma } from '../config/db.js'
import { httpError } from './journal.service.js'

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

  if (!name || !name.trim()) {
    throw httpError(400, 'Contact name is required')
  }

  if (!type || !['CUSTOMER', 'VENDOR'].includes(type.toUpperCase())) {
    throw httpError(400, 'Contact type must be CUSTOMER or VENDOR')
  }

  const cleanEmail = email && email.trim() ? email.trim().toLowerCase() : null
  if (cleanEmail) {
    const existing = await prisma.contact.findUnique({
      where: { email: cleanEmail },
    })
    if (existing) {
      throw httpError(409, `Contact with email "${cleanEmail}" already exists`)
    }
  }

  return prisma.contact.create({
    data: {
      name: name.trim(),
      type: type.toUpperCase(),
      email: cleanEmail,
      phone: phone ? phone.trim() : null,
    },
  })
}
