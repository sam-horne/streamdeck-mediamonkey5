class SkipBackwardAction {
  type = "com.samhorne.mediamonkey5.skipbackward";

  onKeyDown = (context) => {
    try{
      mediamonkey.prev();
    }catch{
      plugin.showAlert(context);
    }
  };
}
