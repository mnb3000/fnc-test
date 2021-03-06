const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

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
clinicSchema.plugin(paginate);

/**
 * @typedef Clinic
 */
const Clinic = mongoose.model('Clinic', clinicSchema);

module.exports = Clinic;
