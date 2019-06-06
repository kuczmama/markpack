export function historyPush(location) {
    return {
        effectType: "history-push",
        location: location
    }
}

export function historyReplace(location) {
    return {
        effectType: "history-replace",
        location
    }
}

export function visit(location) {
    return {
        type: "visit",
        location: location
    };
}

export function linkClick(location) {
    return {
        type: 'link-click',
        location: location
    }
}

export function inferBasePath() {
    let tags = document.getElementsByTagName("BASE");
    if (tags.length === 0) return "/";

    let parts = (tags[tags.length - 1]).href.split("/");
    return "/" + parts.slice(3).join("/");
}


export function visitDispatcher(dispatch) {
    return ((event) => {
        let anchorElement = event.target;

        while (anchorElement.parentElement != null && anchorElement.tagName != "A") {
            anchorElement = anchorElement.parentElement;
        }

        let {
            pathname,
            search,
            hash
        } = anchorElement;

        if (pathname[0] !== '/') pathname = '/' + pathname;

        let basePath = inferBasePath();
        if (pathname.slice(0, basePath.length) === basePath) {
            pathname = "/" + pathname.slice(basePath.length);
        }

        dispatch(linkClick({
            pathname,
            search,
            hash
        }));
        event.preventDefault();
    });
}

export function withNavigation(dispatch) {
    history.pushState = (f => function pushState() {
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('pushState'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.pushState);

    history.replaceState = (f => function replaceState() {
        var ret = f.apply(this, arguments);
        window.dispatchEvent(new Event('replaceState'));
        window.dispatchEvent(new Event('locationchange'));
        return ret;
    })(history.replaceState);

    window.addEventListener('popstate', () => {
        window.dispatchEvent(new Event('locationchange'))
    });

    window.addEventListener('locationchange', function() {
        dispatch(visit(location));
    })

    return (effect) => {
        switch (effect.effectType) {
            case 'history-replace':
                history.replaceState({}, null, effect.location);
                break;

            case 'history-push':
                history.pushState({}, null, effect.location);
                break;
        }
    }
}