const mongoose = require('mongoose');
const { omitBy, isNil } = require('lodash');
require('mongoose-long')(mongoose);

const modelSchema = new mongoose.Schema(
  {
    caseNumber: { type: String, required: true },
    patchId: { type: String, required: true },
    timeStamp: { type: Number, required: true },
    data: {
      deviceID: { type: String },
      deviceModel: { type: String },
      deviceName: { type: String },
      deviceSN: { type: String },
      extras: {
        time: { type: Number },
        leadOn: { type: Boolean },
        activity: { type: Boolean },
        HR: { type: Number },
        rri: [
          {
            type: Number,
          },
        ],
        rwl: [
          {
            type: Number,
          },
        ],
        acc: [
          {
            _id: false,
            x: { type: Number },
            y: { type: Number },
            z: { type: Number },
          },
        ],
        ecg: [
          {
            type: Number,
          },
        ],
        magnification: { type: Number },
        ecgFrequency: { type: Number },
        accAccuracy: { type: Number },
        accFrequency: { type: Number },
        protocol: { type: String },
        hwVer: { type: String },
        fwVer: { type: String },
        flash: { type: Boolean },
        receiveTime: { type: Number },
        battery: { type: Number },
        RR: { type: Number },
        avRR: { type: Number },
        ecgInMillivolt: [
          {
            type: Number,
            set(value) {
              return Number(value.toFixed(3));
            },
          },
        ],
        denoiseEcg: [{ type: Number }],
      },
    },
    id: { type: Number },
    time: { type: Number },
  },
  {
    timestamps: true,
  },
);

modelSchema.index(
  { caseNumber: 1, patchId: 1, timeStamp: 1 },
  { unique: true },
);
modelSchema.index({ caseNumber: 1, timeStamp: 1 });
modelSchema.index({ 'caseNumber': 1, 'timeStamp': 1, 'data.extras.HR': 1 });
modelSchema.index({ caseNumber: 1 });

modelSchema.method({
  transform() {
    const transformed = {};
    const fields = [
      'id',
      'caseNumber',
      'patchId',
      'timeStamp',
      'data',
      'createdAt',
      'updatedAt',
    ];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

modelSchema.statics = {
  /**
   * Get Service Type
   *
   * @param {ObjectId} id - The objectId of service Type.
   * @returns {Promise<User, APIError>}
   */
  async get(id) {
    try {
      let patchData;
      if (mongoose.Types.ObjectId.isValid(id)) {
        patchData = await this.findById(id).exec();
      }
      if (patchData) {
        return patchData;
      }

      throw new Error({
        message: 'Vivalink_patch_data does not exist',
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  /**
   * List Service Types in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of service types to be skipped.
   * @param {number} limit - Limit number of service types to be returned.
   * @returns {Promise<Subject[]>}
   */
  list({ patchId, caseNumber }) {
    const options = omitBy({ patchId, caseNumber }, isNil);

    return this.find(options).sort({ createdAt: -1 }).exec();
  },
  async listWithPagination({
    page = 1,
    perPage = 30,
    caseNumber,
    from,
    to,
    patchId,
  }) {
    const options = omitBy({ caseNumber, patchId }, isNil);
    if (from) {
      options.timeStamp = { $gte: from };
    }

    if (to) {
      if (options.timeStamp) {
        options.timeStamp.$lt = to;
      } else {
        options.timeStamp = { $lt: to };
      }
    }
    const liveStreaming = await this.find(options, {
      'data.extras.ecg': 1,
      'data.extras.denoiseEcg': 1,
      'timeStamp': 1,
      '_id': 0,
    })
      .sort({ timeStamp: 1 })
      .skip(perPage * (page * 1 - 1))
      .limit(perPage * 1)
      .exec();
    const count = await this.countDocuments(options).exec();
    const pages = Math.ceil(count / perPage);
    return { liveStreaming, count, pages };
  },
};

module.exports = mongoose.model(
  'vv330_patch_data',
  modelSchema,
  'vv330_patch_data',
);
