
function getBackendURL(){
    if(import.meta.env.VITE_NODE_ENV === "development"){
        return "http://localhost:5000/v1/api";
    }else if (import.meta.env.VITE_NODE_ENV === "production"){
        return "https://api.grind.org.in/v1/api";
    }
}   
function getCompilerURL(){
    if(import.meta.env.VITE_NODE_ENV === "development"){
        return "http://localhost:5001/v1/api";
    }else if (import.meta.env.VITE_NODE_ENV === "production"){
        return "https://compiler.grind.org.in/v1/api";
    }
}   

export const BACKENDURL = getBackendURL();
export const COMPILER_URL = getCompilerURL();

