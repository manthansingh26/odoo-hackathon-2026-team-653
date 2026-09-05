import * as reportService from '../services/report.service.js'

export async function getReports(req, res, next) {
  try {
    const reports = await reportService.getFinancialReports()
    res.json(reports)
  } catch (err) {
    next(err)
  }
}
