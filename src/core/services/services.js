import {
    withAjax
} from "./ajax-service.js"
import {withNavigation} from "./navigation-service.js";

export function getCoreServices(dispatch) {
    let services = [];
    services.push(withAjax(dispatch));
    services.push(withNavigation(dispatch));
    return services;
}