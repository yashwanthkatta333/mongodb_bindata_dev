const server = require("./bindata.service");

start = async () => {
  await server.connect();
  const data = await server.getrecordsfromdev();
  await server.putdataintobindata(data);
  // await server.getrecordsfrombindata(1694507446649, 1694597546649);
  process.exit(1);
};

start();
