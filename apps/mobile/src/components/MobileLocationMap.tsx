import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LocationData, MobileVideoItem } from '../types';

let WebViewComponent: any = null;
if (Platform.OS !== 'web') {
  try {
    WebViewComponent = require('react-native-webview').WebView;
  } catch (err) {
    console.warn('react-native-webview not found:', err);
  }
}

interface MobileLocationMapProps {
  videos: MobileVideoItem[];
  selectedLocation: LocationData | null;
  onSelectLocation: (loc: LocationData | null) => void;
  height?: number;
  onClose?: () => void;
}

export const MobileLocationMap: React.FC<MobileLocationMapProps> = ({
  videos,
  selectedLocation,
  onSelectLocation,
  height = 270,
  onClose,
}) => {
  const webViewRef = useRef<any>(null);

  // Filter valid locations and ensure numeric coordinates
  const validLocations = videos
    .filter((v) => v.location && Number.isFinite(v.location.latitude) && Number.isFinite(v.location.longitude))
    .map((v) => ({
      id: v.id,
      title: v.title.replace(/"/g, '\\"').replace(/'/g, "\\'"),
      productName: (v.productName || v.title).replace(/"/g, '\\"').replace(/'/g, "\\'"),
      thumbnail: v.thumbnail,
      city: v.location!.city,
      country: v.location!.country,
      latitude: Number(v.location!.latitude),
      longitude: Number(v.location!.longitude),
    }));

  const initialCenter = selectedLocation
    ? [Number(selectedLocation.longitude), Number(selectedLocation.latitude)]
    : [-73.9851, 40.7488]; // Default New York or World view
  const initialZoom = selectedLocation ? 9 : 2.2;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>ViralForge Mobile Map</title>
  <link href="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css" rel="stylesheet" />
  <script src="https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; background: #000000; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    
    .custom-marker {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: transform 0.2s ease;
    }
    .custom-marker:hover, .custom-marker:active {
      transform: scale(1.18);
    }
    .marker-bubble {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 2px solid #D4FF32;
      overflow: hidden;
      background: #111111;
      position: relative;
      box-shadow: 0 4px 12px rgba(0,0,0,0.8), 0 0 10px rgba(212,255,50,0.3);
    }
    .marker-bubble.selected {
      border: 3px solid #D4FF32;
      box-shadow: 0 0 16px rgba(212,255,50,0.8);
      transform: scale(1.15);
    }
    .marker-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .marker-badge {
      position: absolute;
      top: 0;
      right: 0;
      background: #D4FF32;
      color: #000000;
      font-size: 9px;
      font-weight: 900;
      padding: 1px 4px;
      border-bottom-left-radius: 6px;
    }
    .marker-arrow {
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 6px solid #D4FF32;
      margin-top: -1px;
    }

    .maplibregl-popup-content {
      background: #121212 !important;
      color: #ffffff !important;
      border-radius: 12px !important;
      padding: 12px !important;
      box-shadow: 0 8px 24px rgba(0,0,0,0.8) !important;
      border: 1px solid rgba(255,255,255,0.12) !important;
      max-width: 220px !important;
    }
    .maplibregl-popup-tip {
      border-top-color: #121212 !important;
    }
    .popup-city {
      color: #D4FF32;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }
    .popup-title {
      font-size: 12px;
      font-weight: 700;
      color: #FFFFFF;
      line-height: 1.3;
      margin-bottom: 4px;
    }
    .popup-sub {
      font-size: 10px;
      color: #A1A1AA;
      margin-bottom: 8px;
    }
    .popup-btn {
      width: 100%;
      background: #D4FF32;
      color: #000000;
      border: none;
      padding: 6px 10px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 800;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div id="map"></div>

  <script>
    const videos = ${JSON.stringify(validLocations)};
    const selectedCity = ${JSON.stringify(selectedLocation?.city || '')};

    function notifyRN(data) {
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify(data));
      } else if (window.parent) {
        window.parent.postMessage(JSON.stringify(data), '*');
      }
    }

    const darkStyle = {
      version: 8,
      sources: {
        'carto-dark': {
          type: 'raster',
          tiles: [
            'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            'https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
          ],
          tileSize: 256,
          attribution: '&copy; CARTO'
        }
      },
      layers: [
        {
          id: 'carto-dark-layer',
          type: 'raster',
          source: 'carto-dark',
          minzoom: 0,
          maxzoom: 20
        }
      ]
    };

    const map = new maplibregl.Map({
      container: 'map',
      style: darkStyle,
      center: [${initialCenter[0]}, ${initialCenter[1]}],
      zoom: ${initialZoom},
      attributionControl: false
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: false }), 'bottom-right');

    // Group videos by unique location
    const groups = {};
    videos.forEach(v => {
      const key = v.latitude.toFixed(3) + ',' + v.longitude.toFixed(3);
      if (!groups[key]) {
        groups[key] = {
          city: v.city,
          country: v.country,
          latitude: v.latitude,
          longitude: v.longitude,
          videos: []
        };
      }
      groups[key].videos.push(v);
    });

    // Add pins to map
    Object.values(groups).forEach(g => {
      const isSelected = selectedCity && g.city.toLowerCase() === selectedCity.toLowerCase();
      const el = document.createElement('div');
      el.className = 'custom-marker';

      const thumb = g.videos[0].thumbnail || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&fit=crop';

      el.innerHTML =
        '<div class="marker-bubble ' + (isSelected ? 'selected' : '') + '">' +
          '<img src="' + thumb + '" class="marker-img" onerror="this.src=\\'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&fit=crop\\'" />' +
          '<span class="marker-badge">' + g.videos.length + '</span>' +
        '</div>' +
        '<div class="marker-arrow"></div>';

      const popupHtml =
        '<div class="popup-city">📍 ' + g.city + ', ' + g.country + '</div>' +
        '<div class="popup-title">' + g.videos[0].productName + '</div>' +
        '<div class="popup-sub">' + g.videos.length + ' video proof' + (g.videos.length > 1 ? 's' : '') + ' in this city</div>' +
        '<button class="popup-btn" id="btn-' + g.city.replace(/\\s+/g, '-') + '">Filter ' + g.city + '</button>';

      const popup = new maplibregl.Popup({ offset: 24, closeButton: false }).setHTML(popupHtml);

      el.addEventListener('click', () => {
        notifyRN({
          type: 'SELECT_LOCATION',
          location: {
            city: g.city,
            country: g.country,
            latitude: g.latitude,
            longitude: g.longitude
          }
        });
        map.flyTo({ center: [g.longitude, g.latitude], zoom: 9, essential: true });
      });

      const marker = new maplibregl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat([g.longitude, g.latitude])
        .setPopup(popup)
        .addTo(map);

      popup.on('open', () => {
        const btn = document.getElementById('btn-' + g.city.replace(/\\s+/g, '-'));
        if (btn) {
          btn.onclick = () => {
            notifyRN({
              type: 'SELECT_LOCATION',
              location: {
                city: g.city,
                country: g.country,
                latitude: g.latitude,
                longitude: g.longitude
              }
            });
          };
        }
      });
    });

    // Support incoming messages to flyTo
    window.addEventListener('message', (event) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data && data.type === 'FLY_TO') {
          map.flyTo({ center: [data.longitude, data.latitude], zoom: 9, essential: true });
        } else if (data && data.type === 'RESET_ZOOM') {
          map.flyTo({ center: [-20, 20], zoom: 1.8, essential: true });
        }
      } catch (err) {}
    });
  </script>
</body>
</html>
`;

  // Fly to selected location when selectedLocation prop changes
  useEffect(() => {
    if (selectedLocation) {
      const msg = JSON.stringify({
        type: 'FLY_TO',
        latitude: Number(selectedLocation.latitude),
        longitude: Number(selectedLocation.longitude),
      });
      if (Platform.OS === 'web') {
        const iframe = document.getElementById('viralforge-maplibre-iframe') as HTMLIFrameElement;
        iframe?.contentWindow?.postMessage(msg, '*');
      } else if (webViewRef.current) {
        webViewRef.current.postMessage(msg);
      }
    }
  }, [selectedLocation]);

  // Handle messages from the MapLibre webview on web
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleWebMessage = (e: MessageEvent) => {
        try {
          const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
          if (data && data.type === 'SELECT_LOCATION') {
            onSelectLocation(data.location);
          }
        } catch {}
      };
      window.addEventListener('message', handleWebMessage);
      return () => window.removeEventListener('message', handleWebMessage);
    }
  }, [onSelectLocation]);

  const handleNativeMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data && data.type === 'SELECT_LOCATION') {
        onSelectLocation(data.location);
      }
    } catch (err) {
      console.warn('Native map message parse error:', err);
    }
  };

  const handleResetWorldView = () => {
    onSelectLocation(null);
    const msg = JSON.stringify({ type: 'RESET_ZOOM' });
    if (Platform.OS === 'web') {
      const iframe = document.getElementById('viralforge-maplibre-iframe') as HTMLIFrameElement;
      iframe?.contentWindow?.postMessage(msg, '*');
    } else if (webViewRef.current) {
      webViewRef.current.postMessage(msg);
    }
  };

  return (
    <View style={[styles.mapContainer, { height }]}>
      {/* Top Map Overlay Controls */}
      <View style={styles.mapOverlayHeader}>
        <View style={styles.locationPill}>
          <Text style={styles.pinIcon}>📍</Text>
          <Text style={styles.locationPillText} numberOfLines={1}>
            {selectedLocation ? selectedLocation.city : 'MapLibre Video Map'}
          </Text>
          {selectedLocation && (
            <TouchableOpacity
              onPress={() => onSelectLocation(null)}
              style={styles.pillClearBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.pillClearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.overlayControlsRight}>
          <TouchableOpacity
            style={styles.controlBtn}
            onPress={handleResetWorldView}
            activeOpacity={0.8}
          >
            <Text style={styles.controlBtnText}>🌍 World</Text>
          </TouchableOpacity>

          {onClose && (
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Map Renderer (Web: iframe; Mobile: react-native-webview) */}
      {Platform.OS === 'web' ? (
        <iframe
          id="viralforge-maplibre-iframe"
          srcDoc={htmlContent}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            backgroundColor: '#000000',
          }}
          title="ViralForge MapLibre Map"
        />
      ) : WebViewComponent ? (
        <WebViewComponent
          ref={webViewRef}
          source={{ html: htmlContent }}
          onMessage={handleNativeMessage}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#D4FF32" size="small" />
            </View>
          )}
        />
      ) : (
        <View style={styles.fallbackBox}>
          <Text style={styles.fallbackText}>Map requires react-native-webview</Text>
        </View>
      )}

      {/* Bottom Hint */}
      <View style={styles.bottomHintBar}>
        <Text style={styles.bottomHintText}>Tap any pin to filter videos from that city</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#262626',
    backgroundColor: '#0A0A0A',
    position: 'relative',
    marginBottom: 16,
  },
  webview: {
    flex: 1,
    backgroundColor: '#000000',
  },
  mapOverlayHeader: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 18, 18, 0.92)',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    maxWidth: '65%',
  },
  pinIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  locationPillText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  pillClearBtn: {
    marginLeft: 6,
    backgroundColor: '#262626',
    borderRadius: 10,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillClearText: {
    color: '#A1A1AA',
    fontSize: 9,
    fontWeight: '800',
  },
  overlayControlsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  controlBtn: {
    backgroundColor: 'rgba(18, 18, 18, 0.92)',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  controlBtnText: {
    color: '#D4FF32',
    fontSize: 10,
    fontWeight: '800',
  },
  closeBtn: {
    backgroundColor: 'rgba(18, 18, 18, 0.92)',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 20,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  bottomHintBar: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  bottomHintText: {
    color: '#71717A',
    fontSize: 9,
    fontWeight: '600',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackBox: {
    flex: 1,
    backgroundColor: '#0e0e0e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    color: '#71717A',
    fontSize: 12,
  },
});

