class DecreaseRatingAction {
  type = "com.samhorne.mediamonkey5.decreaserating";

  onKeyDown = (context) => {
    try{
      mediamonkey.decreaseRating();
    }catch{
      plugin.showAlert(context);
    }
  };
}
