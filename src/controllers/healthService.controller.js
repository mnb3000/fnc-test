const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const { healthServiceService, clinicService, doctorService } = require('../services');

const createHealthService = catchAsync(async (req, res) => {
  const healthService = await healthServiceService.createHealthService(req.body);
  res.status(httpStatus.CREATED).send(healthService);
});

const getHealthServices = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await healthServiceService.queryHealthServices(filter, options);
  res.send(result);
});

const getHealthService = catchAsync(async (req, res) => {
  const healthService = await healthServiceService.getHealthServiceById(req.params.healthServiceId);
  if (!healthService) {
    throw new ApiError(httpStatus.NOT_FOUND, 'HealthService not found');
  }
  res.send(healthService);
});

const updateHealthService = catchAsync(async (req, res) => {
  const healthService = await healthServiceService.updateHealthServiceById(req.params.healthServiceId, req.body);
  res.send(healthService);
});

const deleteHealthService = catchAsync(async (req, res) => {
  await healthServiceService.deleteHealthService(clinicService, doctorService, req.params.healthServiceId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createHealthService,
  getHealthServices,
  getHealthService,
  updateHealthService,
  deleteHealthService,
};
