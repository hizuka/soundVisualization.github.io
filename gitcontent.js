var request = require('request');

function getUrlContent(options) {
	const field = []
	// console.log(options);
	request(options, function callback(error, response, body) {
		

		if (!error && response.statusCode == 200) {
			var info = JSON.parse(body);
			console.log(info);
			// for (var i = 0; i < info.length; i++) {
			// 	field.push(info[i].download_url);
			// }
			console.log("read url content succ:", info);
			return info;
		} else {
			// console.log(request.headers);
			console.log("Error " + error);
		}
	});

}

