import * as contactService from '../services/contact.service.js'

export async function getContacts(req, res, next) {
  try {
    const contacts = await contactService.listContacts()
    res.json(contacts)
  } catch (err) {
    next(err)
  }
}

export async function createContact(req, res, next) {
  try {
    const newContact = await contactService.createContact(req.body)
    res.status(201).json(newContact)
  } catch (err) {
    next(err)
  }
}
