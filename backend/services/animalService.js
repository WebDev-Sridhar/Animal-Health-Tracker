/**
 * Animal service - business logic layer
 */
// const Report = require('../models/Report');
const Animal = require('../models/Animal');
const AppError = require('../utils/AppError');

const getAllAnimals = async (query = {}) => {
  const animals = await Animal.find(query).sort({ createdAt: -1 });
  return animals;
};

const getAnimalById = async (id) => {
  const animal = await Animal.findById(id);
  if (!animal) {
    throw new AppError('Animal not found', 404);
  }
  return animal;
};

const createAnimal = async (data) => {
  const animal = await Animal.create(data);
  return animal;
};

const updateAnimal = async (id, data) => {
  const animal = await Animal.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }
  );
  if (!animal) {
    throw new AppError('Animal not found', 404);
  }
  return animal;
};

const deleteAnimal = async (id) => {
  const animal = await Animal.findByIdAndDelete(id);
  if (!animal) {
    throw new AppError('Animal not found', 404);
  }
  return animal;
};

const addHealthRecord = async (animalId, record) => {
  const animal = await Animal.findById(animalId);
  if (!animal) {
    throw new AppError('Animal not found', 404);
  }
  animal.healthRecords.push(record);
  await animal.save();
  return animal;
};

const getAnimalsNearby = async (lat, lng, radius) => {
  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  const radiusNum = parseFloat(radius);

  if (Number.isNaN(latNum) || latNum < -90 || latNum > 90) {
    throw new AppError('Invalid lat: must be a number between -90 and 90', 400);
  }
  if (Number.isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
    throw new AppError('Invalid lng: must be a number between -180 and 180', 400);
  }
  if (Number.isNaN(radiusNum) || radiusNum <= 0 || radiusNum > 50000) {
    throw new AppError('Invalid radius: must be a number between 1 and 50000 meters', 400);
  }

  const animals = await Animal.find({
    location: {
      $nearSphere: {
        $geometry: {
          type: 'Point',
          coordinates: [lngNum, latNum],
        },
        $maxDistance: radiusNum,
      },
    },
  });

  return animals;
};

module.exports = {
  getAllAnimals,
  getAnimalById,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  addHealthRecord,
  getAnimalsNearby,
};
