const analyticsDao = require("../dao/analytics.dao");
const tryCatch = require("../utils/tryCatchWrapper");

const getAnalytics = tryCatch(async (req, res) => {
  const { shortId } = req.params;

  const stats = await analyticsDao.getStatsByShortId(shortId);

  res.json({
    success: true,
    data: stats[0] || { totalClicks: 0 },
  });
});

module.exports = {
  getAnalytics,
};