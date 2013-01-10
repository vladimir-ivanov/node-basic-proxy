var url = require('url'),
    http = require('follow-redirects').http;

exports.proxy = function(req, res){

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var url_parts = url.parse(req.url, true),
        query = url_parts.query;

    if (query.url) {

        http.get(query.url, function(res2) {

            res2.on('data', function (chunk) {
                res.write(chunk);
            });

            res2.on('end', function () {
                res.end('');
            });
            console.log("Got response: " + res.statusCode);

        }).on('error', function(e) {
                console.log("Got error: " + e.message);
            });

    } else {
        res.end('url must be provided');
    }
};