var url = require('url'),
    http = require('follow-redirects').http;

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
exports.proxy = function(req, res){

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var url_parts = url.parse(req.url, true),
        query = url_parts.query;

    if (query.feedUrl) {
        http.get(query.feedUrl, function(res2) {

            var data = '';
            res2.on('data', function (chunk) {
                data += chunk;
                res.write(data);
            });

            res2.on('end', function () {
                console.log(data);
                res.end(data);
            });
            console.log("Got response: " + res.statusCode);
        }).on('error', function(e) {
                console.log("Got error: " + e.message);
            });
    } else {
        res.end('feedUrl must be provided');
    }



  //  res.render('proxy', { content: 'Proxy' });
};