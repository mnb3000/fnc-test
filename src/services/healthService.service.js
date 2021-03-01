const httpStatus = require('http-status');
const HealthService = require('../models/healthService.model');
const ApiError = require('../utils/ApiError');
const { updateDoctorsByFilter } = require('./doctor.service');
const { updateClinicsByFilter } = require('./clinic.service');

/**
 * Create a health service
 * @param {Object} healthServiceBody
 * @returns {Promise<HealthService>}
 */
const createHealthService = async (healthServiceBody) => {
  return HealthService.create(healthServiceBody);
};

/**
 * Get a health service by id
 * @param {ObjectId} healthServiceId
 * @returns {Promise<HealthService>}
 */
const getHealthServiceById = async (healthServiceId) => {
  return HealthService.findById(healthServiceId).exec();
};

/**
 * Update a health service by ID
 * @param {ObjectId} healthServiceId
 * @param {Object} updateBody
 * @returns {Promise<HealthService>}
 */
const updateHealthServiceById = async (healthServiceId, updateBody) => {
  const healthService = await getHealthServiceById(healthServiceId);
  if (!healthService) {
    throw new ApiError(httpStatus.NOT_FOUND, 'HealthService not found');
  }
  Object.assign(healthService, updateBody);
  await healthService.save();
  return healthService;
};

/**
 * Updates multiple health services by filter
 * @param {Object} filter
 * @param {Object} updateBody Update body (RAW MONGO, USE $SET)
 * @returns {Promise<Number>} Number of updated documents
 */
const updateHealthServicesByFilter = async (filter, updateBody) => {
  const res = await HealthService.updateMany(filter, updateBody);
  if (!res.ok) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'HealthService DB update error');
  }
  return res.nModified;
};

/**
 * Delete a health service by id
 * @param {ObjectId} healthServiceId
 * @returns {Promise<HealthService>}
 */
const deleteHealthService = async (healthServiceId) => {
  const healthService = await getHealthServiceById(healthServiceId);
  if (!healthService) {
    throw new ApiError(httpStatus.NOT_FOUND, 'HealthService not found');
  }
  await updateClinicsByFilter({ healthServices: healthServiceId }, { $pull: { healthServices: healthServiceId } });
  await updateDoctorsByFilter({ healthServices: healthServiceId }, { $pull: { healthServices: healthServiceId } });
  await healthService.remove();
  return healthService;
};

module.exports = {
  createHealthService,
  getHealthServiceById,
  updateHealthServiceById,
  updateHealthServicesByFilter,
  deleteHealthService,
};
