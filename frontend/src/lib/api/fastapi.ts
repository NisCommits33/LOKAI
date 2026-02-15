const FASTAPI_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000'

export async function callFastAPI(endpoint: string, options: RequestInit = {}) {
    // We'll use this once we have auth tokens session management set up
    const response = await fetch(`${FASTAPI_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    })

    if (!response.ok) {
        throw new Error(`FastAPI error: ${response.statusText}`)
    }

    return response.json()
}
