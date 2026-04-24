const Analytics = require("../models/analytics.model");

async function createEvent(data) {
  return Analytics.create(data);
}

async function getStatsByShortId(shortId) {
  return Analytics.aggregate([
    { $match: { shortId } },
    {
      $group: {
        _id: null,
        totalClicks: { $sum: 1 },
        countries: { $push: "$country" },
        devices: { $push: "$device" },
      },
    },
  ]);
}

module.exports = {
  createEvent,
  getStatsByShortId,
};