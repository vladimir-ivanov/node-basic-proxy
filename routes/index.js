var url = require('url'),
    http = require('follow-redirects').http,
    qs = require('qs');

var addCrossDomainHeaders = function (res) {
    // assumed res is the correct object
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
};

var extractProxyUrl = function (req) {
    var urlParams = url.parse(req.url, true),
        query = urlParams.query;

    return query.url || '';
};

exports.get = function (req, res) {

    var proxyUrl = extractProxyUrl(req);

    addCrossDomainHeaders(res);

    if (proxyUrl) {

        http.get(query.url,function (res2) {

            res2.on('data', function (chunk) {
                res.write(chunk);
            });

            res2.on('end', function () {
                res.end();
            });
            console.log("Got completed response: " + res.statusCode);

        }).on('error', function (e) {
                res.writeHead(503);
                console.log("Got error: " + e.message);
            });

    } else {
        res.end('url must be provided');
    }
};

exports.post = function (req, res) {

    addCrossDomainHeaders(res);

    var proxyUrl = extractProxyUrl(req),
        postData = req.post;

    if (req.method == 'POST') {
        var body = '';

        req.on('data', function (data) {
            body += data;
            if (body.length > 1e6) {
                // FLOOD ATTACK OR FAULTY CLIENT, NUKE REQUEST
                req.connection.destroy();
            }
        });

        req.on('end', function () {

            var postData = qs.parse(body);
            // parse the query.url again and split it from there
            var options = {
                hostname: proxyUrl,
                port: 80,
                path: '',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': postData.length
                }
            };

            var proxyRequest = http.request(options, function (res2) {
                console.log('STATUS: ' + res.statusCode);
                console.log('HEADERS: ' + JSON.stringify(res2.headers));

                res2.on('data', function (chunk) {
                    res.write(chunk);
                });

                res2.on('end', function () {
                    res.end();
                });
                console.log("Got completed response: " + res.statusCode);
            });

            proxyRequest.on('error', function (e) {
                res.writeHead(503);
                console.log('problem with request: ' + e.message);
            });

            proxyRequest.end();

        });
    }


};