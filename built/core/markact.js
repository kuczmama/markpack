"use strict";
// A better React and utils -- MarkAct.js
Object.defineProperty(exports, "__esModule", { value: true });
function m(nodeName, attributes) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
    }
    var children = args.length ? [].concat.apply([], args) : null;
    return {
        nodeName: nodeName,
        attributes: attributes,
        children: children
    };
}
exports.m = m;
function render(vnode) {
    if (vnode.split)
        return document.createTextNode(vnode);
    var n = document.createElement(vnode.nodeName);
    var as = vnode.attributes || {};
    for (var k in as) {
        if (typeof as[k] === "function") {
            n[k] = as[k];
        }
        else {
            n.setAttribute(k, as[k]);
        }
    }
    (vnode.children || []).map(function (c) { return n.appendChild(render(c)); });
    return n;
}
exports.render = render;
function renderAt(vnode, id) {
    var app = document.getElementById(id);
    if (app.firstChild)
        app.removeChild(app.firstChild);
    app.appendChild(render(vnode));
}
exports.renderAt = renderAt;
;
