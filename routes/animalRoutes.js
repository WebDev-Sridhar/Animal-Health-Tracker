/**
 * Animal routes
 * All routes require authentication (protect) via routes/index.js
 * Role-based: volunteer+ for create/update, admin only for delete
 */

const express = require('express');
const router = express.Router();
const animalController = require('../controllers/animalController');
const { protect, authorize } = require('../middleware/auth');

// volunteer and admin can read, create, update
const volunteerOrAdmin = authorize('volunteer', 'admin');
// admin only for delete
const adminOnly = authorize('admin');

// Must be before /:id to avoid "nearby" being parsed as id
// Public
router.get('/nearby', animalController.getAnimalsNearby);
router.get('/', animalController.getAnimals);
router.get('/:id', animalController.getAnimal);

// Protected
router.post('/', protect, volunteerOrAdmin, animalController.createAnimal);
router.put('/:id', protect, volunteerOrAdmin, animalController.updateAnimal);
router.delete('/:id', protect, adminOnly, animalController.deleteAnimal);
router.post('/:id/health-records', protect, volunteerOrAdmin, animalController.addHealthRecord);
module.exports = router;
