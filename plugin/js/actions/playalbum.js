class PlayAlbumAction {
  type = "com.samhorne.mediamonkey5.playalbum";

  updateAction = (context,settings) => {
    const useCurrentTrack = (settings.useCurrentTrack===undefined) ? defaults.useCurrentTrack : settings.useCurrentTrack;
    const title = constructTitle(settings,useCurrentTrack);
    updateActionDisplay(context,title,settings)
  }

  onKeyDown = (context, settings) => {
    try{
      const useCurrentTrack = (settings.useCurrentTrack===undefined) ? defaults.useCurrentTrack : settings.useCurrentTrack;
      const artist = (useCurrentTrack) ? mediamonkey.artist : settings.artist
      const album = (useCurrentTrack) ? mediamonkey.album : settings.album

      mediamonkey.playAlbum(artist,album,settings)
    }catch{
      plugin.showAlert(context);
    }
  };

  onWillAppear = () => {
    updatePlayAlbumActions();
  }
}

const updatePlayAlbumActions = () => {
  contexts.playAlbumAction.forEach((context) => {
    plugin.getSettings(context);
  });
};
