import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Home, Maximize2, Minimize2 } from 'lucide-react';

interface MapMarker {
  id: string;
  position: { lat: number; lng: number };
  title: string;
  address: string;
  rating?: number;
  type?: string;
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
  center = { lat: 44.9429, lng: -123.0351 }, // Salem, OR
  isFullScreen = false,
  onToggleFullScreen,
  onMarkerClick 
}: ThreeMapViewProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const markersRef = useRef<THREE.Group[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Convert lat/lng to 3D coordinates
  const latLngTo3D = (lat: number, lng: number, radius = 5) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    return {
      x: -(radius * Math.sin(phi) * Math.cos(theta)),
      y: radius * Math.cos(phi),
      z: radius * Math.sin(phi) * Math.sin(theta)
    };
  };

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1c);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 12);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x0a0f1c, 1);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create Earth sphere
    const earthGeometry = new THREE.SphereGeometry(5, 32, 32);
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x2563eb,
      transparent: true,
      opacity: 0.8,
      wireframe: false
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Add wireframe overlay
    const wireframeGeometry = new THREE.SphereGeometry(5.01, 16, 16);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x60a5fa,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    scene.add(wireframe);

    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (event: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        const deltaMove = {
          x: event.clientX - previousMousePosition.x,
          y: event.clientY - previousMousePosition.y
        };

        earth.rotation.y += deltaMove.x * 0.005;
        earth.rotation.x += deltaMove.y * 0.005;
        wireframe.rotation.y += deltaMove.x * 0.005;
        wireframe.rotation.x += deltaMove.y * 0.005;

        // Rotate all markers with the earth
        markersRef.current.forEach(markerGroup => {
          markerGroup.rotation.y += deltaMove.x * 0.005;
          markerGroup.rotation.x += deltaMove.y * 0.005;
        });
      }

      previousMousePosition = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (event: WheelEvent) => {
      camera.position.z += event.deltaY * 0.01;
      camera.position.z = Math.max(8, Math.min(20, camera.position.z));
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('wheel', handleWheel);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (!isDragging && !isAnimating) {
        earth.rotation.y += 0.002;
        wireframe.rotation.y += 0.002;
        markersRef.current.forEach(markerGroup => {
          markerGroup.rotation.y += 0.002;
        });
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isAnimating]);

  // Update markers when props change
  useEffect(() => {
    if (!sceneRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(markerGroup => {
      sceneRef.current!.remove(markerGroup);
    });
    markersRef.current = [];

    // Add new markers
    markers.forEach((marker, index) => {
      const position = latLngTo3D(marker.position.lat, marker.position.lng);
      
      // Create marker group
      const markerGroup = new THREE.Group();

      // Marker geometry (small sphere)
      const markerGeometry = new THREE.SphereGeometry(0.1, 8, 8);
      const markerMaterial = new THREE.MeshPhongMaterial({
        color: 0xff4444,
        emissive: 0x330000
      });
      const markerMesh = new THREE.Mesh(markerGeometry, markerMaterial);

      // Pulsing effect
      const pulseGeometry = new THREE.SphereGeometry(0.15, 8, 8);
      const pulseMaterial = new THREE.MeshBasicMaterial({
        color: 0xff4444,
        transparent: true,
        opacity: 0.3
      });
      const pulseMesh = new THREE.Mesh(pulseGeometry, pulseMaterial);

      markerGroup.add(markerMesh);
      markerGroup.add(pulseMesh);
      markerGroup.position.set(position.x, position.y, position.z);

      // Store marker data
      (markerGroup as any).userData = marker;

      sceneRef.current.add(markerGroup);
      markersRef.current.push(markerGroup);

      // Animate pulse
      const animatePulse = () => {
        const time = Date.now() * 0.005 + index;
        pulseMesh.scale.setScalar(1 + Math.sin(time) * 0.3);
      };

      // Add to animation loop (simplified for this example)
      setInterval(animatePulse, 50);
    });
  }, [markers]);

  // Handle window resize
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

  return (
    <Card className={`glass-card ${isFullScreen ? 'fixed inset-4 z-50' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-primary-bright" />
          <CardTitle className="text-lg">3D Facility Map</CardTitle>
          <Badge variant="secondary" className="text-xs">
            {markers.length} locations
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          {onToggleFullScreen && (
            <Button variant="ghost" size="sm" onClick={onToggleFullScreen}>
              {isFullScreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          <div 
            ref={mountRef} 
            className={`bg-slate-900 ${isFullScreen ? 'h-[calc(100vh-200px)]' : 'h-96'}`}
            style={{ cursor: 'grab' }}
          />
          
          {/* Map Instructions */}
          <div className="absolute top-4 left-4 bg-black/50 text-white text-xs p-2 rounded">
            Click and drag to rotate • Scroll to zoom
          </div>

          {/* Marker Count */}
          <div className="absolute top-4 right-4 bg-black/50 text-white text-xs p-2 rounded">
            <Home className="inline h-3 w-3 mr-1" />
            {markers.length} facilities
          </div>

          {/* Selected Marker Info */}
          {selectedMarker && (
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg">
              <h4 className="font-semibold text-sm">{selectedMarker.title}</h4>
              <p className="text-xs text-gray-600 mt-1">{selectedMarker.address}</p>
              {selectedMarker.rating && (
                <div className="flex items-center mt-2">
                  <Badge variant="secondary" className="text-xs">
                    ⭐ {selectedMarker.rating}
                  </Badge>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreeMapView;