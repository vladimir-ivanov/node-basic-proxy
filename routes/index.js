var url = require('url'),
    http = require('follow-redirects').http;

exports.get = function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var url_parts = url.parse(req.url, true),
        query = url_parts.query;

    if (query.url) {

        http.get(query.url,function (res2) {

            res2.on('data', function (chunk) {
                res.write(chunk);
            });

            res2.on('end', function () {
                res.end();
            });
            console.log("Got response: " + res.statusCode);

        }).on('error', function (e) {
                console.log("Got error: " + e.message);
            });

    } else {
        res.end('url must be provided');
    }
};

exports.post = function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var options = {
        hostname: 'www.google.com',
        port: 80,
        path: '/',
        method: 'POST'
    };

    var req = http.request(options, function (res2) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res2.headers));

        res2.on('data', function (chunk) {
            res.write(chunk);
        });

        res2.on('end', function () {
            res.end();
        });
        console.log("Got response: " + res.statusCode);
    });

    req.on('error', function (e) {
        console.log('problem with request: ' + e.message);
    });

    req.end();
};