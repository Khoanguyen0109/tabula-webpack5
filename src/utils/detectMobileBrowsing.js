export function detectMobIOS() {
    const toMatch = [
        /iPhone/i,
    ];
    
    return toMatch.some((toMatchItem) => navigator.userAgent.match(toMatchItem));
}
export function detectIpad() {
    const toMatch = [
        /iPad/i,
    ];
    
    return toMatch.some((toMatchItem) => navigator.userAgent.match(toMatchItem));
}

export function detectMobAndroid() {
    const toMatch = [
        /Android/i,
    ];
    return toMatch.some((toMatchItem) => navigator.userAgent.match(toMatchItem));
}

export function detectForMobile() {
    const toMatch = [
        /iPhone/i,
        /iPad/i,
    ];
    
    return toMatch.some((toMatchItem) => navigator.userAgent.match(toMatchItem));
}