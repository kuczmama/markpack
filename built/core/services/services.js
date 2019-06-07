"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ajax_service_js_1 = require("./ajax-service.js");
var navigation_service_js_1 = require("./navigation-service.js");
function getCoreServices(dispatch) {
    var services = [];
    services.push(ajax_service_js_1.withAjax(dispatch));
    services.push(navigation_service_js_1.withNavigation(dispatch));
    return services;
}
exports.getCoreServices = getCoreServices;
