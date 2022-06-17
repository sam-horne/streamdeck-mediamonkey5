class NowPlayingAction {
  type = "com.samhorne.mediamonkey5.nowplaying";

  updateAction = (context,settings) => {
    const title = constructTitle(settings,true);
    updateActionDisplay(context,title,settings)
  }

  onKeyDown = (context) => {
    try{
      mediamonkey.playPause();
    }catch{
      plugin.showAlert(context);
    }
  };

  onWillAppear = () => {
    updateNowPlayingActions();
  }
}

const updateNowPlayingActions = () => {
  contexts.nowPlayingAction.forEach((context) => {
    plugin.getSettings(context);
  });
};
