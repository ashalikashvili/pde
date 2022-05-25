const API = 'http://jubpde.free.beeceptor.com'
const CORS_PROXY = 'http://167.172.97.242:8080/';

/**
 * Currently the API is mocked.
 */
export default class Api {
    static getMissions() {
        return fetch(API).then(response => {
            return response.json()
        })
    }

    // Sends a HEAD request to the image to get back the Content-Length
    static async fetchResourceSize(url) {
        const response = await fetch(CORS_PROXY + url, {
            method: 'HEAD'
        })

        const size = response.headers.get('content-length')
        return Number(size)
    }
}
