class SeekBackwardAction {
  type = "com.samhorne.mediamonkey5.seekbackward";

  onKeyDown = (context, settings) => {
    try{
      const seekStep = (settings.seekStep===undefined) ? defaults.seekStep : settings.seekStep;
      mediamonkey.seek(mediamonkey.trackPositionS-seekStep);
    }catch{
      plugin.showAlert(context);
    }
  };
}
