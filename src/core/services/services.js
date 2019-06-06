import {
	withAjax
} from "./ajax-service.js"

export function getCoreServices(dispatch) {
	let services = [];
	services.push(withAjax(dispatch));
	return services;
}