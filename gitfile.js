var request = require('request');
var code = '25977e2dd6601684f288b008d6a1404c03cf7593'
encodedCredential = Buffer.from(code).toString('base64')
var options = {
	url: 'https://api.github.com/repos/hizuka/HeartSound/contents/test_original?ref=main',
	headers: {
		'User-Agent': 'request',	
		 Authorization:'token 25977e2dd6601684f288b008d6a1404c03cf7593'
		

	}
};


function getUrl() {
	const field = [];
	const blob = [];
	// console.log(options);
	request(options, function callback(error, response, body) {
		

		if (!error && response.statusCode == 200) {
			var info = JSON.parse(body);
			// console.log(info);
			for (var i = 0; i < info.length; i++) {
				//name
				field.push(info[i].url);
				//href
				blob.push(info[i].git_url);
			}
			// console.log("read gitpage succ:", field);
			console.log("read gitpage succ:");
			var aaa = document.querySelector('#playlist')
			var html;
			for(var i =0;i<field.length;i++){
			    html=document.createElement('a');
				// hre = 
			    html.setAttribute('href', blob[i].split("?")[0]);
				// console.log(blob[i].split("?")[0]);
			    html.setAttribute('class', 'list-group-item');
			 html.setAttribute('onclick', 'javascript:void(0);');
			    // html.style.display='block';

			 var name =((field[i].split("/")).slice(-1)) + '';
			 var name2 =(name.split("?"))[0];
			 // console.log("name2:" +name2);
			 html.innerText = name2;
			    aaa.appendChild(html);	 
			}

		} else {
			// console.log(request.headers);
			console.log("Error " + error);
		}
	});

}

// function getUrlContent(options) {
// 	const field = []
// 	// console.log(options);
// 	request(options, function callback(error, response, body) {
		

// 		if (!error && response.statusCode == 200) {
// 			var info = JSON.parse(body);
// 			console.log(info);
// 			// for (var i = 0; i < info.length; i++) {
// 			// 	field.push(info[i].download_url);
// 			// }
// 			console.log("read url content succ:", info);
// 			return info;
// 		} else {
// 			// console.log(request.headers);
// 			console.log("Error " + error);
// 		}
// 	});

// }


//请求开始
getUrl()
