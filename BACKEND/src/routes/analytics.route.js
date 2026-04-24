const express = require("express");
const router = express.Router();

const { getAnalytics } = require("../controller/analytics.controller");
const { requireAuth } = require("../middleware/auth.middleware");

router.get("/:shortId", requireAuth, getAnalytics);

module.exports = router;