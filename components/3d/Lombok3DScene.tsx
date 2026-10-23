"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { LOMBOK_MARKERS, STORY_SECTIONS, LocationMarkerData } from "@/lib/data/lombok-3d-data";
import { Plus, Minus, Compass, RotateCcw } from "lucide-react";

interface Lombok3DSceneProps {
  targetPosition?: [number, number, number];
  targetLookAt?: [number, number, number];
  isExploreMode: boolean;
  selectedMarkerId?: string | null;
  sectionId?: string;
  onSelectMarker: (marker: LocationMarkerData) => void;
}

const LOMBOK_CENTER: [number, number] = [-8.5833, 116.3249]; // Leaflet uses [lat, lng]
const DEFAULT_ZOOM = 10;

export function Lombok3DScene({
  isExploreMode,
  selectedMarkerId,
  sectionId,
  onSelectMarker,
}: Lombok3DSceneProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Initialize Leaflet map
  useEffect(() => {
    let isCancelled = false;

    async function initMap() {
      if (!mapContainerRef.current || mapRef.current) return;

      let L: any;
      try {
        L = await import("leaflet");
        // Fix Leaflet default icon broken in webpack/Next.js
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        });
      } catch {
        setMapError("Gagal memuat pustaka peta.");
        return;
      }

      if (isCancelled || !mapContainerRef.current) return;

      // Create map
      const isMobile = window.innerWidth < 768;
      const map = L.map(mapContainerRef.current, {
        center: LOMBOK_CENTER,
        zoom: isMobile ? 9 : DEFAULT_ZOOM,
        zoomControl: false,
        attributionControl: true,
      });

      mapRef.current = map;

      // ESRI World Imagery — free satellite, no API key, perfect for "Dari Langit" theme
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution:
          'Tiles &copy; <a href="https://www.esri.com">Esri</a> &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18,
      }).addTo(map);

      // Overlay: reference labels (roads, place names) on top of satellite
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", {
        attribution: "",
        maxZoom: 18,
        opacity: 0.7,
      }).addTo(map);

      // Inject ping animation CSS once
      if (!document.getElementById("lf-pin-style")) {
        const style = document.createElement("style");
        style.id = "lf-pin-style";
        style.textContent = `
          @keyframes lf-ping {
            0%   { transform: scale(1);   opacity: 0.7; }
            70%  { transform: scale(2.2); opacity: 0; }
            100% { transform: scale(2.2); opacity: 0; }
          }
          .lf-pin-wrap { display:flex; align-items:center; justify-content:center; position:relative; cursor:pointer; transition:transform .2s ease; }
          .lf-pin-wrap:hover { transform: scale(1.3); }
          .lf-pin-wrap:hover .lf-ring { opacity: 1 !important; }
          .lf-ring { animation: lf-ping 2.4s cubic-bezier(0,0,.2,1) infinite; pointer-events:none; }
        `;
        document.head.appendChild(style);
      }

      // Add markers for each Lombok location
      LOMBOK_MARKERS.forEach((markerData) => {
        const isVolcano = markerData.category === "volcano";
        const isIsland  = markerData.category === "island";
        const isHarbor  = markerData.category === "harbor";
        const isAirport = markerData.category === "airport";

        const dot   = isVolcano ? "#f59e0b" : isIsland ? "#2dd4bf" : isHarbor ? "#60a5fa" : isAirport ? "#c084fc" : "#14b8a6";
        const ringC = isVolcano ? "rgba(245,158,11,0.4)"  : isIsland ? "rgba(45,212,191,0.3)" : isHarbor ? "rgba(96,165,250,0.3)" : isAirport ? "rgba(192,132,252,0.3)" : "rgba(20,184,166,0.25)";

        // Custom DivIcon
        const icon = L.divIcon({
          className: "",
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          html: `
            <div class="lf-pin-wrap" style="width:28px;height:28px;">
              <div class="lf-ring" style="position:absolute;width:24px;height:24px;border-radius:50%;background:${ringC};opacity:0.6;"></div>
              <div style="width:14px;height:14px;border-radius:50%;background:#0b171c;border:1.5px solid ${dot};display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(0,0,0,.85);position:relative;z-index:1;">
                <div style="width:6px;height:6px;border-radius:50%;background:${dot};"></div>
              </div>
            </div>
          `,
        });

        const popupHtml = `
          <div style="background:rgba(9,20,26,0.97);border:1px solid rgba(243,239,230,0.14);border-radius:12px;padding:10px 14px;color:#f3efe6;min-width:155px;font-family:system-ui,sans-serif;">
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:4px;">
              <span style="font-size:12px;font-weight:700;">${markerData.name}</span>
              ${markerData.elevation ? `<span style="font-size:9px;font-family:monospace;color:${dot};background:${ringC};border:1px solid ${dot}55;padding:1px 5px;border-radius:6px;white-space:nowrap;flex-shrink:0;">${markerData.elevation}</span>` : ""}
            </div>
            <p style="font-size:10.5px;color:#7a9099;margin:0 0 6px;line-height:1.4;">${markerData.subLocation || markerData.nativeName || markerData.tag}</p>
            <div style="border-top:1px solid rgba(243,239,230,0.1);padding-top:5px;display:flex;justify-content:space-between;font-size:10px;color:#14b8a6;">
              <span>Klik untuk info & booking</span><span>→</span>
            </div>
          </div>
        `;

        const marker = L.marker([markerData.lngLat[1], markerData.lngLat[0]] as [number, number], { icon })
          .addTo(map)
          .bindPopup(popupHtml, {
            closeButton: false,
            className: "leaflet-dark-popup",
            maxWidth: 260,
            offset: [0, -6],
          });

        // Open popup on hover
        marker.on("mouseover", () => {
          if (selectedMarkerId !== markerData.id) marker.openPopup();
        });
        // Close popup on mouse leave
        marker.on("mouseout", () => {
          marker.closePopup();
        });
        // Click: select marker, close mini tooltip, fire callback
        marker.on("click", () => {
          marker.closePopup();
          onSelectMarker(markerData);
          map.flyTo(
            [markerData.lngLat[1], markerData.lngLat[0]] as [number, number],
            13,
            { animate: true, duration: 1.2 }
          );
        });

        markersRef.current.set(markerData.id, marker);
      });

      // Style Leaflet attribution to match dark theme
      const attrEl = mapContainerRef.current.querySelector(".leaflet-control-attribution") as HTMLElement | null;
      if (attrEl) {
        attrEl.style.background = "rgba(11,23,28,0.75)";
        attrEl.style.color = "#93a39e";
        attrEl.style.fontSize = "10px";
        attrEl.style.borderRadius = "6px";
        attrEl.style.backdropFilter = "blur(4px)";
      }

      if (!isCancelled) setMapLoaded(true);
    }

    initMap().catch((err) => {
      console.error("[Leaflet] Init error:", err);
      setMapError("Gagal menginisialisasi peta.");
    });

    return () => {
      isCancelled = true;
      if (mapRef.current) {
        try { mapRef.current.remove(); } catch {}
        mapRef.current = null;
        markersRef.current.clear();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Resize on window/container change
  useEffect(() => {
    const resize = () => { try { mapRef.current?.invalidateSize(); } catch {} };
    window.addEventListener("resize", resize);
    const ro = new ResizeObserver(resize);
    if (mapContainerRef.current) ro.observe(mapContainerRef.current);
    return () => { window.removeEventListener("resize", resize); ro.disconnect(); };
  }, []);

  // Sync camera: selectedMarkerId or sectionId
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;

    if (selectedMarkerId) {
      const m = LOMBOK_MARKERS.find((x) => x.id === selectedMarkerId);
      if (m) {
        // Close all other popups
        markersRef.current.forEach((marker, id) => { if (id !== m.id) marker.closePopup(); });
        // Open popup and fly
        const leafletMarker = markersRef.current.get(m.id);
        if (leafletMarker) {
          mapRef.current.flyTo(
            [m.lngLat[1], m.lngLat[0]] as [number, number],
            13,
            { animate: true, duration: 1.2 }
          );
          setTimeout(() => leafletMarker.openPopup(), 800);
        }
      }
      return;
    }

    // Story section fly-to
    const section = STORY_SECTIONS.find((s) => s.id === sectionId) || STORY_SECTIONS[0];
    if (section) {
      const isMobile = window.innerWidth < 768;
      // Close all popups when changing section
      markersRef.current.forEach((marker) => marker.closePopup());
      mapRef.current.flyTo(
        section.mapCenter.slice().reverse() as [number, number], // convert [lng,lat] → [lat,lng]
        isMobile ? section.mapZoom - 1 : section.mapZoom,
        { animate: true, duration: 1.4 }
      );
    }
  }, [sectionId, selectedMarkerId, mapLoaded]);

  // Navigation handlers
  const handleZoomIn   = useCallback(() => { try { mapRef.current?.zoomIn(1);  } catch {} }, []);
  const handleZoomOut  = useCallback(() => { try { mapRef.current?.zoomOut(1); } catch {} }, []);
  const handleReset    = useCallback(() => {
    markersRef.current.forEach((m) => m.closePopup());
    try {
      mapRef.current?.flyTo(LOMBOK_CENTER, DEFAULT_ZOOM, { animate: true, duration: 1.4 });
    } catch {}
  }, []);

  return (
    <div className="w-full h-full relative select-none overflow-hidden bg-[#0b171c]">
      {/* Leaflet map container */}
      <div
        ref={mapContainerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        aria-label="Peta Pulau Lombok"
      />

      {/* Loading overlay */}
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0b171c]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#14b8a6]/20 border-t-[#14b8a6] animate-spin" />
            <p className="font-display text-lg tracking-wide text-[#f3efe6]">Dari Langit</p>
            <p className="text-xs font-mono text-[#93a39e] tracking-widest uppercase">
              Memuat Peta Lombok…
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {mapError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0b171c] p-8 text-center">
          <p className="font-display text-xl text-[#f3efe6] mb-2">Peta tidak dapat dimuat</p>
          <p className="text-sm text-[#93a39e] max-w-xs">{mapError}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 px-4 py-2 rounded-xl bg-[#14b8a6]/15 border border-[#14b8a6]/30 text-[#2dd4bf] text-sm font-medium hover:bg-[#14b8a6]/25 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Dark Navigation Controls */}
      {mapLoaded && (
        <aside
          className="absolute right-4 top-24 z-[1000] flex flex-col gap-1.5 p-1.5 rounded-2xl bg-[#0f222b]/90 border border-[#f3efe6]/15 backdrop-blur-md shadow-2xl shadow-black/60"
          aria-label="Kontrol Navigasi Peta"
        >
          <button type="button" onClick={handleZoomIn} title="Zoom In" aria-label="Zoom In"
            className="w-8 h-8 flex items-center justify-center rounded-xl text-[#93a39e] hover:text-[#f3efe6] hover:bg-[#14b8a6]/15 active:scale-95 transition-all duration-200">
            <Plus className="w-4 h-4" />
          </button>

          <button type="button" onClick={handleZoomOut} title="Zoom Out" aria-label="Zoom Out"
            className="w-8 h-8 flex items-center justify-center rounded-xl text-[#93a39e] hover:text-[#f3efe6] hover:bg-[#14b8a6]/15 active:scale-95 transition-all duration-200">
            <Minus className="w-4 h-4" />
          </button>

          <div className="h-px bg-[#f3efe6]/10 mx-1 my-0.5" />

          <button type="button" onClick={handleReset} title="Reset ke Lombok" aria-label="Reset View"
            className="w-8 h-8 flex items-center justify-center rounded-xl text-[#93a39e] hover:text-[#f3efe6] hover:bg-[#14b8a6]/15 active:scale-95 transition-all duration-200">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}
    </div>
  );
}
