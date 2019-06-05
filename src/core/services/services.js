import {
    withSequenced
} from "sequence-service";

export function getCoreServices() {
    let services = [];
    services.push(withSequenced);
    return services;
}