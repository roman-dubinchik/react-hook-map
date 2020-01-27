import Feature from "../types/Feature";
import MapMarker from "../types/MapMarker";
import FeatureCollectionParams from "../types/FeatureCollectionParams";
import FeatureCollection from "../types/FeatureCollection";
import IncidentType from "../types/IncidentType";

const baseLocationsApiUrl = 'https://bikewise.org:443/api/v2/locations?';
const baseIncidentApiUrl = 'https://bikewise.org/api/v2/incidents/';
const PROXIMITY_SQUARE_PARAM = 'proximity_square';
const ALL_DATA_PARAM = 'all';
const LIMIT_PARAM = 'limit';
const OCCURRED_AFTER_PARAM = 'occurred_after';

export const featuresFor2019: FeatureCollectionParams = {
    occurred_after: 1546350762,
    occurred_before: 1577886762,
    limit: 1500
};

export const featuresFor2018: FeatureCollectionParams = {
    occurred_after: 1514814762,
    occurred_before: 1546350762,
    limit: 1500
};

const convertFeatureToMarker = (feature: Feature) => {
    const marker: MapMarker = {
        id: feature.properties.id,
        type: feature.geometry.type,
        dateOfOccurance: feature.properties.occurred_at,
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0]
    };
    return  marker;
};

const defaultData: FeatureCollectionParams = {
    limit: 2500,
    occurred_after: 1577886762
};

const getFeatureCollection = (params: FeatureCollectionParams = defaultData) => {
    let url = baseLocationsApiUrl;
    if(params.proximitySquare){
        url+= `${PROXIMITY_SQUARE_PARAM}=${params.proximitySquare}&`;
    }

    if(params.all){
        url+= `${ALL_DATA_PARAM}=${params.all}&`;
    }

    if(params.limit){
        url+= `${LIMIT_PARAM}=${params.limit}&`;
    }

    if(params.occurred_after){
        url+= `${OCCURRED_AFTER_PARAM}=${params.occurred_after}&`;
    }
    //all supported params should be added here

    const responseData = fetch(url).then((response) => {
        return response.json();
    }).then((featureCollection: FeatureCollection) => {
        const markers: MapMarker[] = [];
        featureCollection.features.forEach((feature) => {
            markers.push(convertFeatureToMarker(feature));
        });
        return markers;
    }).catch(() => {
        console.log('we have a problem here');
        return [];
    });
    return (responseData);
};

const getMarkerData = (markerId: number) => {
    return fetch(`${baseIncidentApiUrl}${markerId}`).then((response) => {
        return (response.json()) as Promise<IncidentType>;
    }).then((incident) => incident.incident).catch(() => {
        console.log('we have a problem here');
        return null;
    });
};

const sortFunc = (a: number, b: number) => {
    if (a > b) {
        return 1;
    } else if (a < b) {
        return -1;
    } else return 0;
};

const getBounds = (markers: MapMarker[] = []) => {
    const sortLng = markers.map(item => item.lng).sort((m1, m2) => {
        return sortFunc(m1, m2);
    });
    const sortLat = markers.map(item => item.lat).sort((m1, m2) => {
        return sortFunc(m1, m2);
    });

    return [[sortLat[0], sortLng[0]], [sortLat[sortLat.length - 1], sortLng[sortLng.length - 1]]];
};

export {
    getFeatureCollection,
    getMarkerData,
    getBounds
};