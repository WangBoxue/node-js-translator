var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');

var app = express();

app.set('port', (process.env.PORT || 5001))

app.get('/', function (request, response) {
	console.log('hello world');
	response.send('hello world');
});
app.get('/:word', function (request, response, callback) {
	console.log('translating ' + request.params.word + '...');
	superagent.get('http://dict.youdao.com/search?q=' + request.params.word)
		.end(function (err, resource){
			if (err)
				return callback(err);
			var $ = cheerio.load(resource.text);
			var topics = [];
			response.send($('.trans-container').first().children('ul').text());
		});
	console.log('translation finished');
});
app.listen(app.get('port'), function() {
  console.log('listen on port ' + app.get('port'));
});
