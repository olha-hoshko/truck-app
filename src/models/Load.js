const mongoose = require('mongoose');

const loadState = [null, 'En route to Pick Up', 'Arrived to Pick Up', 'En route to delivery', 'Arrived to delivery'];
const loadStatus = ['NEW', 'POSTED', 'ASSIGNED', 'SHIPPED'];

const loadSchema = mongoose.Schema({
  created_by: {
    type: String,
    required: true,
  },
  assigned_to: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: loadStatus,
    default: loadStatus[0],
    required: true,
  },
  state: {
    type: String,
    enum: loadState,
    default: loadState[0],
  },
  name: {
    type: String,
    required: true,
  },
  payload: {
    type: Number,
    required: true,
  },
  pickup_address: {
    type: String,
    required: true,
  },
  delivery_address: {
    type: String,
    required: true,
  },
  dimensions: {
    width: {
      type: Number,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  logs: [],
  created_date: {
    type: Date,
    default: Date.now,
  },
});

const Load = mongoose.model('Load', loadSchema);

module.exports = {
  Load,
  loadState,
  loadStatus,
};
