const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createHealthService = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const getHealthServices = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getHealthService = {
  params: Joi.object().keys({
    healthServiceId: Joi.string().custom(objectId).required(),
  }),
};

const updateHealthService = {
  params: Joi.object().keys({
    healthServiceId: Joi.string().custom(objectId).required(),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

const deleteHealthService = {
  params: Joi.object().keys({
    healthServiceId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createHealthService,
  getHealthServices,
  getHealthService,
  updateHealthService,
  deleteHealthService,
};
