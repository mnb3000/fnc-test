const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const { doctorService, clinicService } = require('../services');

const createClinic = catchAsync(async (req, res) => {
  const clinic = await clinicService.createClinic(req.body);
  res.status(httpStatus.CREATED).send(clinic);
});

const getClinics = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'doctors', 'healthServices']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await clinicService.queryClinics(filter, options);
  res.send(result);
});

const getClinic = catchAsync(async (req, res) => {
  const clinic = await clinicService.getClinicById(req.params.clinicId);
  if (!clinic) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Clinic not found');
  }
  res.send(clinic);
});

const updateClinic = catchAsync(async (req, res) => {
  const clinic = await clinicService.updateClinicById(req.params.clinicId, req.body);
  res.send(clinic);
});

const deleteClinic = catchAsync(async (req, res) => {
  await clinicService.deleteClinicById(doctorService, req.params.clinicId);
  res.status(httpStatus.NO_CONTENT).send();
});

const addDoctorToClinic = catchAsync(async (req, res) => {
  const clinic = await clinicService.addDoctorToClinic(doctorService, req.body.doctorId, req.params.clinicId);
  res.send(clinic);
});

const removeDoctorFromClinic = catchAsync(async (req, res) => {
  const clinic = await clinicService.addDoctorToClinic(doctorService, req.body.doctorId, req.params.clinicId);
  res.send(clinic);
});

module.exports = {
  createClinic,
  getClinics,
  getClinic,
  updateClinic,
  deleteClinic,
  addDoctorToClinic,
  removeDoctorFromClinic,
};
