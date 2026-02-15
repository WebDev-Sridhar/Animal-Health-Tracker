/**
 * Animal controller - handles HTTP requests and responses
 */

const animalService = require('../services/animalService');
const AppError = require('../utils/AppError');

const getAnimals = async (req, res, next) => {
  try {
    const animals = await animalService.getAllAnimals();
    res.status(200).json({
      success: true,
      count: animals.length,
      data: animals,
    });
  } catch (error) {
    next(error);
  }
};

const getAnimal = async (req, res, next) => {
  try {
    const animal = await animalService.getAnimalById(req.params.id);
    res.status(200).json({
      success: true,
      data: animal,
    });
  } catch (error) {
    next(error);
  }
};

const createAnimal = async (req, res, next) => {
  try {
    const animal = await animalService.createAnimal(req.body);
    res.status(201).json({
      success: true,
      data: animal,
    });
  } catch (error) {
    next(error);
  }
};

const updateAnimal = async (req, res, next) => {
  try {
    const animal = await animalService.updateAnimal(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: animal,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAnimal = async (req, res, next) => {
  try {
    await animalService.deleteAnimal(req.params.id);
    res.status(200).json({
      success: true,
      data: null,
      message: 'Animal deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

const addHealthRecord = async (req, res, next) => {
  try {
    const animal = await animalService.addHealthRecord(req.params.id, req.body);
    res.status(201).json({
      success: true,
      data: animal,
    });
  } catch (error) {
    next(error);
  }
};

const getAnimalsNearby = async (req, res, next) => {
  try {
    const { lat, lng, radius } = req.query;
    if (!lat || !lng || !radius) {
      return next(new AppError('lat, lng and radius are required query parameters', 400));
    }
    const animals = await animalService.getAnimalsNearby(lat, lng, radius);
    res.status(200).json({
      success: true,
      count: animals.length,
      data: animals,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAnimals,
  getAnimal,
  getAnimalsNearby,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  addHealthRecord,
};
