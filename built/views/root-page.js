"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var markact_js_1 = require("../core/markact.js");
var counter_reducer_js_1 = require("../reducers/counter-reducer.js");
function RootPage(dispatch) {
    return function (state) {
        return markact_js_1.m('div', {}, state.welcomeMessage, markact_js_1.m('div', {}, String(state.count), markact_js_1.m('div', {}, markact_js_1.m('button', {
            style: 'background-color: #00ff00; color: #ffffff; width: 100px; border-radius: 1rem; text-align: center; display: inline-block;',
            onclick: function () { return dispatch(counter_reducer_js_1.add()); }
        }, "Add"), markact_js_1.m('button', {
            style: 'background-color: #ff0000; color: #ffffff; width: 100px; border-radius: 1rem; text-align: center; display: inline-block;',
            onclick: function () { return dispatch(counter_reducer_js_1.subtract()); }
        }, "subtract"))));
    };
}
exports.RootPage = RootPage;
