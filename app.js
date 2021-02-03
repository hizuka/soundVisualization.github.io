// Create a WaveSurfer instance
let wavesurfer;

/**
 * Use formatTimeCallback to style the notch labels as you wish, such
 * as with more detail as the number of pixels per second increases.
 *
 * Here we format as M:SS.frac, with M suppressed for times < 1 minute,
 * and frac having 0, 1, or 2 digits as the zoom increases.
 *
 * Note that if you override the default function, you'll almost
 * certainly want to override timeInterval, primaryLabelInterval and/or
 * secondaryLabelInterval so they all work together.
 *
 * @param: seconds
 * @param: pxPerSec
 */
function formatTimeCallback(seconds, pxPerSec) {
	seconds = Number(seconds);
	var minutes = Math.floor(seconds / 60);
	seconds = seconds % 60;

	// fill up seconds with zeroes
	var secondsStr = Math.round(seconds).toString();
	if (pxPerSec >= 25 * 10) {
		secondsStr = seconds.toFixed(2);
	} else if (pxPerSec >= 25 * 1) {
		secondsStr = seconds.toFixed(1);
	}

	if (minutes > 0) {
		if (seconds < 10) {
			secondsStr = '0' + secondsStr;
		}
		return `${minutes}:${secondsStr}`;
	}
	return secondsStr;
}

/**
 * Use timeInterval to set the period between notches, in seconds,
 * adding notches as the number of pixels per second increases.
 *
 * Note that if you override the default function, you'll almost
 * certainly want to override formatTimeCallback, primaryLabelInterval
 * and/or secondaryLabelInterval so they all work together.
 *
 * @param: pxPerSec
 */
function timeInterval(pxPerSec) {
	var retval = 1;
	if (pxPerSec >= 25 * 100) {
		retval = 0.01;
	} else if (pxPerSec >= 25 * 40) {
		retval = 0.025;
	} else if (pxPerSec >= 25 * 10) {
		retval = 0.1;
	} else if (pxPerSec >= 25 * 4) {
		retval = 0.25;
	} else if (pxPerSec >= 25) {
		retval = 1;
	} else if (pxPerSec * 5 >= 25) {
		retval = 5;
	} else if (pxPerSec * 15 >= 25) {
		retval = 15;
	} else {
		retval = Math.ceil(0.5 / pxPerSec) * 60;
	}
	return retval;
}

/**
 * Return the cadence of notches that get labels in the primary color.
 * EG, return 2 if every 2nd notch should be labeled,
 * return 10 if every 10th notch should be labeled, etc.
 *
 * Note that if you override the default function, you'll almost
 * certainly want to override formatTimeCallback, primaryLabelInterval
 * and/or secondaryLabelInterval so they all work together.
 *
 * @param pxPerSec
 */
function primaryLabelInterval(pxPerSec) {
	var retval = 1;
	if (pxPerSec >= 25 * 100) {
		retval = 10;
	} else if (pxPerSec >= 25 * 40) {
		retval = 4;
	} else if (pxPerSec >= 25 * 10) {
		retval = 10;
	} else if (pxPerSec >= 25 * 4) {
		retval = 4;
	} else if (pxPerSec >= 25) {
		retval = 1;
	} else if (pxPerSec * 5 >= 25) {
		retval = 5;
	} else if (pxPerSec * 15 >= 25) {
		retval = 15;
	} else {
		retval = Math.ceil(0.5 / pxPerSec) * 60;
	}
	return retval;
}

/**
 * Return the cadence of notches to get labels in the secondary color.
 * EG, return 2 if every 2nd notch should be labeled,
 * return 10 if every 10th notch should be labeled, etc.
 *
 * Secondary labels are drawn after primary labels, so if
 * you want to have labels every 10 seconds and another color labels
 * every 60 seconds, the 60 second labels should be the secondaries.
 *
 * Note that if you override the default function, you'll almost
 * certainly want to override formatTimeCallback, primaryLabelInterval
 * and/or secondaryLabelInterval so they all work together.
 *
 * @param pxPerSec
 */
function secondaryLabelInterval(pxPerSec) {
	// draw one every 10s as an example
	return Math.floor(10 / timeInterval(pxPerSec));
}

// Init on DOM ready
document.addEventListener('DOMContentLoaded', function() {
	wavesurfer1 = WaveSurfer.create({
		container: '#waveform1',
		waveColor: '#428bca',
		progressColor: '#000000',
		height: 120,
		// xhr: {
		// 	requestHeaders: [{
		// 		key: "Authorization",
		// 		value: 'token 25977e2dd6601684f288b008d6a1404c03cf7593'
		// 	}]
		// },
		barWidth: 0,
		barHeight: 5,
		backend: 'MediaElement',
		plugins: [
			WaveSurfer.regions.create({
				regions: [{
						start: 0,
						end: 5,
						color: 'hsla(400, 100%, 30%, 0.1)'
					},
					{
						start: 10,
						end: 100,
						color: 'hsla(200, 50%, 70%, 0.1)'
					}
				]
			}),
			WaveSurfer.timeline.create({
				container: '#timeline1',
				formatTimeCallback: formatTimeCallback,
				timeInterval: timeInterval,
				primaryLabelInterval: primaryLabelInterval,
				secondaryLabelInterval: secondaryLabelInterval,
				primaryColor: 'blue',
				secondaryColor: 'red',
				primaryFontColor: 'blue',
				secondaryFontColor: 'red'
			})
		]

	});
	// Zoom slider
	let slider = document.querySelector('[data-action="zoom"]');

	slider.value = wavesurfer1.params.minPxPerSec;
	slider.min = wavesurfer1.params.minPxPerSec;

	slider.addEventListener('input', function() {
		wavesurfer1.zoom(Number(this.value));
	});

});

// Bind controls
document.addEventListener('DOMContentLoaded', function() {
	let playPause = document.querySelector('#playPause1');
	playPause.addEventListener('click', function() {
		wavesurfer1.setMute(false);
		wavesurfer1.playPause();
		// wavesurfer2.playPause();
		// wavesurfer2.setMute(true);
	});

	// Toggle play/pause text
	wavesurfer1.on('play', function() {
		document.querySelector('#play1').style.display = 'none';
		document.querySelector('#pause1').style.display = '';
	});
	wavesurfer1.on('pause', function() {
		document.querySelector('#play1').style.display = '';
		document.querySelector('#pause1').style.display = 'none';
	});

	// The playlist links
	// let links = document.querySelectorAll('#playlist a');
	// let currentTrack = 0;

	// // Load a track by index and highlight the corresponding link
	// let setCurrentSong = function(index) {
	//     links[currentTrack].classList.remove('active');
	//     currentTrack = index;
	//     links[currentTrack].classList.add('active');
	//     wavesurfer1.load(links[currentTrack].href);
	// };

	// // Load the track on click
	// Array.prototype.forEach.call(links, function(link, index) {
	//     link.addEventListener('click', function(e) {
	//         e.preventDefault();
	//         setCurrentSong(index);
	//     });
	// });

	// Play on audio load
	// wavesurfer.on('ready', function() {
	//     wavesurfer.play();
	// });

	wavesurfer1.on('error', function(e) {
		console.warn(e);
	});

	// Go to the next track on finish
	// wavesurfer.on('finish', function() {
	//     setCurrentSong((currentTrack + 1) % links.length);
	// });

	// Load the first track
	// setCurrentSong(currentTrack);



});

//second wave
// Init on DOM ready
document.addEventListener('DOMContentLoaded', function() {
	wavesurfer2 = WaveSurfer.create({
		container: '#waveform2',
		waveColor: '#428bca',
		progressColor: '#000000',
		height: 120,
		// xhr: {
		// 	requestHeaders: [{
		// 		key: "Authorization",
		// 		value: "token " + "25977e2dd6601684f288b008d6a1404c03cf7593"
		// 	}]
		// },
		barWidth: 0,
		barHeight: 5,
		backend: 'MediaElement',
		plugins: [
			WaveSurfer.regions.create({
				regions: [{
						start: 0,
						end: 5,
						color: 'hsla(400, 100%, 30%, 0.1)'
					},
					{
						start: 10,
						end: 100,
						color: 'hsla(200, 50%, 70%, 0.1)'
					}
				]
			}),
			WaveSurfer.timeline.create({
				container: '#timeline2',
				formatTimeCallback: formatTimeCallback,
				timeInterval: timeInterval,
				primaryLabelInterval: primaryLabelInterval,
				secondaryLabelInterval: secondaryLabelInterval,
				primaryColor: 'blue',
				secondaryColor: 'red',
				primaryFontColor: 'blue',
				secondaryFontColor: 'red'
			})
		]

	});
	// Zoom slider
	let slider = document.querySelector('[data-action="zoom"]');

	slider.value = wavesurfer2.params.minPxPerSec;
	slider.min = wavesurfer2.params.minPxPerSec;

	slider.addEventListener('input', function() {
		wavesurfer2.zoom(Number(this.value));
	});

});

// Bind controls
document.addEventListener('DOMContentLoaded', function() {
	let playPause = document.querySelector('#playPause2');
	playPause.addEventListener('click', function() {
		wavesurfer2.setMute(false);
		wavesurfer2.playPause();
		// wavesurfer1.playPause();
		// wavesurfer1.setMute(true);
	});

	// Toggle play/pause text
	wavesurfer2.on('play', function() {
		document.querySelector('#play2').style.display = 'none';
		document.querySelector('#pause2').style.display = '';
	});
	wavesurfer2.on('pause', function() {
		document.querySelector('#play2').style.display = '';
		document.querySelector('#pause2').style.display = 'none';
	});


	// The playlist links
	// $(document).on('click','#btnPrepend',function(){//do something})
	//    let links = document.getElementsByTagName('a');
	// console.log(links.length);
	//    let currentTrack = 'https://raw.githubusercontent.com/hizuka/HeartSound/main/test_original/3_apex_1.wav';


	// Load a track by index and highlight the corresponding link
	// let setCurrentSong = function(index) {
	//     links[currentTrack].classList.remove('active');
	//     currentTrack = index;
	//     links[currentTrack].classList.add('active');
	//     wavesurfer2.load(links[currentTrack].href);
	// };


	// Load the track on click
	// Array.prototype.forEach.call(links, function(link, index) {
	//     link.addEventListener('click', function(e) {
	//         e.preventDefault();
	//         setCurrentSong(index);
	//     });
	// });

	// Play on audio load
	// wavesurfer.on('ready', function() {
	//     wavesurfer.play();
	// });

	wavesurfer2.on('error', function(e) {
		console.warn(e);
	});

	// Go to the next track on finish
	// wavesurfer.on('finish', function() {
	//     setCurrentSong((currentTrack + 1) % links.length);
	// });

	// Load the first track
	// setCurrentSong(currentTrack);
	$('.play-quarterx').on('click', function() {
		wavesurfer1.setPlaybackRate(0.25);
		wavesurfer2.setPlaybackRate(0.25);
	});
	$('.play-halfx').on('click', function() {
		wavesurfer1.setPlaybackRate(0.5);
		wavesurfer2.setPlaybackRate(0.5);
	});
	$('.play-75x').on('click', function() {
		wavesurfer1.setPlaybackRate(0.75);
		wavesurfer2.setPlaybackRate(0.75);
	});
	$('.play-1x').on('click', function() {
		wavesurfer1.setPlaybackRate(1);
		wavesurfer2.setPlaybackRate(1);

	});
	//volume control
	// var volumeInput = document.querySelector('#volume');
	//     var onChangeVolume = function (e) {
	//       wavesurfer.setVolume(e.target.value);
	//       console.log(e.target.value);
	//     };
	//   volumeInput.addEventListener('input', onChangeVolume);
	//   volumeInput.addEventListener('change', onChangeVolume);
	
	var $audio1 = $('#myAudio1');
	$('#input1').on('change', function(e) {
	  var target = e.currentTarget;
	  var file = target.files[0];
	  var reader1 = new FileReader();
	  
	  console.log($audio1[0]);
	   if (target.files && file) {
	        var reader1 = new FileReader();
	        reader1.onload = function (e) {
	            // $audio.attr('src', e.target.result);
	            // $audio.play();
				
				var au1 = new Audio(e.target.result);
				wavesurfer1.load(au1);
	        }
	        reader1.readAsDataURL(file);
	    }
	});
	var $audio2 = $('#myAudio2');
	$('#input2').on('change', function(e) {
	  var target = e.currentTarget;
	  var file = target.files[0];
	  var reader2 = new FileReader();
	  
	  console.log($audio2[0]);
	   if (target.files && file) {
	        var reader2 = new FileReader();
	        reader2.onload = function (e) {
	            // $audio.attr('src', e.target.result);
	            // $audio.play();
				
				var au2 = new Audio(e.target.result);
				wavesurfer2.load(au2);
	        }
	        reader2.readAsDataURL(file);
	    }
	});

});

// document.addEventListener('DOMContentLoaded', function () {
// ...some other stuff, init, options, etc, ...

//     //change playback speed


// }

function hasClass(elem, className) {
	return elem.className.split(' ').indexOf(className) > -1;
}

document.addEventListener('click', function(e) {
	if (hasClass(e.target, 'list-group-item')) {
		event.preventDefault(); //stop redirection by href
		
		$('.waitpage').show();
		// setCurrentSong(e.target);
		const anchor = e.target.closest("a"); // Find closest Anchor (or self)

		if (!anchor) console.log("err when handle click event"); // Not found. Exit here.
		// console.log(anchor.getAttribute('href'));
		href_original = anchor.getAttribute('href');
		name_orginal = anchor.innerHTML;
		alert("Please wait "+name_orginal+" audio loading..."); //alert https://api.github.com/repos/hizuka/HeartSound/git/blobs/385f1d52050044f4a4ec70e33d883cd26a4
		document.querySelector('#source').innerHTML = "curent source: "+ name_orginal;
		// href = 'https://api.github.com/repos/hizuka/HeartSound/git/blobs/070150a9428f405634f2b3da09a7731dd30d2f64';
		// wavesurfer2.load(href);
		// var snd = new Audio("data:audio/x-wav;base64, <URI data>");
		// snd.play();
		// const song = './demo.wav';
		// var info = getUrlContent(options);
		// console.log(info);
		
		//request original file
		$.ajax({
			url: href_original,
			type: 'get',
			dataType: 'json',
			headers: {
				'User-Agent': 'request',
				Authorization: 'token 26b4f5c47fc603' + '7b3864b316cc4e6e58b93289bc'

			},
			success: function(data) {
				// var info = JSON.parse(data);
				// alert('Load was performed.'+JSON.stringify(data));
				var body = JSON.stringify(data)
				var info = JSON.parse(body);
				// alert(info.content);
				var snd = new Audio("data:audio/wav;base64," + info.content);
				console.log(typeof snd);
				// snd.play();
				wavesurfer1.load(snd);

			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest.status);
				console.log(XMLHttpRequest.readyState);
			},
			complete: function(XMLHttpRequest, status) {

				console.log(XMLHttpRequest.status);
				// console.log((JSON.stringify(XMLHttpRequest)));
			} // 请求完成后最终执行参数
		});
		//request edited file
		var name_edited = name_orginal.split('.')[0];
		href_edited = 'https://api.github.com/repos/hizuka/HeartSound/contents/edited/'+ name_edited +'_edited.wav';
		console.log(href_edited);
		$.ajax({
			url: href_edited,
			type: 'get',
			dataType: 'json',
			headers: {
				'User-Agent': 'request',
				Authorization: 'token 26b4f5c47fc603' + '7b3864b316cc4e6e58b93289bc'

			},
			beforeSend: function(){
			        $('#loading').show();
			    },
			success: function(data2) {
				// var info = JSON.parse(data);
				// alert('Load was performed.'+JSON.stringify(data));
				var body2 = JSON.stringify(data2)
				var info2 = JSON.parse(body2);
				// alert(info.content);
				var snd2 = new Audio("data:audio/wav;base64," + info2.content);
				// console.log(typeof snd);
				// snd.play();
				wavesurfer2.load(snd2);

			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest.status);
				console.log(XMLHttpRequest.readyState);
			},
			complete: function(XMLHttpRequest, status) {
				 $('#loading').hide();
				console.log(XMLHttpRequest.status);
				// console.log((JSON.stringify(XMLHttpRequest)));
			} // 请求完成后最终执行参数
		});



	} else if (hasClass(e.target, 'test')) {
		alert('test');
	} else if (hasClass(e.target, 'tu')) {
		alert('tu');
	}

}, false);
