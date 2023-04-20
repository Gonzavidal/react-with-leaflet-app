import React, { useEffect, useRef, useState } from 'react'
import './Map.css';
import L from 'leaflet';
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';
import { useLocation } from 'react-router-dom';


const Map = () => {

    const location = useLocation();

    const [currentPosition, setCurrentPosition] = useState({
        lat: -33.40209261178743,
        lng: -70.5942400847628
    })

    const [markers, setMarkers] = useState([
        { lat: -33.40209261178743, lng: -70.5942400847628 },
        { lat: -33.39960121321696, lng: -70.58942214793433 },
        { lat: -33.398581442881685, lng: -70.5890144532461 }
    ])
    const [search, setSearch] = useState(null);

    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
        provider: provider,
    });

    let map = useRef();

    useEffect(() => {
        loadMap(currentPosition.lat, currentPosition.lng)
        loadMarkers();
        getCurrentPosition();

        return () => {
            map.current.remove();
        }

    }, [])

    useEffect(() => {
        loadMarkers();
    }, [markers])

    const loadMap = (lat, lng) => {
        //console.log(`${lat} ${lng}`);


        map.current = L.map('map', {
            center: [lat, lng],
            zoom: 16
        })

        //map.addControl(searchControl);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map.current);

    }

    const loadMarkers = () => {
        if (map !== null) {
            markers.map(({ lat, lng }) => {
                L.marker([lat, lng]).addTo(map.current)
            })
        }
    }

    const handleSearchAddress = async (e) => {
        const results = await provider.search({ query: e.target.value });
        setSearch(results);
    }

    const getCurrentPosition = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position);
            setCurrentPosition({
                lat: position?.coords?.latitude,
                lng: position?.coords?.longitude
            })

            setMarkers(currentMarkers => currentMarkers.concat({
                lat: position?.coords?.latitude,
                lng: position?.coords?.longitude
            }));
        });
    }

    return (
        <>
            <input type="search" name="address" id="address" onChange={handleSearchAddress} placeholder='Insert Address' />

            {
                !!search && (
                    <ul>
                        {
                            search.map(({ label, x, y }) => {
                                return <li><button onClick={() => setMarkers(markers => markers.concat({ lat: x, lng: y }))}>{label}</button></li>
                            })
                        }
                    </ul>
                )
            }
            <div id="map" ref={el => map = el}></div>
            <button onClick={() => setMarkers(currentMarkers => currentMarkers.concat({ lat: currentPosition.lat, lng: currentPosition.lng }))}>Añadir Marker</button>
        </>
    )
}

export default Map