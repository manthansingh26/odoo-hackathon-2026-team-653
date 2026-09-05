import * as dashboardService from '../services/dashboard.service.js'

export async function getDashboardSummary(req, res, next) {
  try {
    const summary = await dashboardService.getDashboardSummary()
    res.json(summary)
  } catch (err) {
    next(err)
  }
}
