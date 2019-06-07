export type AjaxAction = CompleteRequest;

export interface AjaxConfig {
    url: string
    method: "POST" | "GET" | "PUT" | "DELETE" | "PATCH"
    json?: Object
    query?: { [k: string]: string | number }
    body?: string
    headers?: { [k: string]: string }
}

export interface LoadingRequest {
    type: "loading-request"
    name: string[]
}

export function loadingRequest(name: string[]): LoadingRequest {
    return {
        type: "loading-request",
        name: name,
    }
}

export interface RequestAjax {
    effectType: "request-ajax"
    name: string[]
    config: AjaxConfig
}

export function requestAjax(name, config) {
  return {
    effectType: "request-ajax",
    name,
    config
  }
}
export interface CompleteRequest {
  type: "complete-request"
  name: string[]
  success: boolean
  status: number
  response: string
  headers: string
  when: number
}

export function completeRequest(requestEffect,
                                status, response,
                                headers, when = Date.now()) {
  return {
    type: "complete-request",
    name: requestEffect.name,
    success: status >= 200 && status < 300,
    status: status,
    response: response,
    headers: headers,
    when
  }
}

export function withAjax(dispatch, queueSize = 6, rootUrl = "") {
  return (effect) => {
    let requests = {};
    let canceled = false;
    let xhrQueue = [];
    let configsQueue = [];
    let executingCount = 0;

    const checkAndExecuteNext = () => {
      if (canceled) return;

      while (executingCount < queueSize && xhrQueue.length && configsQueue.length) {
        let nextXhr = xhrQueue.shift();
        let nextConfig = configsQueue.shift();

        executingCount++;
        if (nextConfig && nextXhr){
          executeXhrWithConfig(nextConfig, nextXhr, rootUrl);
        }
      }
    };

    let normalizedName;

    switch (effect.effectType) {
      case "request-ajax":
        normalizedName = effect.name.join("-");

        dispatch(loadingRequest(effect.name));

        let xhr = requests[normalizedName] = new XMLHttpRequest();

        const completeXhr = () => {
          executingCount--;
          if (requests[normalizedName] === xhr) {
            delete requests[normalizedName];
          }

          if (canceled) return;

          checkAndExecuteNext();
        };

        xhr.onerror = function () {
          completeXhr();

          dispatch(completeRequest(effect, 0, "", ""));
        };

        xhr.onload = function () {
          completeXhr();

          dispatch(completeRequest(effect, xhr.status, xhr.responseText, xhr.getAllResponseHeaders()));
        };

        xhr.ontimeout = function () {
          completeXhr();

          dispatch(completeRequest(effect, 408, "", ""));
        };

        if (executingCount < queueSize) {
          executingCount++;
          executeXhrWithConfig(effect.config, xhr, rootUrl);
        }
        else {
          xhrQueue.push(xhr);
          configsQueue.push(effect.config);
        }
    }
  }
}

export function executeXhrWithConfig(config, xhr, rootUrl = "") {
  xhr.withCredentials = false;

  xhr.open(config.method, getAjaxUrl(config, rootUrl), true);

  const headers = config.headers;
  if (headers) {
    for (let key in headers) {
      xhr.setRequestHeader(key, headers[key]);
    }
  }

  xhr.send(getAjaxBody(config));
}

export function urlJoin(root, path) {
  if (!root) return path;
  if (!path) return root;
  if (typeof URL === 'function') {
    return new URL(path, root).toString();
  } else {
    if (root[root.length - 1] !== '/') {
      root += '/';
    }
    if (path[0] === '/') {
      path = path.substring(1);
    }
    return root + path;
  }
}

export function getAjaxUrl(config, rootUrl = "") {
  let url = urlJoin(rootUrl, config.url);

  const query = config.query;
  if (query) {
    let parts = [];
    for (let key in query) {
      parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(query[key]));
    }

    if (parts.length) url += (url.indexOf("?") === -1 ? "?" : "&") + parts.join("&");
  }

  return url;
}

export function getAjaxBody(config) {
  if (config.body) return config.body;
  if (config.json) return JSON.stringify(config.json);
  return null;
}
