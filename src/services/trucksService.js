/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

const { Truck, truckStatus } = require('../models/Truck');

const getTrucks = async (userId) => {
  try {
    const truckList = await Truck.find({ created_by: userId }).select('-__v -payload -dimensions');
    return truckList;
  } catch (err) {
    throw Error('Error while searching for user\'s trucks');
  }
};

const getTruck = async (userId, truckId) => {
  try {
    const truck = await Truck.findOne({ _id: truckId, created_by: userId }).select('-__v -payload -dimensions');
    return truck;
  } catch (err) {
    throw Error('No truck with such an id was found');
  }
};

const findAssignedTruck = async (userId) => {
  try {
    const assignedTruck = await Truck.findOne({ assigned_to: userId }).select('-__v -payload -dimensions');
    return assignedTruck;
  } catch (err) {
    throw Error('Error while searching for assigned truck');
  }
};

const deleteTruck = async (truckId) => {
  try {
    const deleteResult = await Truck.deleteOne({ _id: truckId });
    return deleteResult;
  } catch (err) {
    throw Error('Error while deleting a truck');
  }
};

const getAvailableTrucks = async () => {
  try {
    const truckList = await Truck.find({ assigned_to: { $ne: null }, status: truckStatus[0] }).select('-__v');
    return truckList;
  } catch (err) {
    throw Error('No available truck found');
  }
};

const getLoadTruck = async (driverId) => {
  try {
    const truckOnLoad = await Truck.findOne({ assigned_to: driverId, status: truckStatus[1] }).select('-__v -payload -dimensions');
    return truckOnLoad;
  } catch (err) {
    throw Error('No truck on load found');
  }
};

module.exports = {
  getTrucks,
  getTruck,
  findAssignedTruck,
  deleteTruck,
  getAvailableTrucks,
  getLoadTruck,
};
