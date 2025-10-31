import client from "prom-client";

export const NumberOfRequestsCounter = new client.Counter({
    name: 'Total_HTTPS_Requests',
    help: 'Total number of HTTPS requests received on the backend Server',
    labelNames: ['method', 'route', 'status_code']
});