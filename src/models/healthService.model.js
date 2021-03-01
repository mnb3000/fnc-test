const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const healthServiceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamp: true,
  }
);

healthServiceSchema.plugin(toJSON);

/**
 * @typedef HealthService
 */
const HealthService = mongoose.model('HealthService', healthServiceSchema);

module.exports = HealthService;
