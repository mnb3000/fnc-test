const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Doctor } = require('../models');
const clinicService = require('./clinic.service');
const healthServiceService = require('./healthService.service');

/**
 * Create a doctor
 * @param {Object} doctorBody
 * @returns {Promise<Doctor>}
 */
const createDoctor = async (doctorBody) => {
  return Doctor.create(doctorBody);
};

/**
 * Get doctor by ID
 * @param {ObjectId} doctorId
 * @returns {Promise<Doctor>}
 */
const getDoctorById = async (doctorId) => {
  return Doctor.findById(doctorId).exec();
};

/**
 * Get multiple doctors by ids
 * @param {ObjectId[]} doctorIds
 * @returns {Promise<Array<Doctor>>}
 */
const getDoctorsByIds = async (doctorIds) => {
  return Doctor.find({ _id: { $in: doctorIds } }).exec();
};

/**
 * Update a doctor by id
 * @param {ObjectId} doctorId
 * @param {Object} updateBody
 * @returns {Promise<Doctor>}
 */
const updateDoctorById = async (doctorId, updateBody) => {
  const doctor = getDoctorById(doctorId);
  if (!doctor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Doctor not found');
  }
  Object.assign(doctor, updateBody);
  await doctor.save();
  return doctor;
};

/**
 * Update a doctor by id using raw MongoDB update query
 * @param {ObjectId} clinicId
 * @param {Object} updateBody
 * @returns {Promise<Doctor>}
 */
const updateDoctorByIdRawQuery = async (clinicId, updateBody) => {
  return Doctor.findByIdAndUpdate(clinicId, updateBody, { new: true }).exec();
};

/**
 * Updates multiple doctors by filter
 * @param {Object} filter
 * @param {Object} updateBody Update body (RAW MONGO, USE $SET)
 * @returns {Promise<Number>} Number of updated documents
 */
const updateDoctorsByFilter = async (filter, updateBody) => {
  const res = await Doctor.updateMany(filter, updateBody);
  if (!res.ok) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Doctor DB update error');
  }
  return res.nModified;
};

/**
 * Delete a doctor by id
 * @param {ObjectId} doctorId
 * @returns {Promise<Doctor>}
 */
const deleteDoctorById = async (doctorId) => {
  const doctor = await getDoctorById(doctorId);
  if (!doctor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Doctor not found');
  }

  // Remove the doctor from all of the clinics
  await clinicService.updateClinicsByFilter({ doctors: doctorId }, { $pull: { doctors: doctorId } });

  // Deref all of doctor's health services
  await Promise.all(doctor.clinics.map((clinic) => clinicService.updateClinicHealthServices(clinic._id)));
  await doctor.remove();
  return doctor;
};

const addHealthServiceToDoctor = async (healthServiceId, doctorId) => {
  const healthService = await healthServiceService.getHealthServiceById(healthServiceId);
  if (!healthService) {
    throw new ApiError(httpStatus.NOT_FOUND, 'HealthService not found');
  }
  const doctor = await getDoctorById(doctorId);
  if (!doctor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Doctor not found');
  }
  await clinicService.updateClinicsByFilter({ doctors: doctorId }, { $addToSet: { healthServices: healthServiceId } });
  return updateDoctorByIdRawQuery(doctorId, { $addToSet: { healthServices: healthServiceId } });
};

module.exports = {
  createDoctor,
  getDoctorById,
  getDoctorsByIds,
  updateDoctorById,
  updateDoctorByIdRawQuery,
  updateDoctorsByFilter,
  deleteDoctorById,
  addHealthServiceToDoctor,
};
