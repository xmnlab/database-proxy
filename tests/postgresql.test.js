/*
 * node --trace-warnings  tests/postgresql.test.js
 */
require = require("esm")(module);

const PostgreSQL = require("../lib/postgres.js").default;
const http = require("http");

console.log(PostgreSQL);

const defaultQueryOptions = {}

/*
 * Test using curl:
 * $ curl localhost:8001 \
 *   -H "Content-Type: application/json" \
 *   --data '{"sql": "SELECT * FROM testtb"}'
 */
async function test_query(){
  const server = http.createServer((req, res) => {
    var url = "postgresql://postgres:postgres@localhost:25432/testdb";
    var query = PostgreSQL(url);

    // const sql = "SELECT * FROM testtb";
    // const params = [];
    console.log("[test] before query call");

    query(req, res).then(function(response){
      console.log("query done");
      console.log(response);
    }).catch(function(error) {
      console.log(error);
    });
  });

  server.listen(8001, () => {
    console.log("Database proxy");
  });
}

function test() {
  test_query();
};

test();
