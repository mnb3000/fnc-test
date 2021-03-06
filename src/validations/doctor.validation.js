const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createDoctor = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const getDoctors = {
  query: Joi.object().keys({
    name: Joi.string(),
    clinics: Joi.string().custom(objectId),
    healthServices: Joi.string().custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getDoctor = {
  params: Joi.object().keys({
    doctorId: Joi.string().custom(objectId).required(),
  }),
};

const updateDoctor = {
  params: Joi.object().keys({
    doctorId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const deleteDoctor = {
  params: Joi.object().keys({
    doctorId: Joi.string().custom(objectId).required(),
  }),
};

const addHealthServiceToDoctor = {
  params: Joi.object().keys({
    doctorId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    healthServiceId: Joi.string().custom(objectId).required(),
  }),
};

const removeHealthServiceFromDoctor = {
  params: Joi.object().keys({
    doctorId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    healthServiceId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createDoctor,
  getDoctors,
  getDoctor,
  updateDoctor,
  deleteDoctor,
  addHealthServiceToDoctor,
  removeHealthServiceFromDoctor,
};
