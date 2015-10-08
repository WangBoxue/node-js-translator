var superagent = require('superagent');
var cheerio = require('cheerio');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('words.db');

var word = process.argv[2] || '';
if (word === '') {
    console.log('Usage: node translator.js WORD');
    return;
}
db.all('select translation from words where word="' + word + '"', function (err, rows) {
    if (err) {
        return err;
    } else  if (rows && rows.length > 0) {
	rows[0].translation.split(',').forEach(function (translation) {console.log(translation);});
    } else {
	fetch(word);
    }
});

function fetch(word) {
    superagent.get('http://dict.youdao.com/search?q=' + word)
        .end(function (err, resource){
	    if (err) {
	    	return err;
            }
	    var $ = cheerio.load(resource.text);
	    var result = [];
	    $('.trans-container').first().children('ul').children().each(function (idx, element) {
	 	result.push($(element).text().trim().replace(/\s+/g, ' '));
	    });
	    result.forEach(function (translation) {
		console.log(translation);
	    });
	    var stmt = db.prepare("insert into words(word, translation) values (?, ?)");
	    stmt.run(word, result.join(','));
  	    stmt.finalize();
    });
}
