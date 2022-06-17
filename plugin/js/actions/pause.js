class PauseAction {
  type = "com.samhorne.mediamonkey5.pause";

  onKeyDown = (context) => {
    try{
      mediamonkey.pause();
    }catch{
      plugin.showAlert(context);
    }
  };
}
