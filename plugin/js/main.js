let actions = {
  playPauseAction: new PlayPauseAction(),
  playAction: new PlayAction(),
  pauseAction: new PauseAction(),
  skipForwardAction: new SkipForwardAction(),
  skipBackwardAction: new SkipBackwardAction(),
  stopAction: new StopAction(),
  ratingAction: new RatingAction(),
  increaseRatingAction: new IncreaseRatingAction(),
  decreaseRatingAction: new DecreaseRatingAction(),
  nowPlayingAction: new NowPlayingAction(),
  timeAction: new TimeAction(),
  repeatAction: new RepeatAction(),
  shuffleAction: new ShuffleAction(),
  muteAction: new MuteAction(),
  volumeUpAction: new VolumeUpAction(),
  volumeDownAction: new VolumeDownAction(),
  seekForwardAction: new SeekForwardAction(),
  seekBackwardAction: new SeekBackwardAction(),
  playlistAction: new PlaylistAction(),
  playArtistAction: new PlayArtistAction(),
  playAlbumAction: new PlayAlbumAction(),
  addToPlaylistAction: new AddToPlaylistAction(),
  removeFromPlaylistAction: new RemoveFromPlaylistAction(),
};

let contexts = {
  ratingAction: [],
  nowPlayingAction: [],
  timeAction: [],
  repeatAction: [],
  shuffleAction: [],
  muteAction: [],
  playArtistAction: [],
  playAlbumAction: [],
};

let plugin = new StreamDeckPlugin();

const connectElgatoStreamDeckSocket = (
  inPort,
  inUUID,
  inRegisterEvent,
  inInfo
) => {
  plugin.connect(inPort,inUUID,inRegisterEvent,inInfo);
};

function updateActionDisplay(context,title,settings) {
  plugin.setScrollingTitle(context,title,settings)

  if (settings.showArtwork) {
    plugin.setImage(context,mediamonkey.artwork)
  } else if (title!=="") {
    const blankImage = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="
    plugin.setImage(context, blankImage)
  } else {
    plugin.setImage(context, null);
  }
}

function constructTitle(settings,useCurrentTrack=true){
  let title = ""
  if (settings.showTrackTitle) {
    const trackTitle = (useCurrentTrack) ? mediamonkey.trackTitle : settings.trackTitle;
    title = title+trackTitle;
  }
  if (settings.showAlbum) {
    title = (title==="") ? title : title+" : "
    const album = (useCurrentTrack) ? mediamonkey.album : settings.album
      title = title+album;
  }
  if (settings.showArtist) {
    title = (title==="") ? title : title+" : "
    const artist = (useCurrentTrack) ? mediamonkey.artist : settings.artist
    title = title+artist;
  }
  return title
}
