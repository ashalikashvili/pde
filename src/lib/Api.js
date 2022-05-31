const API = 'https://jubpde.free.beeceptor.com'
const CORS_PROXY = 'https://artisans.ge/proxy.php'

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
        const response = await fetch(CORS_PROXY, {
            method: 'HEAD',
            headers: {
                'X-Proxy-Auth': 'b689f974578c4fc1ab06f5dbb532af7b',
                'X-Proxy-Target-Url': url,
            }
        })

        const size = response.headers.get('content-length')
        return Number(size)
    }
}