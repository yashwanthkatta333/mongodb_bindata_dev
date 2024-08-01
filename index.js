const server = require("./bindata.service");

start = async () => {
  await server.connect();
  // const data = await server.getrecordsfromdev();
  // await server.putdataintobindata(data);
  await server.getrecordsfrombindata();
  process.exit(1);
};

start();
