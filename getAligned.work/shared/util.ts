function create_window_wrap(window: Window, target_window: Window) {
  let _resolvers: any = [];

  window.addEventListener("message", async (event) => {
    console.log("util shared 1");
    if (event.data) {
      let name = event.data.name;
      let meta = event.data.meta;
      let data = event.data.data;

      if (
        name === "exec_result" &&
        meta &&
        meta.response &&
        _resolvers[meta.request_id]
      ) {
        _resolvers[meta.request_id](data.result);
      }
    }
  });

  return {
    exec: (name: string, data?: any) => {
      return new Promise((r) => {
        let request_id = _resolvers.length;
        _resolvers.push(r);
        let meta = { request_id, request: true };

        target_window.postMessage({ name, meta, data }, "*");
      });
    },
  };
}

function create_window_api(methods: any) {
  window.addEventListener("message", async (event: any) => {
    console.log("util shared 2");
    if (event.data) {
      let name = event.data.name;
      let meta = event.data.meta;
      let data = event.data.data;

      if (methods[name]) {
        let result = null;

        try {
          result = await methods[name](data);
        } catch (e) {}

        if (event.source && event.source.postMessage) {
          let source = event.source as Window;
          source.postMessage(
            {
              name: "exec_result",
              meta: {
                response: true,
                request_id: meta.request_id,
              },
              data: { result },
            },
            "*"
          );
        }
      }
    }
  });
}


//not used
function create_iframe_wrap(iframe: any) {
  let promise = new Promise((r) => {
    let listener = (event: any) => {
      if (
        event.data &&
        event.data.name === "iframe_ready" &&
        iframe.contentWindow === event.source
      ) {
        let iframe_window = event.source;
        window.removeEventListener("message", listener);
        r(this.create_window_wrap(window, iframe_window));
      }
    };

    window.addEventListener("message", listener);
  });

  return {
    exec: (name, data) => {
      return promise.then((wrap: any) => {
        return wrap.exec(name, data);
      });
    },
  };
}
