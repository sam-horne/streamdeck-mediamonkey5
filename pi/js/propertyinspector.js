class PropertyInspector extends WebSocketUtils {
  connect(inPort,inUUID,inRegisterEvent,inInfo) {
    super.connect(inPort,inUUID,inRegisterEvent,inInfo);

    this.socket.onopen = () => {
      this.registerPlugin(inUUID, inRegisterEvent);
      this.getGlobalSettings(inUUID);
    };

    this.socket.onmessage = (evt) => {
      const { event, payload } = JSON.parse(evt.data);
      if (event == "didReceiveGlobalSettings") {
        globalSettings = payload.settings;
      } else if (event == "didReceiveSettings") {
        settings = payload.settings;
      }
    }
  }

  setupControls () {
    if (action == actions.nowplaying) {
      setupDisplay("now-playing");
      setupCheckbox("display-artwork-checkbox","showArtwork",defaults.showArtwork);
      setupCheckbox("display-track-title-checkbox","showTrackTitle",defaults.showTrackTitle);
      setupCheckbox("display-artist-checkbox","showArtist",defaults.showArtist);
      setupCheckbox("display-album-checkbox","showAlbum",defaults.showAlbum);
      setupInput("title-width-input","maxTitleWidth",defaults.maxTitleWidth,true)
      setupInput("title-lines-input","maxTitleLines",defaults.maxTitleLines,true)
    } else if(action == actions.volumeup || action == actions.volumedown) {
      setupDisplay("volume");
      setupInput("volume-step-input","volumeStep",defaults.volumeStep,true)
    } else if(action == actions.seekforward || action == actions.seekbackward) {
      setupDisplay("seek");
      setupInput("seek-step-input","seekStep",defaults.seekStep,true)
    } else if(action == actions.playlist) {
      setupDisplay("playlist");
      setupInput("playlist-name-input","playlistName",defaults.playlistName)
      setupCheckbox("start-playback-checkbox","startPlayback",defaults.startPlayback);
      setupCheckbox("shuffle-playlist-checkbox","shufflePlaylist",defaults.shufflePlaylist);
      setupCheckbox("sort-by-album-checkbox","sortByAlbum",defaults.sortByAlbum);
      setupInput("playlist-position-select","playlistPosition",defaults.playlistPosition);
    } else if(action==actions.playartist || action==actions.playalbum){
      setupCheckbox("start-playback-checkbox","startPlayback",defaults.startPlayback);
      setupCheckbox("shuffle-playlist-checkbox","shufflePlaylist",defaults.shufflePlaylist);
      setupInput("playlist-position-select","playlistPosition",defaults.playlistPosition);

      setupInput("artist-name-input","artist",defaults.artist);
      setupCheckbox("display-artist-checkbox","showArtist",defaults.showArtist);
      setupInput("title-width-input","maxTitleWidth",defaults.maxTitleWidth,true)
      setupInput("title-lines-input","maxTitleLines",defaults.maxTitleLines,true)

      const checkbox = document.getElementById("play-current-checkbox");
      checkbox.checked = (settings.useCurrentTrack===undefined) ? defaults.useCurrentTrack : settings.useCurrentTrack;

      let fromInputClass = ""
      let fromCurrentClass = ""
      if (action==actions.playartist){
        setupCheckbox("sort-by-album-checkbox","sortByAlbum",defaults.sortByAlbum);
        setupDisplay("play-artist");
        fromInputClass = "play-artist-from-input";
      }
      if (action==actions.playalbum){
        setupDisplay("play-album");
        setupInput("album-name-input","album",defaults.album);
        setupCheckbox("display-artwork-checkbox","showArtwork",defaults.showArtwork);
        setupCheckbox("display-album-checkbox","showAlbum",defaults.showAlbum);
        fromInputClass = "play-album-from-input";
        fromCurrentClass = "play-album-from-current";
      }

      setupDisplay(fromInputClass,!checkbox.checked);
      setupDisplay(fromCurrentClass,checkbox.checked);

      checkbox.onchange = (evt) => {
        settings.useCurrentTrack = checkbox.checked;
        if (checkbox.checked) {
          settings.artist = defaults.artist
          settings.album = defaults.album
        } else {
          settings.showArtwork = false;
        }
        setupDisplay(fromInputClass,!checkbox.checked);
        setupDisplay(fromCurrentClass,checkbox.checked);
        propertyInspector.setSettings(action, propertyInspector.inUUID, settings);
      }
    } else if(action==actions.addtoplaylist || action==actions.removefromplaylist){
      setupDisplay("modify-playlist");
      setupInput("playlist-name-input","playlistName",defaults.playlistName);
    }
  }
}

function setupDisplay(classToDisplay,isVisible=true){
  const elementsToDisplay = document.getElementsByClassName(classToDisplay);
  for (var i = 0; i < elementsToDisplay.length; i++) {
    elementsToDisplay[i].style.display = isVisible ? "flex":"none";
  }
}

function setupCheckbox(checkboxId,settingsProperty,defaultValue){
  const checkbox = document.getElementById(checkboxId);
  checkbox.checked = (settings[settingsProperty]===undefined) ? defaultValue : settings[settingsProperty];
  checkbox.onchange = (evt) => {
    settings[settingsProperty] = checkbox.checked;
    propertyInspector.setSettings(action, propertyInspector.inUUID, settings);
  }
}

function setupInput(inputId,settingsProperty,defaultValue,castNumeric=false){
  const input = document.getElementById(inputId);
  input.value = (settings[settingsProperty]===undefined) ? defaultValue : settings[settingsProperty];
  input.onchange = (evt) => {
    settings[settingsProperty] = castNumeric ? Number(input.value):input.value;
    propertyInspector.setSettings(action, propertyInspector.inUUID, settings);
  }
}
