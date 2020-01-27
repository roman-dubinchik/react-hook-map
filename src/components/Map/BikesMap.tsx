import React, {createRef, useEffect} from 'react';

import {Circle, FeatureGroup, LayersControl, Map, Marker, Popup, TileLayer} from 'react-leaflet';
import MapConfig from "../../types/MapConfig";
import MarkerComponent from "../Marker/MarkerComponent";
import {getBounds} from "../../services/bikeWise.service";
import {LatLngBoundsLiteral, marker} from "leaflet";
import MapMarker from "../../types/MapMarker";

const CURRENT_YEAR = '2020';

type InitialState = {
    latlng: {
        lat: number,
        lng: number,
    },
    zoom: number,
    bounds?: LatLngBoundsLiteral
}

const initialMapState: InitialState = {
    latlng: {
        lat: 51.505,
        lng: -0.09,
    },
    zoom: 8
};

const BikesMap: React.FC<MapConfig> = (props: MapConfig) => {

    const mapRef = createRef<Map>();

    const getMarkersByYear = (year: string) => props[year].map((marker: MapMarker) => (
        <MarkerComponent {...marker} key={`marker_${marker.id}`}/>
    ));

    if(props[CURRENT_YEAR].length > 0){
        initialMapState.bounds = getBounds(props[CURRENT_YEAR]) as LatLngBoundsLiteral;
    }

    return (
        <div>
            <Map
                center={initialMapState.latlng}
                bounds={initialMapState.bounds}
                ref={mapRef}
                zoom={initialMapState.zoom}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LayersControl position="topright">
                    {Object.keys(props).map((year, index) => (
                        <LayersControl.Overlay name={`Incidents for ${year}`} key={year} checked={year === CURRENT_YEAR}>
                            <FeatureGroup color="red" >
                                {getMarkersByYear(year)}
                            </FeatureGroup>
                        </LayersControl.Overlay>
                    ))}
                </LayersControl>
            </Map>
        </div>
    );
};

export default BikesMap;