const mediamonkey = {
  baseUrl: "http://localhost:9222/json",
  socket: null,
  album: "",
  artwork: null,
  artist: "",
  trackTitle: "",
  trackId:"",
  ratingOutOf100: null,
  trackPositionMS: null,
  trackLengthMS: null,
  isPlaying: null,
  repeatOne: null,
  repeatPlaylist: null,
  shufflePlaylist: null,
  timeoutID: null,
  volume: null,
  mute: null,
  timeoutTimeMS: 1000,
  _repeatStates: {name: ["none","one","all"],
                  repeatPlaylist: [false,true,true],
                  repeatOne: [false,true,false]
                 },

  connect: async function () {
    await fetch(this.baseUrl)
      .then(response => response.json())
      .then(data => {
        var mainwindow_id = null;
        for (let index = 0; index < data.length; index++) {
          if (data[index].title === "mainwindow.html"){
            mainwindow_id = index;
          }
        };
        this.socket = new WebSocket(data[mainwindow_id].webSocketDebuggerUrl);

        this.socket.onmessage = (event) => {
          const parsedData = JSON.parse(event.data);
          switch(parsedData.id) {
            case 1000:
              const playerInfo = parsedData.result.result.value
              const previous = JSON.parse(JSON.stringify(this));
              const currentTrack = playerInfo.currentTrack;

              if (currentTrack) {
                this.album = currentTrack.album;
                this.artist = currentTrack.albumArtist;
                this.trackTitle = currentTrack.title;
                this.trackID = currentTrack.id;
                this.ratingOutOf100 = currentTrack.rating;
                this.trackLengthMS = currentTrack.songLength;
              }

              this.trackPositionMS = playerInfo.trackPositionMS;
              this.isPlaying = playerInfo.isPlaying;
              this.repeatOne = playerInfo.repeatOne;
              this.repeatPlaylist = playerInfo.repeatPlaylist;
              this.shufflePlaylist = playerInfo.shufflePlaylist;
              this.mute = playerInfo.mute;
              this.volume = playerInfo.volume;

              if (this.trackID !== previous.trackID) {
                updateNowPlayingActions();
                updatePlayAlbumActions()
                updatePlayArtistActions()
                this.getArtwork();
              }

              if (this.trackPosition !== previous.trackPosition || this.trackLength !== previous.trackLength) {
                updateTimeActions();
              }

              if (this.ratingOutOf100 !== previous.ratingOutOf100) {
                updateRatingActions();
              }

              if (this.repeatStateId !== previous.repeatStateId) {
                updateRepeatActions();
              }

              if (this.shufflePlaylist !== previous.shufflePlaylist) {
                updateShuffleActions();
              }

              if (this.mute !== previous.mute) {
                updateMuteActions();
              }
              break;

            case 1001:
              this.artwork = parsedData.result.result.value;
              updateNowPlayingActions();
              updatePlayAlbumActions()
              break;
          }
        };

        this.socket.onopen = (event) => {
          this.startMonitoring();
        };

        this.socket.onclose = (event) => {
          this.stopMonitoring();
          this.socket = null;
          this.album = "";
          this.artwork = null;
          this.artist = "";
          this.trackTitle = "";
          this.ratingOutOf100 = null;
          this.trackPositionMS = null,
          this.trackLengthMS = null;
          this.isPlaying = null;
          updateTimeActions();
          updateRatingActions();
          updateNowPlayingActions();
          updatePlayAlbumActions();
          updatePlayArtistActions();
        };
      });
  },

  get trackPosition() {
    return this.formatTimeString(this.trackPositionMS);
  },

  get trackLength() {
    return this.formatTimeString(this.trackLengthMS);
  },

  get rating() {
    return rating = this.convertRatingOutOf100(this.ratingOutOf100);
  },

  get socketIsReady() {
    return this.socket && this.socket.readyState==1
  },

  get socketReadyState() {
    return this.socket ? this.socket.readyState : -1
  },

  next: function () {
    this.runInMediamonkey('player.nextAsync()');
  },

  pause: function () {
    this.runInMediamonkey('player.pauseAsync()');
  },

  play: function () {
    this.runInMediamonkey('player.playAsync()');
  },

  playPause: function () {
    this.runInMediamonkey('player.playPauseAsync()');
  },

  prev: function () {
    this.runInMediamonkey('player.prevAsync()');
  },

  stop: function () {
    this.runInMediamonkey('player.stopAsync()');
  },

  increaseRating: function () {
    var commands = [
      'currentTrack=player.getCurrentTrack();',
      'if (currentTrack.rating == -1){',
      '  currentTrack.rating = 10;',
      '} else if (currentTrack.rating<100) {',
      '  currentTrack.rating += 10;',
      '}',
      'currentTrack.commitAsync();'
    ];
    this.runInMediamonkey(commands);
  },

  decreaseRating: function (){
   var commands = [
      'currentTrack=player.getCurrentTrack();',
      'if (currentTrack.rating == -1){',
      '  currentTrack.rating = 0;',
      '} else if (currentTrack.rating>0) {',
      '  currentTrack.rating -= 10;',
      '}',
      'currentTrack.commitAsync();'
    ];
    this.runInMediamonkey(commands);
  },

  moveToNextRepeatState: function (){
    let nextRepeatStateId = this.repeatStateId+1;
    if (nextRepeatStateId >= this._repeatStates.name.length) nextRepeatStateId=0;
    var commands = [
      `player.repeatPlaylist = ${this._repeatStates.repeatPlaylist[nextRepeatStateId]};`,
      `player.repeatOne = ${this._repeatStates.repeatOne[nextRepeatStateId]};`,
    ];
    this.runInMediamonkey(commands);
  },

  toggleShuffle: function () {
    this.runInMediamonkey(`player.shufflePlaylist = ${!this.shufflePlaylist};`);
  },

  toggleMute: function () {
    this.runInMediamonkey(`player.mute = ${!this.mute};`);
  },

  changeVolume: function (newVolume) {
    this.runInMediamonkey(`player.volume = ${newVolume};`);
  },

  seek: function (newTimeMS) {
    this.runInMediamonkey(`player.seekMSAsync(${newTimeMS});`);
  },

  playPlaylist: function(playlistName,settings) {
    tracklistOptions = this.formatTracklistOptions(settings)
    shuffleCommand = this.formatPlayerShuffleOnPlaylist(settings)
    var commands = [
      `app.playlists.getByTitleAsync("${playlistName}")`,
      '  .then((playlist) => {',
      '    if (playlist) {',
      '      const tracklist = playlist.getTracklist();',
      '      tracklist.whenLoaded().then(function () {',
      `        options = ${tracklistOptions};`,
      `        ${shuffleCommand}`,
      '        player.addTracksAsync(tracklist,options);',
      '      });',
      '    };',
      '  });',
    ];
    this.runInMediamonkey(commands);
  },

  playAlbum: function(artist,album,settings) {
    tracklistOptions = this.formatTracklistOptions(settings)
    shuffleCommand = this.formatPlayerShuffleOnPlaylist(settings)
    var commands = [
      'currentTrack=player.getCurrentTrack();',
      `var tracklist = app.db.getTracklist('SELECT * FROM Songs WHERE Artist=\\"${artist}\\" AND Album=\\"${album}\\"', -1);`,
      'tracklist.whenLoaded().then(function () {',
      `  options = ${tracklistOptions};`,
      `  ${shuffleCommand}`,
      '  player.addTracksAsync(tracklist,options);',
      '});',
    ];
    this.runInMediamonkey(commands);
  },

  playArtist: function(artist,settings) {
    tracklistOptions = this.formatTracklistOptions(settings)
    shuffleCommand = this.formatPlayerShuffleOnPlaylist(settings)
    var commands = [
      `var tracklist = app.db.getTracklist('SELECT * FROM Songs WHERE Artist=\\"${artist}\\"', -1);`,
      'tracklist.whenLoaded().then(function () {',
      `  options = ${tracklistOptions};`,
      `  ${shuffleCommand}`,
      '  player.addTracksAsync(tracklist,options);',
      '});',
    ];
    this.runInMediamonkey(commands);
  },

  addCurrentTrackToPlaylist: function(playlistName){
    var commands = [
      `app.playlists.getByTitleAsync("${playlistName}")`,
      '  .then((playlist) => {',
      '    if (playlist) {',
      '      currentTrack=player.getCurrentTrack();',
      '      let tracklist = playlist.getTracklist();',
      '      tracklist.whenLoaded().then(()=>{',
      '        trackIDs=tracklist.getAllValues("id");',
      '        if (!trackIDs.includes(currentTrack.id)) {',
      '          playlist.addTrackAsync(currentTrack);',
      '        };',
      '      });',
      '    };',
      '  });',
    ];
    this.runInMediamonkey(commands);
  },

  removeCurrentTrackFromPlaylist: function(playlistName){
    var commands = [
      `app.playlists.getByTitleAsync("${playlistName}")`,
      '  .then((playlist) => {',
      '    if (playlist) {',
      '      currentTrack=player.getCurrentTrack();',
      '      playlist.removeTrackAsync(currentTrack);',
      '    };',
      '  });',
    ];
    this.runInMediamonkey(commands);
  },

  getInfo: function (){
   var commands = [
      'playerPromise = new Promise((resolve) => {',
      '  playerInfo = {',
      '    currentTrack:player.getCurrentTrack(),',
      '    trackPositionMS:player.trackPositionMS,',
      '    isPlaying:player.isPlaying,',
      '    repeatOne:player.repeatOne,',
      '    repeatPlaylist:player.repeatPlaylist,',
      '    shufflePlaylist:player.shufflePlaylist,',
      '    mute:player.mute,',
      '    volume:player.volume,',
      '  };',
      '  resolve(playerInfo)',
      ';})',
    ];
    this.runInMediamonkey(commands,id=1000,returnByValue=true,awaitPromise=true);
  },

  getArtwork: function (){
   var commands = [
      'imagePromise = new Promise((resolve) => {',
      '  const currentTrack=player.getCurrentTrack();',
      '  currentTrack.getThumbAsync(144, 144, function (imageLink) {',
      '    resolve(imageLink);',
      '  }); ',
      '}).then((imageLink) => {',
      '  return new Promise((resolve) => {',
      '    const canvas = document.createElement("canvas");',
      '    canvas.width = 144;',
      '    canvas.height = 144;',
      '    const ctx = canvas.getContext("2d");',
      '    const img = new Image();',
      '    img.onload = function() {',
      '      ctx.drawImage(img, 0, 0, 144, 144);',
      '      resolve(canvas.toDataURL());',
      '    };',
      '    img.src = imageLink;',
      '  });',
      '});',
    ];
    this.runInMediamonkey(commands,id=1001,returnByValue=true,awaitPromise=true);
  },

  startMonitoring: function() {
    const runMonitoring = () => {
      this.getInfo();
      this.timeoutID = setTimeout(runMonitoring, this.timeoutTimeMS);
    };
    if (this.timeoutID === null) {
      this.timeoutID = setTimeout(runMonitoring, this.timeoutTimeMS);
    }
  },

  stopMonitoring: function () {
    clearTimeout(this.timeoutID);
    this.timeoutID = null;
  },

  convertRatingOutOf100: function (ratingOutOf100) {
    let ratingOutOf5 = ""
    if (ratingOutOf100<0){
      ratingOutOf5 = "?"
    } else {
      ratingOutOf5 = (ratingOutOf100/20).toString(); // rating out of 5
    }
    return ratingOutOf5
  },

  formatTimeString: function (timeInMilliseconds) {
    const timeInSeconds = timeInMilliseconds*1e-3
    return `${timeInSeconds/60%60|0}:${(timeInSeconds%60|0).toString().padStart(2,'0')}`
  },

  get repeatStateId() {
    let repeatStateId = 0;
    for (let i = 0; i < this._repeatStates.name.length; i++) {
      if( this.repeatOne == this._repeatStates.repeatOne[i] && this.repeatPlaylist == this._repeatStates.repeatPlaylist[i]) {
        repeatStateId = i;
      }
    }
    return repeatStateId
  },

  formatTracklistOptions: function(settings={}) {
    let options = {
      startPlayback: (settings.startPlayback===undefined) ? defaults.startPlayback : settings.startPlayback,
      shuffle: (settings.shufflePlaylist===undefined) ? defaults.shufflePlaylist : settings.shufflePlaylist,
      byAlbum: (settings.sortByAlbum===undefined) ? defaults.sortByAlbum : settings.sortByAlbum,
    }
    const playlistPosition = (settings.playlistPosition===undefined) ? defaults.playlistPosition : settings.playlistPosition;

    switch(playlistPosition) {
      case "Clear":
        options.withClear = true;
        options.afterCurrent = false;
        options.position = -1;
        break;
      case "Next":
        options.withClear = false;
        options.afterCurrent = true;
        options.position = -1;
        break;
      case "Start":
        options.withClear = false;
        options.afterCurrent = false;
        options.position=0;
        break;
      case "End":
        options.withClear = false;
        options.afterCurrent = false;
        options.position=-1
        break;
    }

    return JSON.stringify(options);
  },

  formatPlayerShuffleOnPlaylist: function(settings={}) {
    const playerShuffleOnPlaylist = (settings.playerShuffleOnPlaylist===undefined) ? defaults.playerShuffleOnPlaylist : settings.playerShuffleOnPlaylist;
    
    switch(playerShuffleOnPlaylist) {
      case "Retain":
        shuffleCommand = ';';
        break;
      case "On":
        shuffleCommand = `player.shufflePlaylist = true;`;
        break;
      case "Off":
        shuffleCommand = `player.shufflePlaylist = false;`;
        break;
    }
    return shuffleCommand;
  },

  runInMediamonkey: function(expression,id=1,returnByValue=false,awaitPromise=false){
    if (Array.isArray(expression)) {
      expression = expression.join('')
    }
    const request = {id:id,method:'Runtime.evaluate',params:{expression,returnByValue,awaitPromise}}

    if (this.socketIsReady) {
      this.socket.send((JSON.stringify(request)));
    }
  }
};
