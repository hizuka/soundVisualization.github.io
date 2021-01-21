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
        barWidth: 0,
        barHeight: 5,
        backend: 'MediaElement',
        plugins: [
            WaveSurfer.regions.create({
                regions: [
                    {
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
        wavesurfer2.playPause();
        wavesurfer2.setMute(true);
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
        barWidth: 0,
        barHeight: 5,
        backend: 'MediaElement',
        plugins: [
            WaveSurfer.regions.create({
                regions: [
                    {
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
        wavesurfer1.playPause();
        wavesurfer1.setMute(true);
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

});



function hasClass(elem, className) {
    return elem.className.split(' ').indexOf(className) > -1;
}

document.addEventListener('click', function (e) {
    if (hasClass(e.target, 'list-group-item')) {
		event.preventDefault(); //stop redirection by href
		alert("Audio source: " + e.target);    //alert https://raw......
		// setCurrentSong(e.target);
		const anchor = e.target.closest("a");   // Find closest Anchor (or self)
		
		if (!anchor) console.log("err when handle click event");                        // Not found. Exit here.
		console.log( anchor.getAttribute('href'));
		href = anchor.getAttribute('href')
		name = anchor.innerHTML
		wavesurfer2.load(href);
		wavesurfer1.load(href);
		document.querySelector('#source').innerHTML = "curent source: "+ name;
        
    } else if (hasClass(e.target, 'test')) {
        alert('test');
    } else if (hasClass(e.target, 'tu')) {
        alert('tu');
    }

}, false);

