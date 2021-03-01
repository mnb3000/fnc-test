const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const clinicSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    doctors: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Doctor',
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

clinicSchema.plugin(toJSON);

/**
 * @typedef Clinic
 */
const Clinic = mongoose.model('Clinic', clinicSchema);

module.exports = Clinic;
