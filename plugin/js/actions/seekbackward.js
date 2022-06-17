class SeekBackwardAction {
  type = "com.samhorne.mediamonkey5.seekbackward";

  onKeyDown = (context, settings) => {
    try{
      const seekStep = (settings.seekStep===undefined) ? defaults.seekStep : settings.seekStep;
      mediamonkey.seek(mediamonkey.trackPositionMS-seekStep*1e3);
    }catch{
      plugin.showAlert(context);
    }
  };
}
