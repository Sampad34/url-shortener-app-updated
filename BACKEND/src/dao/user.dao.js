// src/dao/user.dao.js
const User = require('../models/user.model');

async function createUser(data) {
  const user = new User(data);
  return await user.save();
}

async function findByEmail(email) {
  return User.findOne({ email }).exec();
}

async function findById(id) {
  return User.findById(id).select('-passwordHash').exec();
}

module.exports = {
  createUser,
  findByEmail,
  findById,
};
