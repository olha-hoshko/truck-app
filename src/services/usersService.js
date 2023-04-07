/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const { User } = require('../models/User');

const findUser = async (userId) => {
  try {
    const user = await User.findOne({ _id: userId });
    return user;
  } catch (err) {
    throw Error('Error while searching for user');
  }
};

const saveUserData = async (res, userData) => userData.save()
  .then(() => true)
  .catch((err) => res.status(400).json({ message: err.message }));

const deleteUser = async (userId) => {
  try {
    const deleteResult = await User.deleteOne({ _id: userId });
    return deleteResult;
  } catch (err) {
    throw Error('Error while deleting a profile');
  }
};

module.exports = {
  findUser,
  saveUserData,
  deleteUser,
};
