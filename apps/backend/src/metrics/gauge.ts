import client from "prom-client";

export const ActiveRequestsGauge = new client.Gauge({
    name: 'Active_HTTPS_Requests',
    help: 'Number of active HTTPS requests being handled by the backend Server'
});