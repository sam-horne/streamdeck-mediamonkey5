class StopAction {
  type = "com.samhorne.mediamonkey5.stop";

  onKeyDown = (context) => {
    try{
      mediamonkey.stop();
    }catch{
      plugin.showAlert(context);
    }
  };
}
