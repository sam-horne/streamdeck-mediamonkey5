class SkipForwardAction {
  type = "com.samhorne.mediamonkey5.skipforward";

  onKeyDown = (context) => {
    try{
      mediamonkey.next();
    }catch{
      plugin.showAlert(context);
    }
  };
}
