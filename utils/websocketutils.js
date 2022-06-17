class WebSocketUtils {
  baseUrl = "ws://127.0.0.1:"
  socket = null
  inPort = null
  inUUID = null
  inRegisterEvent = null
  inInfo = null
  titleTimeoutID = []
  titleTimeoutTimeMS = 1500

  connect(inPort,inUUID,inRegisterEvent,inInfo) {
    this.inPort = inPort;
    this.inUUID = inUUID;
    this.inRegisterEvent = inRegisterEvent;
    this.inInfo = inInfo;

    this.socket = new WebSocket(this.baseUrl+this.inPort);
  }

  get socketIsReady() {
    return this.socket && this.socket.readyState==1
  }

  registerPlugin = (uuid, event) => {
    if (this.socketIsReady) {
      const data = {
        event,
        uuid,
      };
      this.socket.send(JSON.stringify(data));
    }
  }

  showAlert = (context) => {
    if (this.socketIsReady) {
      const data = {
        event: "showAlert",
        context,
      };
      this.socket.send(JSON.stringify(data));
    }
  }

  setTitle = (context, title, lineMaxLength, whiteSpaceLookup) => {
    if (this.socketIsReady) {
      title=this.formatTitle(title,lineMaxLength,whiteSpaceLookup);
      const data = {
        event: "setTitle",
        context,
        payload: {
          title,
          target: 0,
        },
      };
      this.socket.send(JSON.stringify(data));
    }
  }

  formatTitle = (text,lineMaxLength,whiteSpaceLookup) => {
    text = (typeof text === 'undefined' || text===null ) ? "" : text;
    lineMaxLength = typeof lineMaxLength !== 'undefined' ? lineMaxLength : Infinity;
    whiteSpaceLookup = typeof whiteSpaceLookup !== 'undefined' ? whiteSpaceLookup : lineMaxLength-1;

    if (text.length>lineMaxLength){
      // Split title into lineMaxLength chunks to fit on display
      const regex = new RegExp(String.raw`\s*(?:(\S{${lineMaxLength}})|([\s\S]{${lineMaxLength - whiteSpaceLookup},${lineMaxLength}})(?!\S))`, 'g');
      text = text.replace(regex, (_, x, y) => x ? `${x}-\n` : `${y}\n`);

      text = text.replace(/\n{1,}$/, '') // Remove last newline
      text = text.replace(/-{1,}$/, '') // Remove trailing -
    }
    return text
  }

  setScrollingTitle = (context,title,settings) => {
    this.titleTimeoutID[context] && clearInterval(this.titleTimeoutID[context]);
    if (this.socketIsReady) {
      const maxTitleWidth = (settings.maxTitleWidth===undefined) ? defaults.maxTitleWidth : settings.maxTitleWidth;
      const maxTitleLines = (settings.maxTitleLines===undefined) ? defaults.maxTitleLines : settings.maxTitleLines;

      title=this.formatTitle(title,maxTitleWidth);
      const titleLines = title.split(/\r\n|\r|\n/);

      if (titleLines.length<=maxTitleLines) {
        this.setTitle(context, title, Infinity)
      } else {
        let currentStartLine = 0;
        let scrolledTitle = ""
        const scrollTitle = () => {
          if (currentStartLine>(titleLines.length-1)) {
            currentStartLine = 0;
          }
          const currentEndLine = Math.min(titleLines.length,currentStartLine+(maxTitleLines));

          let scrolledTitle = ""
          for (let i = currentStartLine; i < currentEndLine; i++) {
            scrolledTitle += titleLines[i] + "\n";
          }
          scrolledTitle = scrolledTitle.replace(/\n{1,}$/, '') // Remove last newline
          this.setTitle(context, scrolledTitle, Infinity)

          currentStartLine+=maxTitleLines;
          this.titleTimeoutID[context] = setTimeout(scrollTitle, this.titleTimeoutTimeMS);
        };
        scrollTitle();
      }
    }
  }

  setImage = (context, image) => {
    if (this.socketIsReady) {
      const data = {
        event: "setImage",
        context,
        payload: {
          image
        },
      };
      this.socket.send(JSON.stringify(data));
    }
  }

  setState = (context, state) => {
    if (this.socketIsReady) {
      const data = {
        event: "setState",
        context,
        payload: {
          state,
        },
      };
      this.socket.send(JSON.stringify(data));
    }
  }

  openUrl = (url) => {
    if (this.socketIsReady) {
      const data = {
        event: "openUrl",
        payload: {
          url,
        },
      };
      this.socket.send(JSON.stringify(data));
    }
  }

  getSettings = (context) => {
    if (this.socketIsReady) {
      const data = {
        event: "getSettings",
        context,
      };
      this.socket.send(JSON.stringify(data));
    }
  }

  getGlobalSettings = (context) => {
    if (this.socketIsReady) {
      const data = {
        event: "getGlobalSettings",
        context,
      };
      this.socket.send(JSON.stringify(data));
    }
  }

  setSettings = (action, context, payload) => {
    if (this.socketIsReady) {
      const data = {
        action,
        event: "setSettings",
        context,
        payload,
      };
      this.socket.send(JSON.stringify(data));
    }
  }
}
