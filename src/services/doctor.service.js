const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Doctor } = require('../models');
const clinicService = require('./clinic.service');

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
  await clinicService.updateClinicsByFilter({ doctors: doctorId }, { $pull: { doctors: doctorId } });
  await doctor.remove();
  return doctor;
};

module.exports = {
  createDoctor,
  getDoctorById,
  updateDoctorById,
  updateDoctorsByFilter,
  deleteDoctorById,
};
