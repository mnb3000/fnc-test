const mongoose = require('mongoose');
const paginate = require('./plugins/paginate.plugin');
const { toJSON } = require('./plugins');

const doctorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    clinics: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Clinic',
      },
    ],
    healthServices: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'HealthService',
      },
    ],
  },
  {
    timestamp: true,
  }
);

doctorSchema.plugin(toJSON);
doctorSchema.plugin(paginate);

/**
 * @typedef Doctor
 */
const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
