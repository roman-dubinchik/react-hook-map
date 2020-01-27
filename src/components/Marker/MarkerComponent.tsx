import React, {useState} from 'react';
import {observer} from 'mobx-react';

import { Marker, Popup } from 'react-leaflet';
import {getMarkerData} from "../../services/bikeWise.service";
import MarkerComponentProps from "../../types/MarkerComponentProps";
import MarkerType from "../../types/MarkerType";

//using here react new state hooks to take a look how it works
// sorry for inconvenience :)

const MarkerComponent: React.FC<MarkerComponentProps> = observer((props: MarkerComponentProps) => {

    const [markerData, setMarkerData] = useState<MarkerType | null>();

    const updateMarkerData = async () => {
        const markerData = await getMarkerData(props.id);
        setMarkerData(markerData);
    };

    return (
        <Marker position={[props.lat, props.lng]} key={`marker_${props.id}`}>
            <Popup onOpen = {() => {updateMarkerData()}}>
                {markerData ? (
                    <div>
                        <div>{markerData.title}</div><br/>
                        <div><b>Address:</b> {markerData.address}</div>
                        {markerData.description && <div><b>Description:</b> {markerData.description}</div>}
                    </div>
                ) : (<div>Nothing to show</div>)}
            </Popup>
        </Marker>
    )

});

export default MarkerComponent;