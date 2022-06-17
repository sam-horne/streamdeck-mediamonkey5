class VolumeDownAction {
  type = "com.samhorne.mediamonkey5.volumedown";

  onKeyDown = (context, settings) => {
    try{
      const volumeStep = (settings.volumeStep===undefined) ? defaults.volumeStep : settings.volumeStep
      mediamonkey.changeVolume(mediamonkey.volume-volumeStep/100);
    }catch{
      plugin.showAlert(context);
    }
  };
}
