function m(nodeName, attributes, ...args) {
    let children = args.length ? [].concat(...args) : null;
    return {
        nodeName,
        attributes,
        children
    }
}function render(vnode) {
    if (vnode.split) return document.createTextNode(vnode);
    let n = document.createElement(vnode.nodeName);
    let as = vnode.attributes || {};
    for (let k in as) {
        if (typeof as[k] === "function") {
            n[k] = as[k];
        } else {
            n.setAttribute(k, as[k]);
        }
    }
    (vnode.children || []).map(c => n.appendChild(render(c)));
    return n;
}function renderAt(vnode, id) {
    let app = document.getElementById(id);
    if (app.firstChild) app.removeChild(app.firstChild);
    app.appendChild(render(vnode));
};function get(url, success) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
        if (request.status === 0 || request.status >= 200 && request.status < 400) {
            var resp = request.responseText;

            success(resp);
        }
    };
    request.send();
}function app() {
    return m('div', {},
        "This works really well!!!",
        m('img', {
        src: 'https://previews.123rf.com/images/alexgorka/alexgorka1809/alexgorka180900030/108027925-yay-vector-lettering-.jpg',
            width: '500px',
            height: '400px',
        }),
        m('img', {
            src: 'https://previews.123rf.com/images/alexgorka/alexgorka1809/alexgorka180900030/108027925-yay-vector-lettering-.jpg',
            width: '500px',
            height: '400px',
        })
    );
};var tid = setInterval(function() {
    if (document.readyState !== 'complete') return;
    clearInterval(tid);
    renderAt(app(), "app");
}, 100);function m(nodeName, attributes, ...args) {
    let children = args.length ? [].concat(...args) : null;
    return {
        nodeName,
        attributes,
        children
    }
}function render(vnode) {
    if (vnode.split) return document.createTextNode(vnode);
    let n = document.createElement(vnode.nodeName);
    let as = vnode.attributes || {};
    for (let k in as) {
        if (typeof as[k] === "function") {
            n[k] = as[k];
        } else {
            n.setAttribute(k, as[k]);
        }
    }
    (vnode.children || []).map(c => n.appendChild(render(c)));
    return n;
}function renderAt(vnode, id) {
    let app = document.getElementById(id);
    if (app.firstChild) app.removeChild(app.firstChild);
    app.appendChild(render(vnode));
};function get(url, success) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
        if (request.status === 0 || request.status >= 200 && request.status < 400) {
            var resp = request.responseText;

            success(resp);
        }
    };
    request.send();
}function app() {
    return m('div', {},
        "This works really well!!!",
        m('img', {
        src: 'https://previews.123rf.com/images/alexgorka/alexgorka1809/alexgorka180900030/108027925-yay-vector-lettering-.jpg',
            width: '500px',
            height: '400px',
        }),
        m('img', {
            src: 'https://previews.123rf.com/images/alexgorka/alexgorka1809/alexgorka180900030/108027925-yay-vector-lettering-.jpg',
            width: '500px',
            height: '400px',
        })
    );
};var tid = setInterval(function() {
    if (document.readyState !== 'complete') return;
    clearInterval(tid);
    renderAt(app(), "app");
}, 100);function m(nodeName, attributes, ...args) {
    let children = args.length ? [].concat(...args) : null;
    return {
        nodeName,
        attributes,
        children
    }
}function render(vnode) {
    if (vnode.split) return document.createTextNode(vnode);
    let n = document.createElement(vnode.nodeName);
    let as = vnode.attributes || {};
    for (let k in as) {
        if (typeof as[k] === "function") {
            n[k] = as[k];
        } else {
            n.setAttribute(k, as[k]);
        }
    }
    (vnode.children || []).map(c => n.appendChild(render(c)));
    return n;
}function renderAt(vnode, id) {
    let app = document.getElementById(id);
    if (app.firstChild) app.removeChild(app.firstChild);
    app.appendChild(render(vnode));
};function get(url, success) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
        if (request.status === 0 || request.status >= 200 && request.status < 400) {
            var resp = request.responseText;

            success(resp);
        }
    };
    request.send();
}function app() {
    return m('div', {},
        "This works really well!!!",
        m('img', {
        src: 'https://previews.123rf.com/images/alexgorka/alexgorka1809/alexgorka180900030/108027925-yay-vector-lettering-.jpg',
            width: '500px',
            height: '400px',
        }),
        m('img', {
            src: 'https://previews.123rf.com/images/alexgorka/alexgorka1809/alexgorka180900030/108027925-yay-vector-lettering-.jpg',
            width: '500px',
            height: '400px',
        })
    );
};var tid = setInterval(function() {
    if (document.readyState !== 'complete') return;
    clearInterval(tid);
    renderAt(app(), "app");
}, 100);