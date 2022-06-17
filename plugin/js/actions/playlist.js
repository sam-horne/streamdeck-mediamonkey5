class PlaylistAction {
  type = "com.samhorne.mediamonkey5.playlist";

  onKeyDown = (context, settings) => {
    try{
      mediamonkey.playPlaylist(settings.playlistName,settings);
    }catch{
      plugin.showAlert(context);
    }
  };
}
