
function getBackendURL(){
    const env = import.meta.env.VITE_NODE_ENV || import.meta.env.MODE;

    if(env === "production"){
        return "https://api.grind.org.in/v1/api";
    }

    return "http://localhost:5000/v1/api";
}   
function getCompilerURL(){
    const env = import.meta.env.VITE_NODE_ENV || import.meta.env.MODE;

    if(env === "production"){
        return "https://compiler.grind.org.in/v1/api";
    }

    return "http://localhost:5001/v1/api";
}   

function getCompilerWsURL(){
    if(import.meta.env.VITE_COMPILER_WS_URL){
        return import.meta.env.VITE_COMPILER_WS_URL;
    }

    const env = import.meta.env.VITE_NODE_ENV || import.meta.env.MODE;

    if(env === "production"){
        return "wss://websocket.grind.org.in";
    }

    return "ws://localhost:8080";
}

function getContestWsURL() {
    if (import.meta.env.VITE_CONTEST_WS_URL) {
        return import.meta.env.VITE_CONTEST_WS_URL;
    }

    const env = import.meta.env.VITE_NODE_ENV || import.meta.env.MODE;

    if (env === "production") {
        return "wss://contest-websocket.grind.org.in";
    }

    return "ws://localhost:5051";
}

export const BACKENDURL = getBackendURL();
export const COMPILER_URL = getCompilerURL();
export const COMPILER_WS_URL = getCompilerWsURL();
export const CONTEST_WS_URL = getContestWsURL();

