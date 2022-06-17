class TimeAction {
  type = "com.samhorne.mediamonkey5.time";

  onKeyDown = (context) => {
    try{
      mediamonkey.getInfo();
    }catch{
      plugin.showAlert(context);
    }
  };

  onWillAppear = () => {
    updateTimeActions();
  }
}

const updateTimeActions = () => {
  contexts.timeAction.forEach((context) => {
    let title = null
    if (!mediamonkey.trackLength) {
      plugin.setState(context, 0);
    } else {
      const trackPosition = (mediamonkey.trackPosition===null) ? mediamonkey.formatTimeString(0) : mediamonkey.trackPosition;
      title = trackPosition+"\n"+mediamonkey.trackLength;
      plugin.setState(context, 1);
    }

    plugin.setTitle(
      context,
      title
    );
  });
};
