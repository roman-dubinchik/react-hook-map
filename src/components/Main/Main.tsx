import React, {useEffect} from 'react';
import {observer, useLocalStore} from 'mobx-react';
import {featuresFor2018, featuresFor2019, getFeatureCollection} from '../../services/bikeWise.service';

import styles from './Main.module.scss';
import BikesMap from "../Map/BikesMap";
import MapConfig from "../../types/MapConfig";
import MapMarker from "../../types/MapMarker";

//using here mobx local store instead of state to see how it works with new react hooks
const Main: React.FC = observer(() => {
    const mapConfig = useLocalStore(() => {
        const config: MapConfig = {
            2020: [],
            2019: [],
            2018: []
        };
        return config;
    });

    useEffect(() => {
        getFeatureCollection().then((markers) => {
            mapConfig['2020'] = markers as MapMarker[];
        });
        getFeatureCollection(featuresFor2019).then((markers) => {
            mapConfig['2019'] = markers as MapMarker[];
        });
        getFeatureCollection(featuresFor2018).then((markers) => {
            mapConfig['2018'] = markers as MapMarker[];
        });
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles.paramsWrapper}>

            </div>
            <div className={styles.mapWrapper}>
                <BikesMap {...mapConfig}/>
            </div>
        </div>
    );
});

export default Main;