class MuteAction {
  type = "com.samhorne.mediamonkey5.mute";

  onKeyDown = (context) => {
    try{
      mediamonkey.toggleMute();
    }catch{
      plugin.showAlert(context);
    }
  };

  onWillAppear = () => {
    updateMuteActions();
  }
}

const updateMuteActions = () => {
  contexts.muteAction.forEach((context) => {
    plugin.setState(context, mediamonkey.mute ? 0 : 1);
  });
};
