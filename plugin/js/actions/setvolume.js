class SetVolumeAction {
  type = "com.samhorne.mediamonkey5.setvolume";

  onKeyDown = (context, settings) => {
    try{
      const volumeStep = (settings.volume===undefined) ? defaults.volume : settings.volume
      mediamonkey.changeVolume(volumeStep/100);
    }catch{
      plugin.showAlert(context);
    }
  };
}
