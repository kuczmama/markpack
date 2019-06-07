"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function historyPush(location) {
    return {
        effectType: "history-push",
        location: location
    };
}
exports.historyPush = historyPush;
function historyReplace(location) {
    return {
        effectType: "history-replace",
        location: location
    };
}
exports.historyReplace = historyReplace;
function visit(location) {
    return {
        type: "visit",
        location: location
    };
}
exports.visit = visit;
function linkClick(location) {
    return {
        type: 'link-click',
        location: location
    };
}
exports.linkClick = linkClick;
function inferBasePath() {
    var tags = document.getElementsByTagName("BASE");
    if (tags.length === 0)
        return "/";
    var parts = (tags[tags.length - 1]).href.split("/");
    return "/" + parts.slice(3).join("/");
}
exports.inferBasePath = inferBasePath;
function visitDispatcher(dispatch) {
    return (function (event) {
        var anchorElement = event.target;
        while (anchorElement.parentElement != null && anchorElement.tagName != "A") {
            anchorElement = anchorElement.parentElement;
        }
        var pathname = anchorElement.pathname, search = anchorElement.search, hash = anchorElement.hash;
        if (pathname[0] !== '/')
            pathname = '/' + pathname;
        var basePath = inferBasePath();
        if (pathname.slice(0, basePath.length) === basePath) {
            pathname = "/" + pathname.slice(basePath.length);
        }
        dispatch(linkClick({
            pathname: pathname,
            search: search,
            hash: hash
        }));
        event.preventDefault();
    });
}
exports.visitDispatcher = visitDispatcher;
function withNavigation(dispatch) {
    history.pushState = (function (f) { return function pushState() {
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('pushState'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    }; })(history.pushState);
    history.replaceState = (function (f) { return function replaceState() {
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('replaceState'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    }; })(history.replaceState);
    window.addEventListener('popstate', function () {
        window.dispatchEvent(new Event('locationchange'));
    });
    window.addEventListener('locationchange', function () {
        dispatch(visit(location));
    });
    return function (effect) {
        switch (effect.effectType) {
            case 'history-replace':
                history.replaceState({}, null, effect.location);
                break;
            case 'history-push':
                history.pushState({}, null, effect.location);
                break;
        }
    };
}
exports.withNavigation = withNavigation;
