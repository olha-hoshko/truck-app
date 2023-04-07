const express = require('express');

const router = express.Router();
const loadController = require('../controllers/loadsController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { isShipperMiddleware } = require('../middleware/isShipperMiddleware');
const { isDriverMiddleware } = require('../middleware/isDriverMiddleware');

router.post('/', authMiddleware, isShipperMiddleware, loadController.addLoad);
router.get('/', authMiddleware, isShipperMiddleware, loadController.getLoads);

router.get('/active', authMiddleware, isDriverMiddleware, loadController.getActiveLoad);
router.patch('/active/state', authMiddleware, isDriverMiddleware, loadController.setNextLoadState);

router.get('/:id', authMiddleware, isShipperMiddleware, loadController.getLoad);
router.put('/:id', authMiddleware, isShipperMiddleware, loadController.updateLoad);
router.delete('/:id', authMiddleware, isShipperMiddleware, loadController.deleteLoad);

router.post('/:id/post', authMiddleware, isShipperMiddleware, loadController.postLoad);
router.get('/:id/shipping_info', authMiddleware, isShipperMiddleware, loadController.getShippingInfo);

module.exports = {
  loadsRouter: router,
};
