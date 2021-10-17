import React from "react";
import { useState, useEffect } from "react";
import ReactMapGL, {
    NavigationControl,
    GeolocateControl,
    Marker,
} from "react-map-gl";
import { Icon } from "semantic-ui-react";
import "mapbox-gl/dist/mapbox-gl.css";
import "./Map.css";

const token =
    "pk.eyJ1IjoieHVhbmtoYW5oMTYxMCIsImEiOiJja3V0YjJxeXQwc253MnBueTNyeDRxaGQ4In0.a-B9hCBLHwt3bmbBys36Og";

function Map() {
    const [places, setPlaces] = useState([]);
    const [viewport, setViewport] = useState({
        width: 400,
        height: 400,
        latitude: 37.7577,
        longitude: -122.4376,
        zoom: 8,
    });

    function getRandomColor() {
        var letters = "0123456789ABCDEF";
        var color = "#";
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    useEffect(() => {
        async function fetchData() {
            const response = await fetch("/task");
            const tasks = await response.json();

            tasks.forEach(async (task, index) => {
                const url =
                    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
                    task.suburb +
                    " australia.json?access_token=" +
                    token;
                const response = await fetch(url);
                const data = await response.json();

                if (Array.isArray(data.features[0].center)) {
                    const [long, lat] = data.features[0].center;

                    setPlaces((preValue) => {
                        return [
                            ...preValue,
                            <Marker longitude={long} latitude={lat}>
                                <Icon style={{color: getRandomColor()}} name="map marker alternate" size="big" />
                            </Marker>,
                        ];
                    });
                }
            });
        }

        fetchData();
    }, []);

    return (
        <ReactMapGL
            {...viewport}
            width="100%"
            height="100%"
            onViewportChange={(nextViewport) => setViewport(nextViewport)}
            mapboxApiAccessToken={token}
            mapStyle="mapbox://styles/mapbox/streets-v11"
        >
            {places}
            <div
                className="map-controller"
                style={{ top: 10, right: 10, position: "absolute" }}
            >
                <NavigationControl
                    style={{ position: "none", paddingBottom: 10 }}
                />
                <GeolocateControl
                    style={{ position: "none" }}
                    positionOptions={{ enableHighAccuracy: true }}
                    trackUserLocation={true}
                />
            </div>
        </ReactMapGL>
    );
}

export default Map;
