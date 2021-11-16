'use strict';

const app = {
    audio: null,
    tracks: [], 
    currentUrl: null,
    
    currentTime: null,
    duration: null,
    btnPlayPause: null,

    volume: null,
    seekslider: null,
    seeking: false,
    seekto: null,
    stocare: window.localStorage,
};

/**
 * @param {string} url
 */
app.play = function (url) {
    const elements = document.querySelectorAll('#playlist li.active');
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove('active');
    }

    const selectedElement = document.querySelector('#playlist li[data-url="' + url + '"]');
    selectedElement.classList.add('active');

    app.currentUrl = url;
    app.audio.src = app.currentUrl;
    app.audio.load();
    app.audio.play();

    app.stocare.setItem("melodieCurenta", app.currentUrl);
}

app.next = function () {
    let index = app.tracks.indexOf(app.currentUrl) + 1;
    if (index >= app.tracks.length) {
        index = 0;
    }

    app.play(app.tracks[index]);
}

app.load = function () {
    app.audio = document.getElementById('audio');
    app.currentTime = document.querySelector('#currentTime');
    app.duration = document.querySelector('#duration');
    app.btnPlayPause = document.getElementById('btnPlayPause');

    const elements = document.querySelectorAll('#playlist li');
    for (let i = 0; i < elements.length; i++) {

        const url = elements[i].dataset.url;
        app.tracks.push(url);

        elements[i].addEventListener('click', function () {
            app.play(this.dataset.url);
        });
    }

    app.audio.addEventListener('durationchange', function () {
        app.duration.textContent = app.secondsToString(app.audio.duration);
    });

    app.audio.addEventListener('timeupdate', function () {
        const currentTime = app.audio.currentTime;

        if (app.audio.duration) {
            app.currentTime.textContent = app.secondsToString(currentTime);
        }
        else {
            app.currentTime.textContent = '...';
        };

        app.stocare.setItem("timpCurent", app.audio.currentTime);
    });

    app.audio.addEventListener('play', function () {
        app.btnPlayPause.children[0].classList.remove('fa-play');
        app.btnPlayPause.children[0].classList.add('fa-pause');
    });

    app.audio.addEventListener('pause', function () {
        app.btnPlayPause.children[0].classList.add('fa-play');
        app.btnPlayPause.children[0].classList.remove('fa-pause');
    });

    app.audio.addEventListener('ended', app.next);

    document.getElementById('btnPlayPause').addEventListener('click', function () {
        if (app.audio.src === "") {
            if ("melodieCurenta" in app.stocare) {
                app.audio.src = app.stocare.getItem("melodieCurenta");
                app.audio.currentTime = app.stocare.getItem("timpCurent");
                app.audio.play();
            }
        } else {
            if (app.audio.paused) {
                app.audio.play();
            }
            else {
                app.audio.pause();
            }
        }
    });

    document.getElementById('btnForward').addEventListener('click', function () {
        app.audio.currentTime += 10;
    });

    document.getElementById('btnNext').addEventListener('click', app.next);
};

/**
* @param {number} seconds
* @return {string}
**/
app.secondsToString = function (seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);

    min = min >= 10 ? min : '0' + min;
    sec = sec >= 10 ? sec : '0' + sec;

    const time = min + ':' + sec;

    return time;
};

app.volume = document.getElementById("volume");
app.volume.addEventListener("mousemove", function () {
    app.audio.volume = app.volume.value / 100;
});

app.seekslider = document.getElementById("seekslider");
app.dur = function (){
    app.seekslider.max=app.audio.duration;  
}

app.sync = function (){
    app.seekslider.value=app.audio.currentTime;    
}

app.set = function (){
    app.audio.currentTime=app.seekslider.value;
    
}