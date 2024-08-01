const mongoose = require("mongoose");
// require("mongoose-long")(mongoose);

const modelSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  bin_data: { type: String, required: true },
  createdAt: { type: Number, required: true },
  caseNumber: { type: String, required: true },
});

// modelSchema.index({ caseNumber: 1, timeStamp: 1 }, { unique: true });
modelSchema.index({ caseNumber: 1, createdAt: 1 });
// modelSchema.index({ caseNumber: 1 });

module.exports = mongoose.model("vv330_binData", modelSchema, "vv330_binData");
