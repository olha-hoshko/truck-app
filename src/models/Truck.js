const mongoose = require('mongoose');

const truckTypes = ['SPRINTER', 'SMALL STRAIGHT', 'LARGE STRAIGHT'];
const truckStatus = ['IS', 'OL'];
const truckSize = {
  SPRINTER: {
    payload: 1700,
    dimensions: {
      width: 300,
      length: 250,
      height: 170,
    },
  },
  'SMALL STRAIGHT': {
    payload: 2500,
    dimensions: {
      width: 500,
      length: 250,
      height: 170,
    },
  },
  'LARGE STRAIGHT': {
    payload: 4000,
    dimensions: {
      width: 700,
      length: 350,
      height: 200,
    },
  },
};

const truckSchema = mongoose.Schema({
  created_by: {
    type: String,
    required: true,
  },
  assigned_to: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    enum: truckTypes,
    required: true,
  },
  status: {
    type: String,
    enum: truckStatus,
    required: true,
    default: truckStatus[0],
  },
  payload: {
    type: Number,
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
  created_date: {
    type: Date,
    default: Date.now,
  },
});

const Truck = mongoose.model('Truck', truckSchema);

module.exports = {
  Truck,
  truckTypes,
  truckStatus,
  truckSize,
};
