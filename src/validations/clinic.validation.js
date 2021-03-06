const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createClinic = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const getClinics = {
  query: Joi.object().keys({
    name: Joi.string(),
    doctors: Joi.string().custom(objectId),
    healthServices: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getClinic = {
  params: Joi.object().keys({
    clinicId: Joi.string().custom(objectId).required(),
  }),
};

const updateClinic = {
  params: Joi.object().keys({
    clinicId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const deleteClinic = {
  params: Joi.object().keys({
    clinicId: Joi.string().custom(objectId).required(),
  }),
};

const addDoctorToClinic = {
  params: Joi.object().keys({
    clinicId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    doctorId: Joi.string().custom(objectId).required(),
  }),
};

const removeDoctorFromClinic = {
  params: Joi.object().keys({
    clinicId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    doctorId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createClinic,
  getClinics,
  getClinic,
  updateClinic,
  deleteClinic,
  addDoctorToClinic,
  removeDoctorFromClinic,
};
