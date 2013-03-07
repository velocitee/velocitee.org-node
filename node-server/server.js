// Load the necessary servers.
var sys = require( "util" ),
    http = require( "http" ),
    url = require('url'),
    moment = require('moment'),
    config = require('./lib/config.js')();

var couchdb = require('felix-couchdb'),
    client = couchdb.createClient(5984, 'localhost', config.dbParams.username, config.dbParams.password),
    db = client.db(config.dbParams.dbName);


// Create our HTTP server.
var server = http.createServer(
    function( request, response )
    {
        try {
            var queryObject = url.parse("(" + request.url + ")", true).query;

            var toSave = {};

            queryObject.coords = JSON.parse(queryObject.coords);
            queryObject.user = JSON.parse(queryObject.user);
            queryObject.start = moment(queryObject.start);
            queryObject.version = parseInt(queryObject.version, 10);

            db.saveDoc(queryObject, function(err, ok)
            {
                if (err)
                {
                    response.writeHead( 500, {"content-type": "application/json"} );
                    response.write(JSON.stringify(err));
                    response.end();
                } else {
                    response.writeHead( 200, {"content-type": "application/json"} );
                    response.write('');
                    response.end();
                }
            });
        } catch (err) {
            response.writeHead( 500, {"content-type": "application/json"} );
            response.write(JSON.stringify({ error: 'Could not save data'}));
            response.end();
        }
    }
);

// Point the HTTP server to port 8080.
server.listen( 8080 );
// For logging....
sys.puts( "Server is running on 8080" );
