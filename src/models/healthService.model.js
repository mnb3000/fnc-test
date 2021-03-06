const mongoose = require('mongoose');
const paginate = require('./plugins/paginate.plugin');
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
healthServiceSchema.plugin(paginate);

/**
 * @typedef HealthService
 */
const HealthService = mongoose.model('HealthService', healthServiceSchema);

module.exports = HealthService;
