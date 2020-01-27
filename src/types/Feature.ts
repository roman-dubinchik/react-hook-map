type FeatureProperties = {
    id: number;
    type: string;
    occurred_at: number;
}

type FeatureGeometry = {
    type: string;
    coordinates: number[];
}

type Feature = {
    type: string;
    properties: FeatureProperties;
    geometry: FeatureGeometry;
}

export default Feature;