var superagent = require('superagent');
var cheerio = require('cheerio');
var word = process.argv[2] || '';
if (word === '') {
	console.log('Usage: node translator.js WORD');
	return;
}
superagent.get('http://dict.youdao.com/search?q=' + word)
	.end(function (err, resource){
		if (err)
			return callback(err);
		var $ = cheerio.load(resource.text);
		var topics = [];
		console.log($('.trans-container').first().children('ul').text());
	});
