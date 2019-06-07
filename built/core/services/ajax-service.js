"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function loadingRequest(name) {
    return {
        type: "loading-request",
        name: name,
    };
}
exports.loadingRequest = loadingRequest;
function requestAjax(name, config) {
    return {
        effectType: "request-ajax",
        name: name,
        config: config
    };
}
exports.requestAjax = requestAjax;
function completeRequest(requestEffect, status, response, headers, when) {
    if (when === void 0) { when = Date.now(); }
    return {
        type: "complete-request",
        name: requestEffect.name,
        success: status >= 200 && status < 300,
        status: status,
        response: response,
        headers: headers,
        when: when
    };
}
exports.completeRequest = completeRequest;
function withAjax(dispatch, queueSize, rootUrl) {
    if (queueSize === void 0) { queueSize = 6; }
    if (rootUrl === void 0) { rootUrl = ""; }
    return function (effect) {
        var requests = {};
        var canceled = false;
        var xhrQueue = [];
        var configsQueue = [];
        var executingCount = 0;
        var checkAndExecuteNext = function () {
            if (canceled)
                return;
            while (executingCount < queueSize && xhrQueue.length && configsQueue.length) {
                var nextXhr = xhrQueue.shift();
                var nextConfig = configsQueue.shift();
                executingCount++;
                if (nextConfig && nextXhr) {
                    executeXhrWithConfig(nextConfig, nextXhr, rootUrl);
                }
            }
        };
        var normalizedName;
        switch (effect.effectType) {
            case "request-ajax":
                normalizedName = effect.name.join("-");
                dispatch(loadingRequest(effect.name));
                var xhr_1 = requests[normalizedName] = new XMLHttpRequest();
                var completeXhr_1 = function () {
                    executingCount--;
                    if (requests[normalizedName] === xhr_1) {
                        delete requests[normalizedName];
                    }
                    if (canceled)
                        return;
                    checkAndExecuteNext();
                };
                xhr_1.onerror = function () {
                    completeXhr_1();
                    dispatch(completeRequest(effect, 0, "", ""));
                };
                xhr_1.onload = function () {
                    completeXhr_1();
                    dispatch(completeRequest(effect, xhr_1.status, xhr_1.responseText, xhr_1.getAllResponseHeaders()));
                };
                xhr_1.ontimeout = function () {
                    completeXhr_1();
                    dispatch(completeRequest(effect, 408, "", ""));
                };
                if (executingCount < queueSize) {
                    executingCount++;
                    executeXhrWithConfig(effect.config, xhr_1, rootUrl);
                }
                else {
                    xhrQueue.push(xhr_1);
                    configsQueue.push(effect.config);
                }
        }
    };
}
exports.withAjax = withAjax;
function executeXhrWithConfig(config, xhr, rootUrl) {
    if (rootUrl === void 0) { rootUrl = ""; }
    xhr.withCredentials = false;
    xhr.open(config.method, getAjaxUrl(config, rootUrl), true);
    var headers = config.headers;
    if (headers) {
        for (var key in headers) {
            xhr.setRequestHeader(key, headers[key]);
        }
    }
    xhr.send(getAjaxBody(config));
}
exports.executeXhrWithConfig = executeXhrWithConfig;
function urlJoin(root, path) {
    if (!root)
        return path;
    if (!path)
        return root;
    if (typeof URL === 'function') {
        return new URL(path, root).toString();
    }
    else {
        if (root[root.length - 1] !== '/') {
            root += '/';
        }
        if (path[0] === '/') {
            path = path.substring(1);
        }
        return root + path;
    }
}
exports.urlJoin = urlJoin;
function getAjaxUrl(config, rootUrl) {
    if (rootUrl === void 0) { rootUrl = ""; }
    var url = urlJoin(rootUrl, config.url);
    var query = config.query;
    if (query) {
        var parts = [];
        for (var key in query) {
            parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(query[key]));
        }
        if (parts.length)
            url += (url.indexOf("?") === -1 ? "?" : "&") + parts.join("&");
    }
    return url;
}
exports.getAjaxUrl = getAjaxUrl;
function getAjaxBody(config) {
    if (config.body)
        return config.body;
    if (config.json)
        return JSON.stringify(config.json);
    return null;
}
exports.getAjaxBody = getAjaxBody;
