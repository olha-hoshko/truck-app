/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const { Load, loadState, loadStatus } = require('../models/Load');

const getLoads = async (userId) => {
  try {
    const loadList = await Load.find({ created_by: userId }).select('-__v');
    return loadList;
  } catch (err) {
    throw Error('Error while searching for user\'s loads');
  }
};

const getLoad = async (userId, loadId) => {
  try {
    const load = await Load.findOne({ _id: loadId, created_by: userId }).select('-__v');
    return load;
  } catch (err) {
    throw Error('No load with such an id was found');
  }
};

const updateLoad = async (userId, loadId, newData) => {
  try {
    const load = await Load.findOneAndUpdate({
      _id: loadId,
      created_by: userId,
      status: loadStatus[0],
    }, newData);
    return load;
  } catch (err) {
    throw Error('No load with such an id and status \'NEW\' was found');
  }
};

const deleteLoad = async (userId, loadId) => {
  try {
    const load = await Load.findOneAndDelete({
      _id: loadId,
      created_by: userId,
      status: loadStatus[0],
    });
    return load;
  } catch (err) {
    throw Error('No load with such an id and status \'NEW\' was found');
  }
};

const getActiveLoad = async (userId) => {
  try {
    const activeLoad = await Load.findOne({
      assigned_to: userId,
      state: { $ne: loadState[loadState.length - 1] },
    }).select('-__v');
    return activeLoad;
  } catch (err) {
    throw Error('No active load found');
  }
};

module.exports = {
  getLoads,
  getLoad,
  updateLoad,
  deleteLoad,
  getActiveLoad,
};
