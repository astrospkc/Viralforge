import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin, Navigation, X, Layers } from 'lucide-react';
import type { VideoPost, LocationData } from '../../types';

interface LocationVideoMapProps {
    videos: VideoPost[];
    selectedLocation: LocationData | null;
    onSelectLocation: (loc: LocationData | null) => void;
    onSelectVideo?: (video: VideoPost) => void;
    height?: string;
}

// Universal standalone dark map style using CARTO Dark Matter raster tiles.
// Does NOT require external style.json, glyphs, or API keys, ensuring 100% reliable rendering.
const DARK_MAP_STYLE: maplibregl.StyleSpecification = {
    version: 8,
    sources: {
        'carto-dark': {
            type: 'raster',
            tiles: [
                'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
                'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
                'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
                'https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap, &copy; CARTO',
        },
    },
    layers: [
        {
            id: 'carto-dark-layer',
            type: 'raster',
            source: 'carto-dark',
            minzoom: 0,
            maxzoom: 20,
        },
    ],
};

export const LocationVideoMap: React.FC<LocationVideoMapProps> = ({
    videos,
    selectedLocation,
    onSelectLocation,
    height = '380px',
}) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const markersRef = useRef<maplibregl.Marker[]>([]);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [isLocating, setIsLocating] = useState(false);

    // Initialize MapLibre
    useEffect(() => {
        if (!mapContainerRef.current) return;

        const defaultCenter: [number, number] = (selectedLocation && Number.isFinite(selectedLocation.longitude) && Number.isFinite(selectedLocation.latitude))
            ? [Number(selectedLocation.longitude), Number(selectedLocation.latitude)]
            : [-73.9851, 40.7488]; // Default New York or world view

        const map = new maplibregl.Map({
            container: mapContainerRef.current,
            style: DARK_MAP_STYLE,
            center: defaultCenter,
            zoom: selectedLocation ? 9 : 2.5,
            attributionControl: false,
        });

        map.on('error', (e) => {
            console.warn('MapLibre internal notice:', e);
        });

        map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: false }), 'bottom-right');

        map.on('load', () => {
            setMapLoaded(true);
            setTimeout(() => map.resize(), 100);
        });

        // Fallback in case load event takes time
        const timer = setTimeout(() => {
            setMapLoaded(true);
            map.resize();
        }, 300);

        mapRef.current = map;

        return () => {
            clearTimeout(timer);
            map.remove();
            mapRef.current = null;
        };
    }, []);

    // Resize map when window or container size changes
    useEffect(() => {
        if (mapRef.current && mapLoaded) {
            setTimeout(() => mapRef.current?.resize(), 150);
        }
    }, [mapLoaded, height]);

    // Update Markers when videos or selection changes
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !mapLoaded) return;

        // Clear existing markers
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];

        // Group videos by unique coordinates safely
        const locationGroups = new Map<string, { loc: LocationData; vids: VideoPost[] }>();

        videos.forEach(v => {
            if (!v.location) return;
            const lat = Number(v.location.latitude);
            const lng = Number(v.location.longitude);
            if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

            const key = `${lat.toFixed(3)},${lng.toFixed(3)}`;
            if (!locationGroups.has(key)) {
                locationGroups.set(key, {
                    loc: { ...v.location, latitude: lat, longitude: lng },
                    vids: []
                });
            }
            locationGroups.get(key)!.vids.push(v);
        });

        // Add pins for each location group
        locationGroups.forEach(({ loc, vids }) => {
            const isCurrentSelected =
                selectedLocation &&
                selectedLocation.city.toLowerCase() === loc.city.toLowerCase();

            // Create custom animated DOM Marker element
            const el = document.createElement('div');
            el.className = 'custom-video-marker';
            el.style.cursor = 'pointer';

            const thumb = vids[0]?.thumbnail || vids[0]?.userAvatar || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200&fit=crop';
            const hasShop = Boolean(vids[0]?.shop);

            el.innerHTML = `
                <div class="relative group flex items-center justify-center transition-transform duration-300 hover:scale-125" style="transform: translate(-50%, -50%);">
                    <div class="w-10 h-10 rounded-full border-2 ${isCurrentSelected ? 'border-yellow-400 scale-110 shadow-lg shadow-yellow-500/50' : 'border-white/90 shadow-md shadow-black/80'} overflow-hidden bg-[#181818] relative flex items-center justify-center">
                        <img src="${thumb}" class="w-full h-full object-cover" onerror="this.style.display='none'" />
                        <span class="absolute inset-0 flex items-center justify-center text-xs">📍</span>
                        <div class="absolute inset-0 bg-black/25 flex items-center justify-center">
                            <span class="text-[9px] font-black text-slate-950 bg-yellow-400 px-1 rounded-sm">${vids.length}</span>
                        </div>
                    </div>
                    <div class="absolute -bottom-1.5 w-2 h-2 bg-yellow-400 rotate-45 border-r border-b border-black"></div>
                </div>
            `;

            // Popup HTML
            const popupHtml = `
                <div style="background: #141722; color: #fff; padding: 12px; border-radius: 12px; font-family: sans-serif; min-width: 220px; border: 1px solid rgba(196,181,253,0.2); box-shadow: 0 10px 30px rgba(0,0,0,0.8);">
                    <div style="font-size: 10px; color: #FACC15; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px;">
                        📍 ${loc.city}, ${loc.state || loc.country}
                    </div>
                    <div style="font-size: 13px; font-weight: bold; margin-bottom: 4px; line-height: 1.2; color: #fff;">
                        ${vids[0]?.shop?.name || vids[0]?.title || 'Video Proof'}
                    </div>
                    <div style="font-size: 11px; color: #94A3B8; margin-bottom: 8px;">
                        ${vids.length} video proof${vids.length > 1 ? 's' : ''} ${hasShop ? '· Verified Shop' : `• By ${vids[0]?.userName || 'Creator'}`}
                    </div>
                    <button id="popup-filter-btn-${loc.city.replace(/\s+/g, '-')}" style="width: 100%; background: #FACC15; color: #0F172A; border: none; padding: 7px 10px; border-radius: 8px; font-size: 11px; font-weight: 800; cursor: pointer; transition: background 0.2s;">
                        Filter Videos in ${loc.city}
                    </button>
                </div>
            `;

            const popup = new maplibregl.Popup({ offset: 25, closeButton: false })
                .setHTML(popupHtml);

            el.addEventListener('click', () => {
                onSelectLocation(loc);
                map.flyTo({
                    center: [loc.longitude, loc.latitude],
                    zoom: 10,
                    essential: true,
                });
            });

            const marker = new maplibregl.Marker({ element: el })
                .setLngLat([loc.longitude, loc.latitude])
                .setPopup(popup)
                .addTo(map);

            popup.on('open', () => {
                const btn = document.getElementById(`popup-filter-btn-${loc.city.replace(/\s+/g, '-')}`);
                if (btn) {
                    btn.onclick = () => {
                        onSelectLocation(loc);
                    };
                }
            });

            markersRef.current.push(marker);
        });
    }, [videos, selectedLocation, mapLoaded]);

    // Fly to selected location when changed from outside
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !mapLoaded || !selectedLocation) return;
        const lat = Number(selectedLocation.latitude);
        const lng = Number(selectedLocation.longitude);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

        map.flyTo({
            center: [lng, lat],
            zoom: 9,
            duration: 1800,
            essential: true,
        });
    }, [selectedLocation, mapLoaded]);

    // Browser Geolocation: "Near Me"
    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setIsLocating(false);
                const userLoc: LocationData = {
                    city: 'Your Nearby Area',
                    country: 'Local',
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                };
                onSelectLocation(userLoc);
                mapRef.current?.flyTo({
                    center: [userLoc.longitude, userLoc.latitude],
                    zoom: 11,
                    essential: true,
                });
            },
            (err) => {
                setIsLocating(false);
                console.warn('Geolocation error:', err);
                alert('Could not retrieve your location. Please check your browser permissions.');
            },
            { timeout: 8000 }
        );
    };

    return (
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0e0e0e] shadow-2xl transition-all">
            {/* Top Toolbar Overlay on Map */}
            <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2 pointer-events-auto bg-[#141722]/95 backdrop-blur-md border border-violet-300/20 px-3 py-1.5 rounded-xl shadow-lg">
                    <MapPin size={14} className="text-yellow-400 shrink-0" />
                    <span className="text-xs font-bold text-white">
                        {selectedLocation ? `Filtered: ${selectedLocation.city}, ${selectedLocation.country}` : 'Explore Videos & Shops by Location'}
                    </span>
                    {selectedLocation && (
                        <button
                            onClick={() => onSelectLocation(null)}
                            className="ml-1 text-slate-400 hover:text-white p-0.5 rounded-full hover:bg-white/10 transition-colors"
                            title="Reset location filter"
                        >
                            <X size={13} />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                    {/* Geolocation Button */}
                    <button
                        onClick={handleUseMyLocation}
                        disabled={isLocating}
                        className="flex items-center gap-1.5 bg-[#141722]/95 hover:bg-[#1E2333] text-slate-200 hover:text-white border border-violet-300/20 px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md transition-all shadow-lg"
                        title="Find videos near me"
                    >
                        <Navigation size={13} className={isLocating ? 'animate-spin text-yellow-400' : 'text-yellow-400'} />
                        <span>{isLocating ? 'Locating…' : 'Near Me (5km)'}</span>
                    </button>

                    {/* Reset Zoom */}
                    <button
                        onClick={() => {
                            onSelectLocation(null);
                            mapRef.current?.flyTo({ center: [-20, 25], zoom: 1.8 });
                        }}
                        className="bg-[#141722]/95 hover:bg-[#1E2333] text-slate-300 hover:text-white border border-violet-300/20 p-2 rounded-xl text-xs font-bold backdrop-blur-md transition-all shadow-lg"
                        title="World View"
                    >
                        <Layers size={13} />
                    </button>
                </div>
            </div>

            {/* MapLibre DOM Container */}
            <div ref={mapContainerRef} style={{ width: '100%', height }} />

            {/* Bottom info strip */}
            <div className="absolute bottom-2 left-3 z-10 pointer-events-none">
                <span className="text-[10px] text-gray-400 bg-black/70 px-2 py-0.5 rounded-md backdrop-blur-sm border border-white/5">
                    Click any pin to filter videos from that area
                </span>
            </div>
        </div>
    );
};
