class RatingAction {
  type = "com.samhorne.mediamonkey5.rating";

  onKeyDown = (context) => {
    try{
      mediamonkey.getInfo();
    }catch{
      plugin.showAlert(context);
    }
  };

  onWillAppear = () => {
    updateRatingActions();
  }
}

const updateRatingActions = () => {
  contexts.ratingAction.forEach((context) => {
    plugin.setTitle(
      context,
      mediamonkey.rating
    );
  });
};
