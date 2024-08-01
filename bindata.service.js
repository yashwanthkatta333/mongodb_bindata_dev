const json = require("big-json");
const url =
  "mongodb://mvm-vigo-service1:v1taLs0nt%23Eg0@mongo.dev.vigolocal:27017/mvm2-data-service?authSource=admin";
const mongoose = require("mongoose");
const vv330_data_model = require("./vv33_patch.model");
const model = require("./bin.data.model");
const { assign } = require("lodash");

exports.connect = async () => {
  await mongoose.connect(url);
  console.log("db");
};
const parseStream = json.createParseStream();
async function parseData(item) {
  try {
    const data11 = {
      //   timeStramp: epochToBsonDate(item["timeStamp"]), // Provide a unique increment value
      timeStamp: item["timeStamp"],
      caseNumber: item["caseNumber"],
      ecg: item.data.extras.ecg,
    };
    var buff = Buffer.from(JSON.stringify(data11)).toString("base64");
    var data = JSON.stringify(buff);
    var timeStamp = JSON.stringify(item["timeStamp"]);
    var caseNumber = item["caseNumber"];
    // console.log(caseNumber);
    var id = item["_id"];
    // console.log(id);
    data2 = {
      _id: id,
      bin_data: data,
      createdAt: timeStamp,
      caseNumber: caseNumber,
    };
    // console.log(bigint);
    return data2;
  } catch (error) {
    console.log(error);
  }
}

exports.getrecordsfromdev = async () => {
  console.log("in counting");
  const data = await vv330_data_model
    .find({   })
    .limit(3600);
  const parsedData = await Promise.all(data.map(parseData));
  // console.log("counting done");
  return parsedData;
};
exports.putdataintobindata = async (data) => {
  const start = Date.now();
  console.log("putting records into dev_db");
  await model.insertMany(data);
  const end = Date.now();
  console.log(`sucessfully inserted records in ${end - start} milliseconds`);
};
exports.getrecordsfrombindata = async (mints, maxts) => {
  const start = Date.now();
  console.log("getting records from dev_db");
  const query = {
  //   caseNumber: "VC001VP16428",
  //   createdAt: { $gte: mints, $lte: maxts },
  };
  const datagot = await model.find(query);
  console.log(datagot.length);
  const end = Date.now();
  console.log(`sucessfully got records in ${end - start} milliseconds`);
};
