const userDao = require('../dao/user.dao');
const shortUrlDao = require('../dao/shortUrl.dao');
const tryCatch = require('../utils/tryCatchWrapper');

const getProfile = tryCatch(async (req, res) => {
  const userId = req.user && req.user._id;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
  const user = await userDao.findById(userId);
  res.json({ success: true, user });
});

const getUserUrls = tryCatch(async (req, res) => {
  const userId = req.user && req.user._id;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
  // Use DAO method name that exists: findAllByUser
  const urls = await shortUrlDao.findAllByUser(userId);
  res.json({ success: true, urls });
});

module.exports = {
  getProfile,
  getUserUrls,
};
