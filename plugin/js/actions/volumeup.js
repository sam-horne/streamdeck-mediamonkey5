class VolumeUpAction {
  type = "com.samhorne.mediamonkey5.volumeup";

  onKeyDown = (context, settings) => {
    try{
      const volumeStep = (settings.volumeStep===undefined) ? defaults.volumeStep : settings.volumeStep
      mediamonkey.changeVolume(mediamonkey.volume+volumeStep/100);
    }catch{
      plugin.showAlert(context);
    }
  };
}
