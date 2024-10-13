<template>
    <div class="map-container">
        <div class="search-bar" v-if="!showDirectionsInput">
            <input type="text" v-model="searchQuery" @keyup.enter="searchLocation" placeholder="Search for a place" />
            <button @click="searchLocation">Search</button>
        </div>
        <div v-if="showDirectionsInput" class="directions-panel">
            <button class="back-button" @click="resetSearch">&larr; Back</button>
            <div class="directions-input">
                <input type="text" v-model="startLocation" placeholder="Start" @keyup.enter="handleDirectionsEnter" />
                <input type="text" v-model="endLocation" placeholder="End" @keyup.enter="handleDirectionsEnter" />
                <button @click="handleGetDirections">Get Directions</button>
            </div>
        </div>
        <div id="map"></div>
        <div class="info-container" v-if="routeInfo">
            <h2>Route Information</h2>
            <p>Start: {{ startLocationName }}</p>
            <p>End: {{ endLocationName }}</p>
            <div class="route-info">
                <p>Estimated travel time: {{ routeInfo.duration }}</p>
                <p>Total distance: {{ routeInfo.distance }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import mapboxSdk from '@mapbox/mapbox-sdk';
import MapboxDirections from '@mapbox/mapbox-sdk/services/directions';

export default {
    name: 'MapView',
    data() {
        return {
            map: null,
            searchQuery: '',
            startLocation: '',
            endLocation: '',
            startCoords: null,
            endCoords: null,
            startLocationName: '',
            endLocationName: '',
            directionsClient: null,
            routeInfo: null,
            showDirectionsInput: false,
            markers: [],
        };
    },
    async mounted() {
        await this.initializeMap();
    },
    methods: {
        async initializeMap() {
            mapboxgl.accessToken = 'pk.eyJ1IjoiamlheXVhbmNoZW4iLCJhIjoiY20yNjB2dGJmMDUzOTJtcHZkcmFxczM3eCJ9.5-OtCLUJcB8-mWvEanj-_Q';

            this.map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [144.9631, -37.8136], // Melbourne coordinates
                zoom: 12,
            });

            await new Promise(resolve => this.map.on('load', resolve));

            this.map.addControl(new mapboxgl.NavigationControl(), 'top-right');

            const mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });
            this.directionsClient = MapboxDirections(mapboxClient);

            this.map.on('click', this.handleMapClick);
        },
        async searchLocation() {
            console.log('Searching for:', this.searchQuery);
            try {
                const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(this.searchQuery)}.json?access_token=${mapboxgl.accessToken}&country=AU`);
                const data = await response.json();
                if (data.features && data.features.length > 0) {
                    const [lng, lat] = data.features[0].center;
                    console.log('Location found:', data.features[0].place_name, [lng, lat]);
                    this.map.flyTo({ center: [lng, lat], zoom: 14 });
                    this.clearMarkers();
                    this.addMarker([lng, lat]);
                    this.showDirectionsInput = true;
                    this.endLocation = data.features[0].place_name;
                    this.endCoords = [lng, lat];
                } else {
                    console.log('No location found for:', this.searchQuery);
                    this.showToast('Location not found. Please try again.');
                }
            } catch (error) {
                console.error('Error searching for location:', error);
                this.showToast('Error searching for location. Please try again.');
            }
        },
        addMarker(coords) {
            console.log('Adding marker at:', coords);
            const marker = new mapboxgl.Marker()
                .setLngLat(coords)
                .addTo(this.map);
            this.markers.push(marker);
        },
        clearMarkers() {
            this.markers.forEach(marker => marker.remove());
            this.markers = [];
        },
        async setStartLocation() {
            console.log('Setting start location:', this.startLocation);
            const coords = await this.geocodeLocation(this.startLocation);
            if (coords) {
                this.startCoords = coords;
                this.startLocationName = this.startLocation;
                this.clearMarkers();
                this.addMarker(coords);
                console.log('Start location set:', this.startLocationName, this.startCoords);
            }
        },
        async setEndLocation() {
            console.log('Setting end location:', this.endLocation);
            const coords = await this.geocodeLocation(this.endLocation);
            if (coords) {
                this.endCoords = coords;
                this.endLocationName = this.endLocation;
                this.clearMarkers();
                this.addMarker(coords);
                console.log('End location set:', this.endLocationName, this.endCoords);
            }
        },
        async geocodeLocation(location) {
            console.log('Geocoding:', location);
            try {
                const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${mapboxgl.accessToken}&country=AU`);
                const data = await response.json();
                if (data.features && data.features.length > 0) {
                    console.log('Geocoding result:', data.features[0].center);
                    return data.features[0].center;
                } else {
                    console.log('No geocoding result for:', location);
                    this.showToast('Location not found. Please try again.');
                    return null;
                }
            } catch (error) {
                console.error('Geocoding error:', error);
                this.showToast('Geocoding error. Please try again.');
                return null;
            }
        },
        async getRoute() {
            console.log('Getting route. Start:', this.startCoords, 'End:', this.endCoords);
            if (!this.startCoords || !this.endCoords) {
                console.log('Missing coordinates. Start:', this.startCoords, 'End:', this.endCoords);
                this.showToast('Please set both start and end points!');
                return;
            }

            try {
                this.removeExistingRoute();
                this.clearMarkers();

                const response = await this.directionsClient.getDirections({
                    profile: 'driving-traffic',
                    geometries: 'geojson',
                    waypoints: [
                        { coordinates: this.startCoords },
                        { coordinates: this.endCoords },
                    ],
                }).send();

                if (response.body.routes.length === 0) {
                    console.log('No route found');
                    this.showToast('No route found. Please try again.');
                    return;
                }

                const route = response.body.routes[0];
                console.log('Route found:', route);

                this.map.addSource('route', {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        properties: {},
                        geometry: route.geometry
                    }
                });

                this.map.addLayer({
                    id: 'route',
                    type: 'line',
                    source: 'route',
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#3887be',
                        'line-width': 5,
                        'line-opacity': 0.75
                    }
                });

                this.addMarker(this.startCoords);
                this.addMarker(this.endCoords);

                const bounds = new mapboxgl.LngLatBounds()
                    .extend(this.startCoords)
                    .extend(this.endCoords);

                this.map.fitBounds(bounds, { padding: 100 });

                this.routeInfo = {
                    duration: this.formatDuration(route.duration),
                    distance: this.formatDistance(route.distance),
                };
                console.log('Route info:', this.routeInfo);

            } catch (error) {
                console.error('Error getting route:', error);
                this.showToast('Error getting route. Please try again.');
            }
        },
        removeExistingRoute() {
            if (this.map.getLayer('route')) {
                this.map.removeLayer('route');
            }
            if (this.map.getSource('route')) {
                this.map.removeSource('route');
            }
        },
        formatDuration(seconds) {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            return `${hours} hours ${minutes} minutes`;
        },
        formatDistance(meters) {
            return `${(meters / 1000).toFixed(2)} km`;
        },
        handleMapClick(e) {
            const [lng, lat] = [e.lngLat.lng, e.lngLat.lat];
            console.log('Map clicked at:', [lng, lat]);
            this.clearMarkers();
            this.addMarker([lng, lat]);
            this.reverseGeocode([lng, lat]);
        },
        async reverseGeocode(coords) {
            console.log('Reverse geocoding:', coords);
            const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${coords[0]},${coords[1]}.json?access_token=${mapboxgl.accessToken}`);
            const data = await response.json();
            if (data.features && data.features.length > 0) {
                const placeName = data.features[0].place_name;
                console.log('Reverse geocoding result:', placeName);
                if (!this.startLocation) {
                    this.startLocation = placeName;
                    this.startCoords = coords;
                    console.log('Start location set by click:', this.startLocation, this.startCoords);
                } else {
                    this.endLocation = placeName;
                    this.endCoords = coords;
                    console.log('End location set by click:', this.endLocation, this.endCoords);
                }
                this.showDirectionsInput = true;
            }
        },
        showToast(message) {
            console.log('Toast:', message);
        },
        resetSearch() {
            console.log('Resetting search');
            this.showDirectionsInput = false;
            this.searchQuery = '';
            this.startLocation = '';
            this.endLocation = '';
            this.startCoords = null;
            this.endCoords = null;
            this.startLocationName = '';
            this.endLocationName = '';
            this.routeInfo = null;
            this.removeExistingRoute();
            this.clearMarkers();
            this.map.setZoom(12);
            this.map.setCenter([144.9631, -37.8136]); // Reset to Melbourne
        },
        handleDirectionsEnter() {
            console.log('Directions enter pressed');
            if (this.startLocation && this.endLocation) {
                this.handleGetDirections();
            } else if (!this.startLocation) {
                this.setStartLocation();
            } else {
                this.setEndLocation();
            }
        },
        async handleGetDirections() {
            console.log('Getting directions');
            await this.setStartLocation();
            await this.setEndLocation();
            this.getRoute();
        }
    },
};
</script>

<style scoped>
.map-container {
    position: relative;
    width: 100%;
    height: calc(100vh - 60px);
}

#map {
    width: 100%;
    height: 100%;
}

.search-bar,
.directions-panel {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    z-index: 1;
    background-color: white;
    padding: 10px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.search-bar {
    display: flex;
    gap: 10px;
}

.directions-panel {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.directions-input {
    display: flex;
    gap: 10px;
}

.search-bar input,
.directions-input input {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.info-container {
    position: absolute;
    bottom: 40px;
    left: 10px;
    background-color: white;
    padding: 15px;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    z-index: 1;
    max-width: 300px;
}

button {
    padding: 10px 15px;
    background-color: #3887be;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    white-space: nowrap;
}

button:hover {
    background-color: #285f8a;
}

.back-button {
    align-self: flex-start;
    background-color: #f0f0f0;
    color: #333;
}

.back-button:hover {
    background-color: #e0e0e0;
}

.route-info {
    margin-top: 10px;
    font-size: 0.9em;
}

/* Mapbox control styles */
:deep(.mapboxgl-ctrl-bottom-left) {
    display: none !important;
}

:deep(.mapboxgl-ctrl-bottom-right) {
    bottom: 10px;
    right: 10px;
}

:deep(.mapboxgl-ctrl-attrib) {
    background: rgba(255, 255, 255, 0.7);
    padding: 0 5px;
    border-radius: 3px 3px 0 0;
    font-size: 10px;
}
</style>