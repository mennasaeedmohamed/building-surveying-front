// import React, { useEffect, useRef, useContext } from 'react';
// import { loadModules } from 'esri-loader';
// import { useNavigate } from 'react-router-dom';
// import { AppContext } from '../AppContext';
// import '../App.css';

// const MapPage = () => {
//     const mapRef = useRef();
//     const navigate = useNavigate();
//     const { setSelectedPoint, path, points, nextPoint } = useContext(AppContext);

//     useEffect(() => {
//         if (mapRef.current) {
//             loadModules([
//                 'esri/Map',
//                 'esri/views/MapView',
//                 'esri/Graphic',
//                 'esri/layers/GraphicsLayer',
//                 'esri/geometry/Extent',
//                 'esri/geometry/Polyline'
//             ]).then(([EsriMap, MapView, Graphic, GraphicsLayer, Extent, Polyline]) => {
//                 const map = new EsriMap({
//                     basemap: 'streets-navigation-vector'
//                 });

//                 const view = new MapView({
//                     container: mapRef.current,
//                     map: map,
//                     extent: new Extent({
//                         xmin: 31.24,
//                         ymin: 30.045,
//                         xmax: 31.25,
//                         ymax: 30.06,
//                         spatialReference: { wkid: 4326 }
//                     })
//                 });

//                 const graphicsLayer = new GraphicsLayer();
//                 map.add(graphicsLayer);

//                 console.log('Points:', points);

//                 points.forEach(point => {
//                     console.log('Adding point:', point);
//                     const graphic = new Graphic({
//                         geometry: {
//                             type: 'point',
//                             longitude: point.longitude,
//                             latitude: point.latitude
//                         },
//                         symbol: {
//                             type: 'simple-marker',
//                             color: 'red',
//                             size: '10px'
//                         }
//                     });

//                     graphicsLayer.add(graphic);
//                 });

//                 view.on("click", (event) => {
//                     view.hitTest(event).then((response) => {
//                         if (response.results.length) {
//                             const graphic = response.results[0].graphic;
//                             const { longitude, latitude } = graphic.geometry;
//                             setSelectedPoint({ longitude, latitude });
//                             navigate('/form');
//                         }
//                     });
//                 });

//                 // Draw path if available
//                 if (path.length > 1) {
//                     const polyline = new Polyline({
//                         paths: path.map(point => [point.longitude, point.latitude]),
//                         spatialReference: { wkid: 4326 }
//                     });

//                     const lineSymbol = {
//                         type: "simple-line",
//                         color: "blue",
//                         width: 2
//                     };

//                     const polylineGraphic = new Graphic({
//                         geometry: polyline,
//                         symbol: lineSymbol
//                     });

//                     graphicsLayer.add(polylineGraphic);
//                 }

//                 // Draw route to the next point if available
//                 if (nextPoint) {
//                     const currentLocation = path[path.length - 1];
//                     const route = new Polyline({
//                         paths: [
//                             [currentLocation.longitude, currentLocation.latitude],
//                             [nextPoint.longitude, nextPoint.latitude]
//                         ],
//                         spatialReference: { wkid: 4326 }
//                     });

//                     const routeSymbol = {
//                         type: "simple-line",
//                         color: "green",
//                         width: 2
//                     };

//                     const routeGraphic = new Graphic({
//                         geometry: route,
//                         symbol: routeSymbol
//                     });

//                     graphicsLayer.add(routeGraphic);
//                 }
//             }).catch(err => console.error(err));
//         }
//     }, [path, nextPoint, points]);

//     return <div className="map-container" ref={mapRef} />;
// };

// export default MapPage;


import React, { useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../AppContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

const MapPage = () => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const navigate = useNavigate();
    const { setSelectedPoint, points, nextPoint } = useContext(AppContext);

    useEffect(() => {
        if (!mapInstanceRef.current) {
            const map = L.map(mapRef.current).setView([30.045, 31.24], 13);
            mapInstanceRef.current = map;

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);
        }

        const map = mapInstanceRef.current;

        map.eachLayer(layer => {
            if (layer.options && !layer.options.attribution) {
                map.removeLayer(layer);
            }
        });

        const createCustomIcon = (color) => {
            return L.divIcon({
                className: 'custom-icon',
                html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%;"></div>`,
                iconSize: [12, 12]
            });
        };

        points.forEach(point => {
            const marker = L.marker([point.latitude, point.longitude], {
                icon: createCustomIcon('blue')
            }).addTo(map);

            marker.on('click', () => {
                setSelectedPoint({ longitude: point.longitude, latitude: point.latitude });
                navigate('/form');
            });
        });

        if (points.length > 1) {
            const waypoints = points.map(point => L.latLng(point.latitude, point.longitude));
            L.Routing.control({
                waypoints: waypoints,
                router: L.Routing.osrmv1({
                    serviceUrl: process.env.REACT_APP_ROUTING_SERVICE_URL
                }),
                createMarker: () => null,
                lineOptions: {
                    styles: [{ color: 'black', opacity: 0.6, weight: 4 }]
                }
            }).addTo(map);
        }

        if (nextPoint) {
            const currentLocation = points[points.length - 1];
            L.Routing.control({
                waypoints: [
                    L.latLng(currentLocation.latitude, currentLocation.longitude),
                    L.latLng(nextPoint.latitude, nextPoint.longitude)
                ],
                router: L.Routing.osrmv1({
                    serviceUrl: process.env.REACT_APP_ROUTING_SERVICE_URL
                }),
                createMarker: () => null,
                lineOptions: {
                    styles: [{ color: 'black', opacity: 0.6, weight: 4 }]
                }
            }).addTo(map);
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [points, nextPoint, navigate, setSelectedPoint]);

    return <div id="map" ref={mapRef} style={{ height: '100vh' }} />;
};

export default MapPage;
