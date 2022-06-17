class PlayPauseAction {
  type = "com.samhorne.mediamonkey5.playpause";

  onKeyDown = (context) => {
    try{
      mediamonkey.playPause();
    }catch{
      plugin.showAlert(context);
    }
  };
}
