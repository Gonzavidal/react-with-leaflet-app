import React, { useEffect, useRef, useState } from 'react'
import './Map.css';
import L from 'leaflet';
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';


const Map = () => {

    const [markers, setMarkers] = useState([
        { lat: -33.40209261178743, lng: -70.5942400847628 },
        { lat: -33.39960121321696, lng: -70.58942214793433 },
        { lat: -33.398581442881685, lng: -70.5890144532461 }
    ])
    const [search, setSearch] = useState(null);
    
    const provider = new OpenStreetMapProvider();

    let map = useRef();

    useEffect(() => {
        loadMap(-33.40209261178743, -70.5942400847628)
        loadMarkers();

        return () => {
            map.remove();
        }

    }, [])

    useEffect(() => {
        loadMarkers();
    },[markers])

    const loadMap = (lat, lng) => {
        //console.log(`${lat} ${lng}`);
        const searchControl = new GeoSearchControl({
            provider: provider,
        });

        map = L.map('map', {
            center: [lat, lng],
            zoom: 16
        })

        map.addControl(searchControl);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

    }

    const loadMarkers = () => {
        markers.map(({ lat, lng }) => {
            L.marker([lat, lng]).addTo(map)
        })
    }

    const handleSearchAddress = async (e) => {
        const results = await provider.search({ query: e.target.value });
        setSearch(results);
    }

    return (
        <>
            <input type="search" name="address" id="address" onChange={handleSearchAddress} placeholder='Insert Address' />
            
            {
                !!search && (
                    <ul>
                        {
                            search.map(({ label, x, y }) => {
                                return <li><button onClick={() => setMarkers(markers => markers.concat({ lat: x, lng: y}))}>{label}</button></li>
                            })
                        }
                    </ul>
                ) 
            }
            <div id="map" ref={t => map = t}></div>
        </>
    )
}

export default Map