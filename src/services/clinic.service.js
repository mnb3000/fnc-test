const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Clinic } = require('../models');
const doctorService = require('./doctor.service');

/**
 * Create a clinic
 * @param {Object} clinicBody
 * @returns {Promise<Clinic>}
 */
const createClinic = async (clinicBody) => {
  return Clinic.create(clinicBody);
};

/**
 * Get a clinic by it's ObjectId
 * @param {ObjectId} clinicId
 * @returns {Promise<Clinic>}
 */
const getClinicById = async (clinicId) => {
  return Clinic.findById(clinicId).exec();
};

/**
 * Update a clinic by id
 * @param {ObjectId} clinicId
 * @param {Object} updateBody
 * @returns {Promise<Clinic>}
 */
const updateClinicById = async (clinicId, updateBody) => {
  const clinic = await getClinicById(clinicId);
  if (!clinic) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Clinic not found');
  }
  Object.assign(clinic, updateBody);
  await clinic.save();
  return clinic;
};

/**
 * Updates multiple clinics by filter
 * @param {Object} filter
 * @param {Object} updateBody Update body (RAW MONGO, USE $SET)
 * @returns {Promise<Number>} Number of updated documents
 */
const updateClinicsByFilter = async (filter, updateBody) => {
  const res = await Clinic.updateMany(filter, updateBody);
  if (!res.ok) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Clinic DB update error');
  }
  return res.nModified;
};

/**
 * Delete a clinic and it's references by id
 * @param {ObjectId} clinicId
 * @returns {Promise<Clinic>}
 */
const deleteClinicById = async (clinicId) => {
  const clinic = await getClinicById(clinicId);
  if (!clinic) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Clinic not found');
  }
  await doctorService.updateDoctorsByFilter({ clinics: clinicId }, { $pull: { clinics: clinicId } });
  await clinic.remove();
  return clinic;
};

module.exports = {
  createClinic,
  getClinicById,
  updateClinicById,
  updateClinicsByFilter,
  deleteClinicById,
};
