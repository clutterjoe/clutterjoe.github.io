(function($) {
  var audioPlayer = null;
  var currentAudioFile = null;

  function playClip(name, audioFile) {
    audioPlayer = new Audio();
    audioPlayer.controls="controls";
    currentAudioFile = audioFile;
    audioPlayer.src = audioFile;
    audioPlayer.addEventListener('ended', function() {
      $('#soundboard a').removeClass('active');
      this.currentTime = 0;
      this.pause();
    });
    audioPlayer.addEventListener('error',errorFallback,true);
    audioPlayer.play();
    $('#player').html('<h3>' + name + '</h3>  ');
    $('#player').append(audioPlayer);

    function errorFallback() {
      audioPlayer.pause();
    }

  }
  function loadClips() {

  }



  $(document).ready(function() {
    $.getJSON('./audio.json', function(data) {
      var $href = null;
      for(audioType in data) {
        $href = $('<a href="#" data="">' + audioType + ' (' + data[audioType].hotkey.key + ')</a>');
        $href.data('clips', data[audioType].clips);
        $href.data('clipsAvailable', []);
        $href.data('keyCode', data[audioType].hotkey.code);

        $href.click(function(e) {
          $(this).addClass('active');
          e.preventDefault();
          var clips = $(this).data('clips');
          var clipsAvailable = $(this).data('clipsAvailable');
          if (clipsAvailable.length === 0) {
            clipsAvailable = clips.slice(0);
          }
          var key = Math.floor(Math.random() * clipsAvailable.length);
          var clip = clipsAvailable[key];

          clipsAvailable.splice(key, 1);
          $(this).data('clipsAvailable', clipsAvailable);
          if (audioPlayer !== null) {
            audioPlayer.pause();
          }
          playClip(clip.name, clip.file);

        });
        $('#soundboard').append($href);
      }
    });


    $('body').keyup(function(e){
      if (audioPlayer !== null) { // spacebar pressed
        if (e.keyCode == 32){
          audioPlayer.currentTime = 0;
          audioPlayer.play();
          return;
        }
        if (e.keyCode == 81) { // q pressed
          audioPlayer.currentTime = 0;
          audioPlayer.pause();
          return;
        }
      }
      $('#soundboard a').each(function() {
        if (e.keyCode == $(this).data('keyCode')) {
          $('#soundboard a').removeClass('active');
          $(this).trigger('click');
        }
      });


    });

  });

})(jQuery);