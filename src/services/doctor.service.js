const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Doctor } = require('../models');

/**
 * Create a doctor
 * @param {Object} doctorBody
 * @returns {Promise<Doctor>}
 */
const createDoctor = async (doctorBody) => {
  return Doctor.create(doctorBody);
};

/**
 * Query for doctors
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryDoctors = async (filter, options) => {
  return Doctor.paginate(filter, options);
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
 * @returns {Promise<Doctor[]>}
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
  const doctor = await getDoctorById(doctorId);
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
 * @param {UpdateQuery<Document>} updateBody Update body (RAW MONGO, USE $SET)
 * @returns {Promise<Doctor>}
 */
const updateDoctorByIdRawQuery = async (clinicId, updateBody) => {
  return Doctor.findByIdAndUpdate(clinicId, updateBody, { new: true }).exec();
};

/**
 * Updates multiple doctors by filter
 * @param {Object} filter
 * @param {UpdateQuery<Document>} updateBody Update body (RAW MONGO, USE $SET)
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
 * @param {ClinicService} clinicService
 * @param {DoctorService} doctorService
 * @param {ObjectId} doctorId
 * @returns {Promise<Doctor>}
 */
const deleteDoctorById = async (clinicService, doctorService, doctorId) => {
  const doctor = await getDoctorById(doctorId);
  if (!doctor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Doctor not found');
  }

  // Remove the doctor from all of the clinics
  await clinicService.updateClinicsByFilter({ doctors: doctorId }, { $pull: { doctors: doctorId } });

  // Deref all of doctor's health services
  await Promise.all(doctor.clinics.map((clinic) => clinicService.updateClinicHealthServices(doctorService, clinic._id)));
  await doctor.remove();
  return doctor;
};

/**
 * Add a health service to doctor (and it's clinics)
 * @param {HealthServiceService} healthServiceService
 * @param {ClinicService} clinicService
 * @param {ObjectId} healthServiceId
 * @param {ObjectId} doctorId
 * @returns {Promise<Doctor>}
 */
const addHealthServiceToDoctor = async (healthServiceService, clinicService, healthServiceId, doctorId) => {
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

/**
 * Remove health service from doctor and update clinics' health service list
 * @param {HealthServiceService} healthServiceService
 * @param {ClinicService} clinicService
 * @param {ObjectId} healthServiceId
 * @param {ObjectId} doctorId
 * @returns {Promise<Doctor>}
 */
const removeHealthServiceFromDoctor = async (healthServiceService, clinicService, healthServiceId, doctorId) => {
  const healthService = await healthServiceService.getHealthServiceById(healthServiceId);
  if (!healthService) {
    throw new ApiError(httpStatus.NOT_FOUND, 'HealthService not found');
  }
  const doctor = await getDoctorById(doctorId);
  if (!doctor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Doctor not found');
  }
  const newDoctor = await updateDoctorByIdRawQuery(doctorId, { $pull: { healthServices: healthServiceId } });
  await Promise.all(
    doctor.clinics.map((clinic) => clinic._id).map((clinicId) => clinicService.updateClinicHealthServices(clinicId))
  );
  return newDoctor;
};

/**
 * @typedef DoctorService
 */
const doctorService = {
  createDoctor,
  queryDoctors,
  getDoctorById,
  getDoctorsByIds,
  updateDoctorById,
  updateDoctorByIdRawQuery,
  updateDoctorsByFilter,
  deleteDoctorById,
  addHealthServiceToDoctor,
  removeHealthServiceFromDoctor,
};

module.exports = doctorService;
