class PlayAction {
  type = "com.samhorne.mediamonkey5.play";

  onKeyDown = (context) => {
    try{
      mediamonkey.play();
    }catch{
      plugin.showAlert(context);
    }
  };
}
