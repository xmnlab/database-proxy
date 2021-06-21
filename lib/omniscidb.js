import MapdConnector from "@mapd/connector";

const MapdCon = MapdConnector.MapdCon;


export default url => {
  const config = parseURL(url);

  var connection = new MapdCon()
    .protocol(config["protocol"])
    .host(config["host"])
    .port(config["port"])
    .dbName(config["database"])
    .user(config["username"])
    .password(config["password"]);

  return async function query(req, res) {
    const client = await connection.connectAsync();
    const defaultQueryOptions = {};

    // TODO: remove it
    res["data"] = [];

    await client.queryAsync(req, defaultQueryOptions)
    .then(function(value) {
      for (const ix in value) {
        res["data"].push(value[ix]);
      }
    }).catch(function(error){
      console.log("[EE]");
      console.log(error);
    });
  };
};

function dataTypeSchema(dataTypeID) {
  switch (dataTypeID) {
    default:
      return {type: string};
  }
}

function parseURL(url){
  // pattern = /(\w+):\/\/(\w+):(\w+)\@((\w+(\.\w+)*)|([0-9](\.[0-9]+){3})):([0-9]+)\/(\w+)/;
  var pattern = /(?<protocol>\w+):\/\/(?<username>\w+):(?<password>\w+)\@(?<host>(\w+(\.\w+)*)|([0-9](\.[0-9]+){3})):(?<port>[0-9]+)\/(?<database>\w+)/;
  if (!pattern.test(url)) {
    return null;
  }

  return pattern.exec(url)['groups'];
}

// export default parseURL;
