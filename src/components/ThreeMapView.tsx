// src/components/MapView.tsx

import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Home, Maximize2, Minimize2 } from 'lucide-react';

// --- TYPE DEFINITIONS ---
export interface MapMarker {
  id: string;
  position: { lat: number; lng: number };
  title: string;
  address: string;
  rating?: number;
}

interface ThreeMapViewProps {
  markers: MapMarker[];
  center?: { lat: number; lng: number };
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
  onMarkerClick?: (marker: MapMarker) => void;
}

const ThreeMapView = ({
  markers = [],
  center = { lat: 44.9429, lng: -123.0351 }, // Default center
  isFullScreen = false,
  onToggleFullScreen,
  onMarkerClick
}: ThreeMapViewProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const sceneRef = useRef<THREE.Scene>();
  const globeRef = useRef<THREE.Group>(); // Group for Earth + markers
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  // --- MOUSE INTERACTION LOGIC ---
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const handleCanvasClick = useCallback((event: MouseEvent) => {
    if (!mountRef.current || !cameraRef.current || !sceneRef.current) return;

    // Adjust mouse position to be relative to the canvas
    const rect = mountRef.current.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, cameraRef.current);
    const intersects = raycaster.intersectObjects(sceneRef.current.children, true);

    for (const intersect of intersects) {
      // Traverse up to find the parent group that holds the user data
      let parentGroup = intersect.object;
      while (parentGroup.parent && !parentGroup.userData.id) {
        parentGroup = parentGroup.parent;
      }

      if (parentGroup.userData.id) {
        const clickedMarkerData = parentGroup.userData as MapMarker;
        setSelectedMarker(clickedMarkerData);
        if (onMarkerClick) {
          onMarkerClick(clickedMarkerData);
        }
        return; // Stop after finding the first marker
      }
    }
    // If no marker is clicked, deselect
    setSelectedMarker(null);
  }, [onMarkerClick, raycaster]);


  // --- 3D SETUP AND RENDERING ---
  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1c);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 15);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // Globe Group (for unified rotation)
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeRef.current = globeGroup;

    // Earth Sphere
    const earthGeometry = new THREE.SphereGeometry(5, 32, 32);
    const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x2563eb });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earth);

    // Wireframe Overlay
    const wireframe = new THREE.Mesh(
        new THREE.SphereGeometry(5.01, 20, 20),
        new THREE.MeshBasicMaterial({ color: 0x60a5fa, wireframe: true, transparent: true, opacity: 0.2 })
    );
    globeGroup.add(wireframe);

    // Mouse Controls for Rotation & Zoom
    let isDragging = false;
    let previousMousePos = { x: 0, y: 0 };
    
    const onMouseDown = (e: MouseEvent) => { isDragging = true; previousMousePos = { x: e.clientX, y: e.clientY }; };
    const onMouseUp = () => { isDragging = false; };
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMousePos.x;
        const deltaY = e.clientY - previousMousePos.y;
        globeGroup.rotation.y += deltaX * 0.005;
        globeGroup.rotation.x += deltaY * 0.005;
      }
      previousMousePos = { x: e.clientX, y: e.clientY };
    };
    const onWheel = (e: WheelEvent) => {
        camera.position.z = THREE.MathUtils.clamp(camera.position.z + e.deltaY * 0.01, 8, 25);
    };

    mount.addEventListener('mousedown', onMouseDown);
    mount.addEventListener('mouseup', onMouseUp);
    mount.addEventListener('mousemove', onMouseMove);
    mount.addEventListener('wheel', onWheel);
    mount.addEventListener('click', handleCanvasClick);

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (!isDragging) {
        globeGroup.rotation.y += 0.0005; // Slow rotation
      }
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      mount.removeEventListener('mousedown', onMouseDown);
      mount.removeEventListener('mouseup', onMouseUp);
      mount.removeEventListener('mousemove', onMouseMove);
      mount.removeEventListener('wheel', onWheel);
      mount.removeEventListener('click', handleCanvasClick);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [handleCanvasClick]);

  // Handle resizing
  useEffect(() => {
    const handleResize = () => {
        if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to convert Lat/Lng to 3D coordinates
  const latLngToVector3 = (lat: number, lng: number, radius = 5) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -(radius * Math.sin(phi) * Math.cos(theta)),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  };

  // Update markers when props change
  useEffect(() => {
    if (!globeRef.current) return;

    // Clear old markers
    const objectsToRemove = globeRef.current.children.filter(child => child.userData.isMarker);
    objectsToRemove.forEach(child => globeRef.current!.remove(child));

    // Add new markers
    markers.forEach(markerData => {
      const markerGroup = new THREE.Group();
      markerGroup.userData = { ...markerData, isMarker: true }; // Attach data to the group

      const markerMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xff4444 })
      );
      markerGroup.add(markerMesh);
      markerGroup.position.copy(latLngToVector3(markerData.position.lat, markerData.position.lng));
      globeRef.current.add(markerGroup);
    });
  }, [markers]);


  return (
    <Card className={`bg-gray-900/50 border-blue-400/20 text-white ${isFullScreen ? 'fixed inset-4 z-50' : 'relative'}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-400" />
            <CardTitle className="text-lg">3D Facility Map</CardTitle>
        </div>
        <Button variant="ghost" size="sm" onClick={onToggleFullScreen}>
            {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          <div ref={mountRef} className={`w-full ${isFullScreen ? 'h-[calc(100vh-150px)]' : 'h-96'}`} style={{ cursor: 'grab' }} />
          <div className="absolute top-2 left-2 bg-black/50 text-white text-xs p-2 rounded">Click & drag to rotate • Scroll to zoom</div>
          {selectedMarker && (
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg text-black">
              <h4 className="font-semibold text-sm">{selectedMarker.title}</h4>
              <p className="text-xs text-gray-600 mt-1">{selectedMarker.address}</p>
              {selectedMarker.rating && <Badge variant="secondary" className="mt-2">⭐ {selectedMarker.rating}</Badge>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { ThreeMapView };
