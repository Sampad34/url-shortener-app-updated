const userDao = require("../dao/user.dao");

const tryCatch = require("../utils/tryCatchWrapper");

const getProfile = tryCatch(async (req, res) => {
  const userId = req.user && req.user._id;
  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }
  const user = await userDao.findById(userId);
  res.json({ success: true, user });
});

module.exports = {
  getProfile,
};
