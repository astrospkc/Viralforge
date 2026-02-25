const NEXT_URL_BACKEND_DEV_URL = import.meta.env.VITE_BACKEND_URL
const NEXT_URL_BACKEND_PROD_URL = import.meta.env.VITE_BACKEND_URL

const getBaseUrl = () => {
    if (typeof window !== "undefined") {
        return window.location.hostname === "localhost" ? NEXT_URL_BACKEND_DEV_URL || "" : NEXT_URL_BACKEND_PROD_URL || ""
    }
    return NEXT_URL_BACKEND_PROD_URL || ""
}

const baseUrl = getBaseUrl()

console.log("base url: ", baseUrl)
export default baseUrl