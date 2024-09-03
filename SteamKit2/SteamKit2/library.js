const steam_api = "https://api.steampowered.com/"
const steam_cdn_host = null;

function stringToNewUTF8(str) {
    let len = lengthBytesUTF8(str) + 1;
    let ptr = mmapAlloc(len);
    stringToUTF8(str, ptr, len);
    return ptr;
}

async function getSteamCdnAsync(cellId) {
    const url = new URL(`/IContentServerDirectoryService/GetServersForSteamPipe/v1`, steam_api);
    if (cellId != null) {
        url.searchParams.set('cell_id', cellId);
    }
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'omit'
    });
    const json = await response.json();
    return json.response.servers;
}

async function getSteamCdnHostAsync(cellId) {
    if (steam_cdn_host != null) {
        return steam_cdn_host;
    } else {
        const cdn = await getSteamCdnAsync(cellId);
        const index = Math.floor(Math.random() * cdn.length);
        return cdn[index].host;
    }
}

async function makeDepotManifestDownloadUrl(host, depotId, manifestId, manifestRequestCode) {
    const MANIFEST_VERSION = 5;
    if (host == null) {
        host = await getSteamCdnHostAsync();
    }
    return `https://${host}/depot/${depotId}/manifest/${manifestId}/${MANIFEST_VERSION}/${manifestRequestCode}`;
}

async function fetchDepotManifestAsync(host, depotId, manifestId, manifestRequestCode) {
    try {
        const url = await makeDepotManifestDownloadUrl(host, depotId, manifestId, manifestRequestCode);
        const response = await fetch(url, {
            method: "GET"
        })
        if (response.status != 200) {
            return null;
        }
        return await response.blob();
    } catch (e) {
        return null;
    }
}

function arrayBufferToNewMemory(arrayBuffer) {
    const size = arrayBuffer.byteLength;
    const src = new Uint8Array(arrayBuffer);
    const ptr = mmapAlloc(size);
    HEAPU8.set(src, ptr);
    return ptr;
}
