class RemoveFromPlaylistAction {
  type = "com.samhorne.mediamonkey5.removefromplaylist";

  onKeyDown = (context,settings) => {
    try{
      mediamonkey.removeCurrentTrackFromPlaylist(settings.playlistName);
    }catch{
      plugin.showAlert(context);
    }
  };
}
