import OmniSciDB from "../lib/omniscidb.js";

const defaultQueryOptions = {}

var config = {
  "host": process.env.HOSTNAME || "metis.mapd.com",
  "protocol": process.env.PROTOCOL || "https",
  "port": process.env.PORT || "443",
  "database": process.env.DATABASE || "mapd",
  "username": process.env.USERNAME || "demouser",
  "password": process.env.PASSWORD || "HyperInteractive",
};

async function test_query(){
  var url = (
    config["protocol"] + "://" +
    config["username"] + ":" +
    config["password"] + "@" +
    config["host"] + ":" +
    config["port"] + "/" +
    config["database"]
  );
  var query = OmniSciDB(url);

  const sql = (
    "SELECT carrier_name as key0, AVG(airtime) AS val FROM " +
    "flights_donotmodify WHERE airtime IS NOT NULL GROUP BY " +
    "key0 ORDER BY val DESC LIMIT 100"
  );
  var response = {};

  query(sql, response).then(function(){
    console.log(response);
  }).catch(function(error) {
    console.log(error);
  });
}

function assert_results(expected, result, message) {
  for (const f in expected) {
    console.assert(
      result[f] == expected[f],
      message + f + " doesn't match."
    );
  }
}

async function test_parse_url(){
  var result = parseURL("https://mapd:HyperInteractive@google.com:443/mapd");
  var expected = {
    protocol: "https",
    username: "mapd",
    password: "HyperInteractive",
    host: "google.com",
    port: "443",
    database: "mapd"
  };
  assert_results(expected, result, "parseURL assertion error: ");

  result = parseURL("https://mapd:HyperInteractive@127.0.0.1:443/mapd");
  expected = {
    protocol: "https",
    username: "mapd",
    password: "HyperInteractive",
    host: "127.0.0.1",
    port: "443",
    database: "mapd"
  };
  assert_results(expected, result, "parseURL assertion error: ");

  result = parseURL("https://mapd:HyperInteractive@localhost:443/mapd");
  expected = {
    protocol: "https",
    username: "mapd",
    password: "HyperInteractive",
    host: "localhost",
    port: "443",
    database: "mapd"
  };
  assert_results(expected, result, "parseURL assertion error: ");


}

function test() {
  test_query();
};

test();
