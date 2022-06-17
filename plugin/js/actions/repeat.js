class RepeatAction {
  type = "com.samhorne.mediamonkey5.repeat";

  onKeyDown = (context) => {
    try{
      mediamonkey.moveToNextRepeatState();
    }catch{
      plugin.showAlert(context);
    }
  };

  onWillAppear = () => {
    updateRepeatActions();
  }
}

const updateRepeatActions = () => {
  contexts.repeatAction.forEach((context) => {
    plugin.setState(context, mediamonkey.repeatStateId);
  });
};
