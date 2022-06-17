class IncreaseRatingAction {
  type = "com.samhorne.mediamonkey5.increaserating";

  onKeyDown = (context) => {
    try{
      mediamonkey.increaseRating();
    }catch{
      plugin.showAlert(context);
    }
  };
}
