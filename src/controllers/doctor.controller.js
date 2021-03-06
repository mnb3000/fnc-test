const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const { doctorService, clinicService, healthServiceService } = require('../services');

const createDoctor = catchAsync(async (req, res) => {
  const doctor = await doctorService.createDoctor(req.body);
  res.status(httpStatus.CREATED).send(doctor);
});

const getDoctors = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'clinics', 'healthServices']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await doctorService.queryDoctors(filter, options);
  res.send(result);
});

const getDoctor = catchAsync(async (req, res) => {
  const doctor = await doctorService.getDoctorById(req.params.doctorId);
  if (!doctor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Doctor not found');
  }
  res.send(doctor);
});

const updateDoctor = catchAsync(async (req, res) => {
  const doctor = await doctorService.updateDoctorById(req.params.doctorId, req.body);
  res.send(doctor);
});

const deleteDoctor = catchAsync(async (req, res) => {
  await doctorService.deleteDoctorById(clinicService, req.params.doctorId);
  res.status(httpStatus.NO_CONTENT).send();
});

const addHealthServiceToDoctor = catchAsync(async (req, res) => {
  const doctor = await doctorService.addHealthServiceToDoctor(
    healthServiceService,
    clinicService,
    req.body.healthServiceId,
    req.params.doctorId
  );
  res.send(doctor);
});

const removeHealthServiceFromDoctor = catchAsync(async (req, res) => {
  const doctor = await doctorService.removeHealthServiceFromDoctor(
    healthServiceService,
    clinicService,
    req.body.healthServiceId,
    req.params.doctorId
  );
  res.send(doctor);
});

module.exports = {
  createDoctor,
  getDoctors,
  getDoctor,
  updateDoctor,
  deleteDoctor,
  addHealthServiceToDoctor,
  removeHealthServiceFromDoctor,
};
