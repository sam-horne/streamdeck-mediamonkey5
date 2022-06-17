class AddToPlaylistAction {
  type = "com.samhorne.mediamonkey5.addtoplaylist";

  onKeyDown = (context,settings) => {
    try{
      mediamonkey.addCurrentTrackToPlaylist(settings.playlistName);
    }catch{
      plugin.showAlert(context);
    }
  };
}
