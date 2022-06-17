const actions = Object.freeze({
  nowplaying: "com.samhorne.mediamonkey5.nowplaying",
  volumeup: "com.samhorne.mediamonkey5.volumeup",
  volumedown: "com.samhorne.mediamonkey5.volumedown",
  seekforward: "com.samhorne.mediamonkey5.seekforward",
  seekbackward: "com.samhorne.mediamonkey5.seekbackward",
  playlist: "com.samhorne.mediamonkey5.playlist",
  playalbum: "com.samhorne.mediamonkey5.playalbum",
  playartist: "com.samhorne.mediamonkey5.playartist",
  addtoplaylist: "com.samhorne.mediamonkey5.addtoplaylist",
  removefromplaylist: "com.samhorne.mediamonkey5.removefromplaylist",
});

let globalSettings = {}
let settings = {}
let action = ""
let propertyInspector = new PropertyInspector();

const connectElgatoStreamDeckSocket = (
  inPort,
  inUUID,
  inRegisterEvent,
  inInfo,
  inActionInfo
) => {
  const actionInfo = JSON.parse(inActionInfo);
  const info = JSON.parse(inInfo);

  const sdVersion = info.application.version;
  const pluginVersion = info.plugin.version;
  const language = info.application.language;

  settings = actionInfo.payload.settings;
  action = actionInfo.action;

  propertyInspector.connect(inPort,inUUID,inRegisterEvent,inInfo);
  propertyInspector.setupControls(action)

  const gettingStartedLink = document.getElementById("git-link");
  gettingStartedLink.onclick = () => {
    propertyInspector.openUrl(
      "https://github.com/sam-horne/streamdeck-mediamonkey5"
    );
  };
};
