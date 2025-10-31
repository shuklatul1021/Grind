import client from "prom-client";

export const HttpsRequestDurationMicroseconds = new client.Histogram({
    name: 'HTTPS_Request_Duration_ms',
    help: 'Duration of HTTPS Requests in ms On the Backend Server',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 5, 15, 50, 100, 300, 500, 1000, 3000, 5000 , 7000, 10000 , 30000 , 60000 , 120000 , 300000]
});