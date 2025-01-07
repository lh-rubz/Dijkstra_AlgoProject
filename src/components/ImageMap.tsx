import React, { useState, useEffect, useRef } from "react";
import './ImageMap.css';

type Capital = {
  name: string;
  country?: string;
  coordinates: [number, number];
};

type ImageMapProps = {
  capitals: Capital[];
  scaleLatitude: (latitude: number) => number;
  scaleLongitude: (longitude: number) => number;
  handleMarkerClick: (capitalName: string) => void; // handleMarkerClick passed as a prop
  showCapitalNames: boolean; // New prop to show or hide capital names
  flag: (country: string | undefined) => string | undefined;
  coordinatesLine: [number, number][]; // Array of coordinates to draw lines
};

export const ImageMap: React.FC<ImageMapProps> = ({
  capitals,
  scaleLatitude,
  scaleLongitude,
  handleMarkerClick,
  showCapitalNames,
  flag,
  coordinatesLine
}) => {
  const [selectedCapital, setSelectedCapital] = useState<Capital | null>(capitals[0]); // Default to the first capital
  const [showInfoBox, setShowInfoBox] = useState<boolean>(true); // State to control the visibility of the info box
  const [hideAnimation, setHideAnimation] = useState<boolean>(false); // State for triggering the slide-out animation

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // If a capital is selected, set a timer to hide the info box after 5 seconds
    if (selectedCapital) {
      const timer = setTimeout(() => {
        setSelectedCapital(null);
        setHideAnimation(true); // Trigger slide-out animation after 5 seconds
      }, 5000);

      // Clear the timer if the component is unmounted or if selectedCapital changes
      return () => clearTimeout(timer);
    } else {
      setHideAnimation(false);
    }
  }, [selectedCapital]);

  useEffect(() => {
    // Draw lines on the canvas when coordinatesLine changes
    const canvas = canvasRef.current;
    if (canvas ) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (coordinatesLine.length === 0) {
          console.log("cleeear");
          ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous lines
          return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous lines

        ctx.beginPath();
        ctx.strokeStyle = 'coral'; 
        ctx.lineWidth = 2;

        coordinatesLine.forEach(([lat, long], index) => {
          const x = scaleLongitude(long)+4;
          const y = scaleLatitude(lat)+5;

          if (index === 0) {
            ctx.moveTo(x, y); // Move to the first point
          } else {
            ctx.lineTo(x, y); // Draw line to subsequent points
          }
        });
        ctx.stroke();
        
      }
    }
  }, [coordinatesLine, scaleLatitude, scaleLongitude]);

  // Function to check if capital is part of the line
  const isCapitalOnLine = (capitalCoordinates: [number, number]) => {
    if(coordinatesLine.length==0){
return true;
    }
    return coordinatesLine.some(([lat, lon]) => lat === capitalCoordinates[0] && lon === capitalCoordinates[1]);
  };

  return (
    <div className="image-map-container" style={{ position: "relative" }}>
      <img
        src="https://cdn.britannica.com/37/245037-050-79129D52/world-map-continents-oceans.jpg"
        alt="World Map"
        style={{ width: "100%", height: "auto" }}
      />
      <canvas
        ref={canvasRef}
        width="1571" 
        height="786" 
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: "2" }} // Ensure canvas overlays on the image
      />

      {capitals.map((capital, index) => {
        const isOnLine = isCapitalOnLine(capital.coordinates); // Check if the capital is on the line
        return (
          <div
            key={index}
            className="capital-dot"
            style={{
              left: `${scaleLongitude(capital.coordinates[1])}px`,
              top: `${scaleLatitude(capital.coordinates[0])}px`,
              opacity: isOnLine ? 1 : 0.2, // Adjust opacity based on line inclusion
              
            }}
            onMouseEnter={() => {
              setSelectedCapital(capital); // Hovering over a capital updates the info box
              setShowInfoBox(true); // Show the info box immediately when hovering
              setHideAnimation(false); // Reset the hide animation state
            }}
            onClick={() => handleMarkerClick(capital.name)} // Use the handleMarkerClick passed from the parent
          >
            {showCapitalNames && (
              <div
                className="capital-name"
                style={{ position: 'absolute', top: '10px', left: '5px'}}
              >
                {capital.name}
              </div>
            )}
          </div>
        );
      })}

      {/* Info Box with Slide-Out Animation */}
      {showInfoBox && selectedCapital && (
        <div className={`info-box ${hideAnimation ? "slide-out" : ""}`}>
          <img src={flag(selectedCapital.country)} className="emoji" height={40} alt="Flag" />
          <div className="title">Capital Info</div>
          <div className="info-text">
            <strong>{selectedCapital.name}</strong>
            {selectedCapital.country && <p className="country">Country: {selectedCapital.country}</p>}
            <p className="coordinates">Coordinates: {selectedCapital.coordinates[0]}, {selectedCapital.coordinates[1]}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageMap;
