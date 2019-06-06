import {
    withSequenced
} from "./sequence-service.js";

export function getCoreServices() {
    let services = [];
    services.push(withSequenced);
    return services;
}