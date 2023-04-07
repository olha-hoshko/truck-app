/* eslint-disable */

const { Truck, truckTypes, truckSize } = require('../models/Truck');
const TruckService = require('../services/trucksService');

class TruckController {
  async addTruck(req, res) {
    try {
      const { type } = req.body;
      if (!type) {
        return res.status(400).json({ message: 'Please, enter truck\'s type' });
      }
      if (!truckTypes.includes(type)) {
        return res.status(400).json({ message: 'Truck\'s type is not correct' });
      }
      const driver = req.user;
      const sizes = truckSize[type];
      const truck = new Truck({
        type, created_by: driver.userId, payload: sizes.payload, dimensions: sizes.dimensions,
      });
      truck.save()
        .then(() => res.json({ message: 'Truck created successfully' }))
        .catch((err) => res.status(400).json({ message: err.message }));
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  async getTrucks(req, res) {
    try {
      const { userId } = req.user;
      const truckList = await TruckService.getTrucks(userId);
      return res.json({ trucks: truckList });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  async getTruck(req, res) {
    try {
      const truckId = req.path.slice(1);
      if (!truckId) {
        return res.status(400).json({ message: 'Incorrect truck id' });
      }
      const { userId } = req.user;
      const truck = await TruckService.getTruck(userId, truckId);
      if (!truck) {
        return res.status(400).json({ message: 'Truck not found' });
      }
      return res.json({
        truck,
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  async assignTruck(req, res) {
    try {
      const truckId = req.path.split('/')[1];
      if (!truckId) {
        return res.status(400).json({ message: 'Incorrect truck id' });
      }
      const { userId } = req.user;
      const assignedTruck = await TruckService.findAssignedTruck(userId);
      if (assignedTruck) {
        if (assignedTruck._id === truckId) {
          return res.status(400).json({ message: 'You have already assigned this truck' });
        }
        return res.status(400).json({ message: 'You can have only one assigned truck' });
      }
      const truck = await TruckService.getTruck(userId, truckId);
      if (truck.assigned_to !== null) {
        return res.status(400).json({ message: 'Truck is assigned already' });
      }
      truck.assigned_to = userId;
      truck.save()
        .then(() => res.json({ message: 'Truck assigned successfully' }))
        .catch((err) => res.status(400).json({ message: err.message }));
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  async updateTruckInfo(req, res) {
    try {
      const truckId = req.path.split('/')[1];
      if (!truckId) {
        return res.status(400).json({ message: 'Incorrect truck id' });
      }
      const { userId } = req.user;
      const truck = await TruckService.getTruck(userId, truckId);
      if (truck.assigned_to === userId) {
        return res.status(400).json({ message: 'You can not change info of assigned truck' });
      }
      truck.type = req.body.type;
      truck.save()
        .then(() => res.json({ message: 'Truck details changed successfully' }))
        .catch((err) => res.status(400).json({ message: err.message }));
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  async deleteTruck(req, res) {
    try {
      const truckId = req.path.split('/')[1];
      if (!truckId) {
        return res.status(400).json({ message: 'Incorrect truck id' });
      }
      const { userId } = req.user;
      const truck = await TruckService.getTruck(userId, truckId);
      if (truck.assigned_to !== null) {
        return res.status(400).json({ message: 'You can not delete an assigned truck' });
      }
      const deleteResult = await TruckService.deleteTruck(truckId);
      if (deleteResult.deletedCount === 1) {
        return res.json({ message: 'Truck deleted successfully' });
      }
      return res.status(400).json({ message: 'No truck found' });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  async getAvailableTrucks() {
    try {
      return await TruckService.getAvailableTrucks();
    } catch (err) {
      throw Error({message: err.message });
    }
  }

  async getLoadTruck(driverId) {
    try {
      return await TruckService.getLoadTruck(driverId);
    } catch (err) {
      throw Error({message: err.message });
    }
  }
}

module.exports = new TruckController();
