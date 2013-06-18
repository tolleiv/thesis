
/**
    Demo queries:

    /solr/select/?q=*%3A*&indent=on&fl=*,score,dist(2,vector(0.57,-1.01,0.66,0.11),features)&debugQuery=on
    /solr/select/?qq=*:*&b=div(1,dist(2,vector(0.57,-1.01,0.66,0.10),features))&q=%7B!boost%20b=$b%20v=$qq%7D&fl=*,score&debugQuery=on

    /solr/select/?qq=*:*&v=vector(0.57,-1.01,0.66,0.11)&b=div(1,dist(2,$v,features))&q=%7B!boost%20b=$b%20v=$qq%7D&fl=*,score&debugQuery=on
    /solr/select/?qq=content:Josef&v=vector(0.57,-1.01,0.66,0.11)&b=div(1,dist(2,$v,features))&q=%7B!boost%20b=$b%20v=$qq%7D&fl=*,score&debugQuery=on


    qq = *:*
    b = div(1, dist(2,$v, features))
    v = vector(0.57,-1.01,0.66,0.11)
    q = {!boost b=$b defType=dismax v=$qq}

**/


var solr = require('solr');
var request = require('request');
var readline = require('readline');

var solrConf = {
    core:'/imdb',
    port:8080
};

var client = solr.createClient(solrConf);

function movieContent(name, callback) {
    path = '/?type=json&plot=full&episode=1&limit=1&yg=0&mt=none&lang=en-US&offset=&aka=simple&release=simple&business=0&tech=0';
    if (name.match(/^tt/)) {
      path += '&ids=' + name;
    } else {
      path += '&title='+ encodeURIComponent(name.replace(/^.*\((.*)\) (\(\d{4}\))$/, '$1 $2'))
    }
//    console.info(path);
    request({url: 'http://imdbapi.org' + path, json:true}, function (error, response, body) {
	if (!error && response.statusCode == 200 && typeof body.code == 'undefined') {
	    callback(body[0])
	} else {
	    console.log("Movie '" + name + "' wasn't found " + body.code)
	}
    });
}

/*
movieContent("Toy Story (1995)", function(doc) {
    console.log(doc)
})
*/

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', function (cmd) {
   var line = cmd.split(/::/)
   movieContent(line[3] || line[1], function(doc) {



try {
	var solrDoc = {
	    id: line[0],
	    content: doc.plot,
	    title: doc.title,
	    rating: doc.rating,
	    genre: doc.genres,
	    plot_simple: doc.plot_simple,
	    poster_url: doc.poster,
	    imdb_url: doc.imdb_url,
	    writers: doc.writers,
	    directors: doc.directors,
	    actors: doc.actors,
	    also_known_as: doc.also_known_as,
	    year: doc.year
	    //release: (doc.release_date + "").replace(/^(\d{4})(\d{2})(\d{2})/g,"$1-$2-$3T00:00:00Z")
	}

	client.add(solrDoc, function (err) {
	    if (err) {
	      console.log("Doc " + line[0] + " ("+ line[1] + ") produced error during indexing")
	      } else {
		client.commit();
	    }
	});
}  catch (e) {
    console.log("Doc " + line[0] + " ("+ line[1] + ") produced error: " + e.message)
}

    //console.log("Movie" + line[0] + " was " +  doc.title)
    });
});

