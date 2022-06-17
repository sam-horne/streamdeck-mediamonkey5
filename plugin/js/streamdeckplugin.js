class StreamDeckPlugin extends WebSocketUtils {
  connect(inPort,inUUID,inRegisterEvent,inInfo) {
    super.connect(inPort,inUUID,inRegisterEvent,inInfo);

    this.socket.onopen = () => {
      mediamonkey.connect();
      this.registerPlugin(inUUID, inRegisterEvent);
    };

    this.socket.onclose = () => {
      mediamonkey.socket && mediamonkey.socket.close()
    };

    this.socket.onmessage = (evt) => {
      const { event, action, context, payload } = JSON.parse(evt.data);
      const { settings, coordinates } = payload || {};

      if (event === "applicationDidLaunch" || mediamonkey.socketReadyState === 3 || mediamonkey.socketReadyState === -1) {
        mediamonkey.connect()
      } else if (mediamonkey.socketIsReady) {
        mediamonkey.getInfo();
      }

      Object.keys(actions).forEach((key) => {
        if (actions[key].type === action) {
          switch (event) {
            case "keyDown":
              actions[key].onKeyDown && actions[key].onKeyDown(context,settings)
              break;

            case "willAppear":
              contexts[key] && contexts[key].push(context);
              actions[key].onWillAppear && actions[key].onWillAppear();
              break;

            case "didReceiveSettings":
              actions[key].updateAction && actions[key].updateAction(context,settings)
              break;

            case "willDisappear":
              if (plugin.titleTimeoutID[context]) {
                clearInterval(this.titleTimeoutID[context]);
                delete plugin.titleTimeoutID[context]
              }
              break;
          }
        }
      });
    }
  }
}
