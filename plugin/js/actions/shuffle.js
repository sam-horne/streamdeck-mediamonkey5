class ShuffleAction {
  type = "com.samhorne.mediamonkey5.shuffle";

  onKeyDown = (context) => {
    try{
      mediamonkey.toggleShuffle();
    }catch{
      plugin.showAlert(context);
    }
  };

  onWillAppear = () => {
    updateShuffleActions();
  }
}

const updateShuffleActions = () => {
  contexts.shuffleAction.forEach((context) => {
    plugin.setState(context, mediamonkey.shufflePlaylist ? 0 : 1);
  });
};
