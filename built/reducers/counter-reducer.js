"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var ajax_service_js_1 = require("../core/services/ajax-service.js");
function add() {
    return {
        type: "add"
    };
}
exports.add = add;
function subtract() {
    return {
        type: "subtract"
    };
}
exports.subtract = subtract;
exports.reduceCounter = function (state, action) {
    var effects = [];
    switch (action.type) {
        case "complete-request":
            state = __assign({}, state);
            state.welcomeMessage = action.response;
            break;
        case "add":
            state = __assign({}, state);
            state.count++;
            effects = effects.concat(ajax_service_js_1.requestAjax(["load-markup-readme"], { url: "https://raw.githubusercontent.com/kuczmama/smark/master/README.md", method: "GET" }));
            break;
        case "subtract":
            state = __assign({}, state);
            state.count--;
            break;
    }
    return {
        state: state,
        effects: effects
    };
};
