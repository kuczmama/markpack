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
var counter_reducer_js_1 = require("./reducers/counter-reducer.js");
var reducers_js_1 = require("./core/reducers.js");
var services_js_1 = require("./core/services/services.js");
var initial_loading_reducer_js_1 = require("./reducers/initial-loading-reducer.js");
var root_page_js_1 = require("./views/root-page.js");
var markact_js_1 = require("./core/markact.js");
var state_js_1 = require("./state.js");
window.MarkactRoot = function (id) {
    var self = this;
    self.id = id;
    self.state = __assign({}, state_js_1.initialState);
    self.reduce = function (state, action) {
        return reducers_js_1.reducerChain(state, action)
            .apply(initial_loading_reducer_js_1.reduceInitialLoading)
            .apply(counter_reducer_js_1.reduceCounter)
            .result();
    };
    self.reduceEffects = function (effects) {
        effects.map(function (effect) { return self.services.map(function (service) { return service(effect); }); });
    };
    self.dispatch = function (action) {
        var startTimings = Date.now();
        console.log("action", action);
        var oldState = __assign({}, self.state);
        var reduction = self.reduce(oldState, action);
        if (reduction.effects) {
            self.reduceEffects(reduction.effects);
        }
        self.state = reduction.state;
        console.log("new state", self.state);
        var startRenderTime = Date.now();
        self.render();
        var renderTime = Date.now() - startRenderTime;
        console.log("rendered in", renderTime, "ms");
        console.log("completed in", Date.now() - startTimings, "ms");
        if (renderTime > 50) {
            console.warn("Slow action:  ", renderTime + "ms", action);
        }
    };
    self.services = services_js_1.getCoreServices(self.dispatch);
    self.render = function () {
        var RootPageContent = root_page_js_1.RootPage(self.dispatch);
        markact_js_1.renderAt(RootPageContent(__assign({}, self.state)), self.id);
    };
    self.dispatch("init");
};
