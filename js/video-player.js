$(document).ready(function () {
    var videoPlayer = $('#videoPlayer');

    /*  Play controls */
    $('.btnPlay').click(function () {
        if (videoPlayer[0].paused) {
            videoPlayer[0].play();
            $('.glyphicon-play').attr('class', 'glyphicon glyphicon-pause');
        }
        else {
            videoPlayer[0].pause();
            $('.glyphicon-pause').attr('class', 'glyphicon glyphicon-play');
        }
        return false;

    });

    /* Mute button */
    $('.btnMute').click(function () {
        if (videoPlayer[0].muted == false) {
            videoPlayer[0].muted = true;
            $('.glyphicon-volume-up').attr('class', 'glyphicon glyphicon-volume-off');
        }
        else {
            videoPlayer[0].muted = false;
            $('.glyphicon-volume-off').attr('class', 'glyphicon glyphicon-volume-up');
        }
    });

    /* Fullscreen button*/
    $('.btnFullscreen').on('click', function () {
        videoPlayer[0].webkitRequestFullScreen();
        videoPlayer[0].mozRequestFullScreen();
        return false;

    });

    /* Current time */
    videoPlayer.on('timeupdate', function () {
        var minutes = Math.floor(videoPlayer[0].currentTime / 60);
        var seconds = Math.round(videoPlayer[0].currentTime - minutes * 60);
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        var time = minutes + ":" + seconds;
        $('.current').text(time);
    });

    /* Duration  */
    videoPlayer.on('loadedmetadata', function () {
        var minutes = Math.floor(videoPlayer[0].duration / 60);
        var seconds = Math.round(videoPlayer[0].duration - minutes * 60);
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        var time = minutes + ":" + seconds;
        $('.duration').text(time);
    });

    /* TimeRanges and total time viewed functions*/
    function printTimeRanges(tr) {
        if (tr.length == 0)
            return "none";
        s = tr.length + ": ";
        for (i = 0; i < tr.length; i++) {
            s += tr.start(i) + " - " + tr.end(i) + "; ";
        }
        return s;
    }

    function printTotalTime(tr) {
        if (tr.length == 0)
            return "none";
        s = 0;
        for (i = 0; i < tr.length; i++) {
            s += tr.end(i) - tr.start(i);
        }
        return s;
    }



    // Enable quiz button
    $('#btnQuiz').click(function () {
        $('#quizBox').show();
    });




    // Update the video stats and completed calculations , 
    // PercentViewedNeeded as a decimal allows you to adjust the required completion rate.
    videoPlayer.on('timeupdate', function () {

        var percentViewedNeeded = 1.00;
        var currentCompleted = Math.round(printTotalTime(videoPlayer[0].played));
        var requireCompleted = Math.round(videoPlayer[0].duration * percentViewedNeeded);
        var percentCompleted = Math.round((currentCompleted / requireCompleted) * 100);

        function checkCompleted(tr) {
            if (currentCompleted >= requireCompleted) {
                $('#btnQuiz').prop('disabled', false);


                return true;
            }
            else {
                return false;
            }
        }

        function rangeStart() {
            start = printTimeRanges(videoPlayer[0].played);
            seek = start[7] + start[8] + start[9] + start[10];
            return seek;
        }
        $('.viewed').text(printTimeRanges(videoPlayer[0].played));
        $('.total').text(Math.round(printTotalTime(videoPlayer[0].played)));
        $('.completed').text(checkCompleted(videoPlayer[0]));
        $('.percentViewedNeeded').text(percentViewedNeeded * 100)
        $('.requireCompleted').text(requireCompleted + " / " + Math.round(videoPlayer[0].duration));
        $('.percentCompleted').text(percentCompleted);
        $('.startpoint').text(rangeStart());
    });







//update HTML5 video current play time in the controls area
    videoPlayer.on('timeupdate', function () {
        var currentPos = videoPlayer[0].currentTime; //Get currenttime
        var maxduration = videoPlayer[0].duration; //Get video duration
        var percentage = 100 * currentPos / maxduration; //in %
        $('.timeBar').css('width', percentage + '%');
    });

    // progress bar
    var timeDrag = false;   /* Drag status */
    $('.progressBar').mousedown(function (e) {
        timeDrag = true;
        updatebar(e.pageX);
    });
    $(document).mouseup(function (e) {
        if (timeDrag) {
            timeDrag = false;
            updatebar(e.pageX);
        }
    });
    $(document).mousemove(function (e) {
        if (timeDrag) {
            updatebar(e.pageX);
        }
    });

    //update Progress Bar control
    var updatebar = function (x) {
        var progress = $('.progressBar');
        var maxduration = videoPlayer[0].duration; //Video duraiton
        var position = x - progress.offset().left; //Click pos
        var percentage = 100 * position / progress.width();

        //Check within range
        if (percentage > 100) {
            percentage = 100;
        }
        if (percentage < 0) {
            percentage = 0;
        }

        //Update progress bar and video currenttime
        $('.timeBar').css('width', percentage + '%');
        videoPlayer[0].currentTime = maxduration * percentage / 100;
    };




});