const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Clinic } = require('../models');

/**
 * Create a clinic
 * @param {Object} clinicBody
 * @returns {Promise<Clinic>}
 */
const createClinic = async (clinicBody) => {
  return Clinic.create(clinicBody);
};

/**
 * Query for clinics
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryClinics = async (filter, options) => {
  return Clinic.paginate(filter, options);
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
 * Update a clinic by id using raw MongoDB update query
 * @param {ObjectId} clinicId
 * @param {Object} updateBody
 * @returns {Promise<Clinic>}
 */
const updateClinicByIdRawQuery = async (clinicId, updateBody) => {
  return Clinic.findByIdAndUpdate(clinicId, updateBody, { new: true }).exec();
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
 * @param {DoctorService} doctorService
 * @param {ObjectId} clinicId
 * @returns {Promise<Clinic>}
 */
const deleteClinicById = async (doctorService, clinicId) => {
  const clinic = await getClinicById(clinicId);
  if (!clinic) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Clinic not found');
  }
  await doctorService.updateDoctorsByFilter({ clinics: clinicId }, { $pull: { clinics: clinicId } });
  await clinic.remove();
  return clinic;
};

/**
 * Update all health service references by clinic id
 * @param {DoctorService} doctorService
 * @param {ObjectId} clinicId
 * @returns {Promise<Clinic>}
 */
const updateClinicHealthServices = async (doctorService, clinicId) => {
  const clinic = await getClinicById(clinicId);
  if (!clinic) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Clinic not found');
  }

  const doctors = await doctorService.getDoctorsByIds(clinic.doctors);
  clinic.healthServices = doctors.map((doctor) => doctor.healthServices).flat();

  // Health Service deduplication
  clinic.healthServices = clinic.healthServices.filter(
    (healthServiceId, index, self) => self.findIndex((t) => healthServiceId.equals(t)) === index
  );
  await clinic.save();
  return clinic;
};

/**
 * Adds a doctor and it's services to a clinic
 * @param {DoctorService} doctorService
 * @param {ObjectId} doctorId
 * @param {ObjectId} clinicId
 * @returns {Promise<Clinic>}
 */
const addDoctorToClinic = async (doctorService, doctorId, clinicId) => {
  const doctor = await doctorService.getDoctorById(doctorId);
  if (!doctor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Doctor not found');
  }
  const clinic = await getClinicById(clinicId);
  if (!clinic) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Clinic not found');
  }

  await doctorService.updateDoctorByIdRawQuery(doctorId, { $addToSet: { clinics: clinicId } });
  return updateClinicByIdRawQuery(clinicId, { $addToSet: { healthServices: { $each: doctor.healthServices } } });
};

/**
 * Remove a doctor and it's services from a clinic
 * @param {DoctorService} doctorService
 * @param {ObjectId} doctorId
 * @param {ObjectId} clinicId
 * @returns {Promise<Clinic>}
 */
const removeDoctorFromClinic = async (doctorService, doctorId, clinicId) => {
  const doctor = await doctorService.getDoctorById(doctorId);
  if (!doctor) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Doctor not found');
  }
  const clinic = await getClinicById(clinicId);
  if (!clinic) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Clinic not found');
  }

  await doctorService.updateDoctorByIdRawQuery(doctorId, { $pull: { clinics: clinicId } });
  await Clinic.findByIdAndUpdate(clinicId, { $pull: { doctors: doctorId } }).exec();
  return updateClinicHealthServices(clinicId);
};

/**
 * @typedef ClinicService
 */
const clinicService = {
  createClinic,
  queryClinics,
  getClinicById,
  updateClinicById,
  updateClinicByIdRawQuery,
  updateClinicsByFilter,
  deleteClinicById,
  updateClinicHealthServices,
  addDoctorToClinic,
  removeDoctorFromClinic,
};

module.exports = clinicService;
