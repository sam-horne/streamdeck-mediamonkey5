class PlayArtistAction {
  type = "com.samhorne.mediamonkey5.playartist";

  updateAction = (context,settings) => {
    const useCurrentTrack = (settings.useCurrentTrack===undefined) ? defaults.useCurrentTrack : settings.useCurrentTrack;
    const title = constructTitle(settings,useCurrentTrack);
    updateActionDisplay(context,title,settings)
  }

  onKeyDown = (context, settings) => {
    try{
      const useCurrentTrack = (settings.useCurrentTrack===undefined) ? defaults.useCurrentTrack : settings.useCurrentTrack;
      const artist = (useCurrentTrack) ? mediamonkey.artist : settings.artist
      mediamonkey.playArtist(artist,settings)
    }catch{
      plugin.showAlert(context);
    }
  };

  onWillAppear = () => {
    updatePlayArtistActions();
  }
}

const updatePlayArtistActions = () => {
  contexts.playArtistAction.forEach((context) => {
    plugin.getSettings(context);
  });
};
