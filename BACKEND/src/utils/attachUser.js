// src/utils/attachUser.js
// helper that controllers/services can use (not middleware)
function attachUser(shortUrlDoc, user) {
  // Add lightweight owner info
  return {
    ...shortUrlDoc.toObject(),
    owner: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
  };
}

module.exports = attachUser;
