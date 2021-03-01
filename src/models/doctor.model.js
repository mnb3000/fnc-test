const mongoose = require('mongoose');
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

/**
 * @typedef Doctor
 */
const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
