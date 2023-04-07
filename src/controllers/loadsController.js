/* eslint-disable */

const { Load, loadState, loadStatus } = require('../models/Load');
const truckController = require('./trucksController');
const { truckStatus } = require('../models/Truck');
const LoadService = require('../services/loadsService');

class LoadController {
  async addLoad(req, res) {
    try {
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Please, enter load\'s name' });
      }
      const { payload } = req.body;
      if (!payload) {
        return res.status(400).json({ message: 'Please, enter load\'s payload' });
      }
      const { pickup_address } = req.body;
      if (!pickup_address) {
        return res.status(400).json({ message: 'Please, enter a pickup address' });
      }
      const { delivery_address } = req.body;
      if (!delivery_address) {
        return res.status(400).json({ message: 'Please, enter a delivery address' });
      }
      const { dimensions } = req.body;
      if (!dimensions) {
        return res.status(400).json({ message: 'Please, enter load\'s dimensions' });
      }
      if (!dimensions.width) {
        return res.status(400).json({ message: 'Please, enter load\'s width' });
      }
      if (!dimensions.length) {
        return res.status(400).json({ message: 'Please, enter load\'s length' });
      }
      if (!dimensions.height) {
        return res.status(400).json({ message: 'Please, enter load\'s height' });
      }
      const shipper = req.user;
      const load = new Load({
        created_by: shipper.userId,
        name,
        payload,
        pickup_address,
        delivery_address,
        dimensions,
      });
      await load.save()
        .then(() => res.json({ message: 'Load created successfully' }))
        .catch((err) => res.status(400).json({ message: err.message }));
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  async getLoads(req, res) {
    try {
      const { userId } = req.user;
      const loadList = await LoadService.getLoads(userId);
      return res.json({ loads: loadList });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  async getLoad(req, res) {
    try {
      const loadId = req.path.slice(1);
      if (!loadId) {
        return res.status(400).json({ message: 'Incorrect load id' });
      }
      const { userId } = req.user;
      const load = await LoadService.getLoad(userId, loadId);
      if (!load) {
        return res.status(400).json({ message: 'Load not found' });
      }
      return res.json({
        load,
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  async updateLoad(req, res) {
    try {
      const loadId = req.path.slice(1);
      if (!loadId) {
        return res.status(400).json({ message: 'Incorrect load id' });
      }
      const { name } = req.body;
      if (!name) {
        return res.status(400).json({ message: 'Please, enter load\'s name' });
      }
      const { payload } = req.body;
      if (!payload) {
        return res.status(400).json({ message: 'Please, enter load\'s payload' });
      }
      const { pickup_address } = req.body;
      if (!pickup_address) {
        return res.status(400).json({ message: 'Please, enter a pickup address' });
      }
      const { delivery_address } = req.body;
      if (!delivery_address) {
        return res.status(400).json({ message: 'Please, enter a delivery address' });
      }
      const { dimensions } = req.body;
      if (!dimensions) {
        return res.status(400).json({ message: 'Please, enter load\'s dimensions' });
      }
      if (!dimensions.width) {
        return res.status(400).json({ message: 'Please, enter load\'s width' });
      }
      if (!dimensions.length) {
        return res.status(400).json({ message: 'Please, enter load\'s length' });
      }
      if (!dimensions.height) {
        return res.status(400).json({ message: 'Please, enter load\'s height' });
      }
      const { userId } = req.user;
      const load = await LoadService.updateLoad(userId, loadId, req.body);
      if (!load) {
        return res.status(400).json({
          message:
                        'Load not found or can not be updated. You can only update loads with status \'NEW\'',
        });
      }
      return res.json({ message: 'Load details changed successfully' });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  async deleteLoad(req, res) {
    try {
      const loadId = req.path.slice(1);
      if (!loadId) {
        return res.status(400).json({ message: 'Incorrect load id' });
      }
      const { userId } = req.user;
      const load = await LoadService.deleteLoad(userId, loadId);
      if (!load) {
        return res.status(400).json({
          message:
                        'Load not found or can not be deleted. You can only delete loads with status \'NEW\'',
        });
      }
      return res.json({ message: 'Load deleted successfully' });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  async mostSuitableTruck(trucks, loadSize) {
    const result = trucks.reduce((prev, curr) => {
      const currSize = curr.dimensions.width * curr.dimensions.length * curr.dimensions.height;
      const prevSize = prev.dimensions.width * prev.dimensions.length * prev.dimensions.height;
      return Math.abs(currSize - loadSize) < Math.abs(prevSize - loadSize) ? curr : prev;
    });
    return result;
  }

  async truckNotFound(load, res, errorMessage) {
    load.status = loadStatus[0];
    load.logs.push({
      message: 'No truck found. Load not posted',
      time: new Date().toISOString(),
    });
    await load.save()
      .catch((err) => res.status(400).json({ message: err.message }));
    return res.status(400).json({ message: errorMessage });
  }

  // eslint-disable-next-line no-use-before-define
  postLoad = async (req, res) => {
    try {
      const loadId = req.path.split('/')[1];
      if (!loadId) {
        return res.status(400).json({ message: 'Incorrect load id' });
      }
      const { userId } = req.user;
      const load = await LoadService.getLoad(userId, loadId);
      if (!load) {
        return res.status(400).json({ message: 'Load not found' });
      }
      if (load.status !== loadStatus[0]) {
        return res.status(400).json({ message: `Load with status '${load.status}' can not be posted` });
      }

      // changing load status from 'NEW' to 'POSTED'
      load.status = loadStatus[1];
      load.logs.push({
        message: 'Load posted',
        time: new Date().toISOString(),
      });
      await load.save()
        .catch((err) => res.status(400).json({ message: err.message }));

      // searching for trucks with assigned_to !== null and status 'IS'
      let trucks = await truckController.getAvailableTrucks();
      if (trucks.length < 1) {
        return await this.truckNotFound(load, res, 'No trucks in service or with assigned drivers found');
      }

      trucks = trucks.filter((truck) => truck.payload > load.payload
                && truck.dimensions.width > load.dimensions.width
                && truck.dimensions.length > load.dimensions.length
                && truck.dimensions.height > load.dimensions.height);
      if (trucks.length < 1) {
        return await this.truckNotFound(load, res, 'No trucks with enough payload and dimensions found');
      }

      const loadSize = load.dimensions.width * load.dimensions.length * load.dimensions.height;
      const suitableTruck = await this.mostSuitableTruck(trucks, loadSize);
      const driverId = suitableTruck.assigned_to;
      // changing truck status to 'OL'
      suitableTruck.status = truckStatus[1];
      await suitableTruck.save()
        .catch((err) => res.status(400).json({ message: err.message }));

      // changing load status from 'POSTED' to 'ASSIGNED'
      load.status = loadStatus[2];
      // changing load state to 'En route to Pick Up'
      load.state = loadState[1];
      load.assigned_to = driverId;
      load.logs.push({
        message: `Load assigned to driver with id ${driverId}`,
        time: new Date().toISOString(),
      });
      await load.save()
        .then(() => res.json({
          message: 'Load posted successfully',
          driver_found: true,
        }))
        .catch((err) => res.status(400).json({ message: err.message }));
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  };

  async getActiveLoad(req, res) {
    try {
      const { userId } = req.user;
      const activeLoad = await LoadService.getActiveLoad(userId);
      if (!activeLoad) {
        return res.status(400).json({ message: 'You do not have an active load' });
      }
      return res.json({ load: activeLoad });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  async setNextLoadState(req, res) {
    try {
      const { userId } = req.user;
      const activeLoad = await LoadService.getActiveLoad(userId);
      if (!activeLoad) {
        return res.status(400).json({ message: 'You do not have an active load' });
      }
      const driverId = activeLoad.assigned_to;
      const activeLoadStateId = loadState.indexOf(activeLoad.state);
      activeLoad.state = loadState[activeLoadStateId + 1];
      if (activeLoadStateId + 1 === loadState.length - 1) {
        // shipped
        activeLoad.status = loadStatus[loadStatus.length - 1];
        activeLoad.assigned_to = null;
        const truck = await truckController.getLoadTruck(driverId);
        // status 'IS'
        truck.status = truckStatus[0];
        await truck.save()
          .catch((err) => res.status(400).json({ message: err.message }));
      }
      activeLoad.logs.push({
        message: activeLoad.state,
        time: new Date().toISOString(),
      });
      await activeLoad.save()
        .catch((err) => res.status(400).json({ message: err.message }));
      return res.json({ message: `Load state changed to '${activeLoad.state}'` });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }

  async getShippingInfo(req, res) {
    try {
      const loadId = req.path.split('/')[1];
      if (!loadId) {
        return res.status(400).json({ message: 'Incorrect load id' });
      }
      const { userId } = req.user;
      const load = await LoadService.getLoad(userId, loadId);
      if (!load) {
        return res.status(400).json({ message: 'Load not found' });
      }
      if (!load.assigned_to) {
        return res.status(400).json({ message: 'Load is not active' });
      }
      const driverId = load.assigned_to;
      const truck = await truckController.getLoadTruck(driverId);
      if (!truck) {
        return res.status(400).json({ message: 'Assigned truck not found' });
      }
      return res.json({ load, truck });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  }
}

module.exports = new LoadController();
