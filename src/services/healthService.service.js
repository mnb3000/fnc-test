const httpStatus = require('http-status');
const HealthService = require('../models/healthService.model');
const ApiError = require('../utils/ApiError');

/**
 * Create a health service
 * @param {Object} healthServiceBody
 * @returns {Promise<HealthService>}
 */
const createHealthService = async (healthServiceBody) => {
  return HealthService.create(healthServiceBody);
};

/**
 * Query for health services
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryHealthServices = async (filter, options) => {
  return HealthService.paginate(filter, options);
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
 * @param {ClinicService} clinicService
 * @param {DoctorService} doctorService
 * @param {ObjectId} healthServiceId
 * @returns {Promise<HealthService>}
 */
const deleteHealthService = async (clinicService, doctorService, healthServiceId) => {
  const healthService = await getHealthServiceById(healthServiceId);
  if (!healthService) {
    throw new ApiError(httpStatus.NOT_FOUND, 'HealthService not found');
  }
  await clinicService.updateClinicsByFilter(
    { healthServices: healthServiceId },
    { $pull: { healthServices: healthServiceId } }
  );
  await doctorService.updateDoctorsByFilter(
    { healthServices: healthServiceId },
    { $pull: { healthServices: healthServiceId } }
  );
  await healthService.remove();
  return healthService;
};

/**
 * @typedef HealthServiceService
 */
const healthServiceService = {
  createHealthService,
  queryHealthServices,
  getHealthServiceById,
  updateHealthServiceById,
  updateHealthServicesByFilter,
  deleteHealthService,
};

module.exports = healthServiceService;
