
export function getConfig() {
    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    return {
        googleMapsApiKey,
    };
}
