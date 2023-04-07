const express = require('express');

const router = express.Router();
const truckController = require('../controllers/trucksController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { isDriverMiddleware } = require('../middleware/isDriverMiddleware');
const { isOnLoadMiddleware } = require('../middleware/isOnLoadMiddleware');

router.post('/', authMiddleware, isDriverMiddleware, truckController.addTruck);
router.get('/', authMiddleware, isDriverMiddleware, truckController.getTrucks);

router.get('/:id', authMiddleware, isDriverMiddleware, truckController.getTruck);
router.put('/:id', authMiddleware, isDriverMiddleware, isOnLoadMiddleware, truckController.updateTruckInfo);
router.delete('/:id', authMiddleware, isDriverMiddleware, isOnLoadMiddleware, truckController.deleteTruck);

router.post('/:id/assign', authMiddleware, isDriverMiddleware, isOnLoadMiddleware, truckController.assignTruck);

module.exports = {
  trucksRouter: router,
};
