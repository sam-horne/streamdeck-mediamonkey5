class SeekForwardAction {
  type = "com.samhorne.mediamonkey5.seekforward";

  onKeyDown = (context, settings) => {
    try{
      const seekStep = (settings.seekStep===undefined) ? defaults.seekStep : settings.seekStep;
      mediamonkey.seek(mediamonkey.trackPositionS+seekStep);
    }catch{
      plugin.showAlert(context);
    }
  };
}
