import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer,Polyline } from "react-leaflet";
import "./App.css";
import L from "leaflet";
import placeholder from "./assets/placeholder.png";
import { ReactComponent as WorldMap } from './assets/world.svg'; 
import {ImageMap}from './components/ImageMap';
import getCountryByCapital from "./capitaltocountry";

import { Graph } from "./DScomponents/Graph";
import CustomDropdown from "./components/CustomDropdown";
import { Country } from "./DScomponents/Country";
import { Vertex } from "./DScomponents/Vertex";
import { Edge } from "./DScomponents/Edge";
import { Dijkstra } from "./DScomponents/dijkstra";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  type Capital = {
    name: string;
    coordinates: [number, number];
    country?: string;
   
  };
  
  interface Edge {
    from: string;
    to: string;
    price: number;
    time: string;
  }
  const [fileLoaded, setFileLoaded] = useState(false); 
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [coordinatesArray, setCoordinatesArray]= useState <[number,number][]>([]);
  const imageRef = useRef<HTMLImageElement  | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [showCapitalNames, setShowCapitalNames] = useState(true);
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [filter, setFilter] = useState<"cost"|"time"|"dist">("dist");
  const [path, setPath] = useState("");
  const [distance, setDistance] = useState("");
  const [cost, setCost] = useState("");
  const [time, setTime] = useState("");
  const [capitals, setCapitals] = useState<{ name: string; coordinates: [number, number]; country?: string}[]>([]);
  const [edges, setEdges] = useState<{ from: string; to: string; price: number; time: string }[]>([]);
  const [mapType, setMapType] = useState<'real' | 'image'>('real');
  const scaleLongitude = (longitude:number) => ((longitude + 180) * (1571 / 360));  
  const scaleLatitude = (latitude:number) => ((90 - latitude) * (786 / 180))+60;  
  const [graph,setGraph]= useState<Graph>();
  
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  // Toggle the map type
  const handleMapTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMapType(event.target.value as 'real' | 'image');
  };
  const closeDropDown=()=>{
   
    setOpenDropdown(null);
   
  }

  
  
  // Function to handle click on a marker or image map area
const handleMarkerClick = (capitalName: string) => {
  
  if (!source) {
    setSource(capitalName); // Set source if empty
    closeDropDown();
  
  } else if (!target) {
    setTarget(capitalName); // Set target if empty
    closeDropDown();
    }
};
const handleDropdownToggle = (label: string) => {
  setOpenDropdown(openDropdown === label ? null : label);
};
  const handleResize = () => {
   setWindowSize({width:window.innerWidth,height:window.innerHeight})
    if (imageRef.current) {
      setDimensions({
        width: imageRef.current.clientWidth,
        height: imageRef.current.clientHeight,
      });
    }
    if (window.innerWidth !== 1920 || window.innerHeight !== 945) {
      setMapType('real');
    }
  };

  const resetData = () => {
    setSource('');
    setTarget('');
    setFilter('dist');
    setPath('');
    setDistance('');
    setCost('');
    setTime('');
    closeDropDown();
    setCoordinatesArray([]);
    
  };
  
  useEffect(() => {
    // Set initial dimensions
    if (imageRef.current) {
      setDimensions({
        width: imageRef.current.width,
        height: imageRef.current.height,
      });
    }

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
 
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const allowedExtensions = ["txt", "csv"];
        const fileExtension = file.name.split(".").pop()?.toLowerCase();
  
       
        // Read the file content using FileReader
        const reader = new FileReader();
        reader.onload = () => {
          const text = reader.result as string;
          const lines = text.split("\n").map((line) => line.trim());
          const vertices:Vertex[]=[];
          const [numberOfCapitals, numberOfEdges] = lines[0].split(",").map(Number);
         
          const capitalsData: Capital[] = lines
          .slice(1, 1 + numberOfCapitals)
          .map((line) => {
            const [name, lat, lon] = line.split(",").map((data) => data.trim());
            const country = getCountryByCapital(name); // Use the getCountryByCapital method
            const cObj= new Country(name,parseFloat(lon),parseFloat(lat))
           const vObj= new Vertex(cObj);
            vertices.push(vObj);
            // Return the capital data with optional country
            return {
              name,
              coordinates: [parseFloat(lat), parseFloat(lon)] as [number, number],
              country
            };
          });
          const graphObj= new Graph(vertices);
          console.log(vertices); 
          const edgesData: Edge[] = lines
          .slice(1 + numberOfCapitals, 1 + numberOfCapitals + numberOfEdges)
          .map((line) => {
            const [from, to, price, time] = line.split(",").map((data) => data.trim());
            const fromVertex = vertices.find((vertex) => vertex.getCountry().getCountryName()?.toLocaleLowerCase() === from.toLowerCase());
const toVertex = vertices.find((vertex) => vertex.getCountry().getCountryName()?.toLocaleLowerCase() === to.toLowerCase());
setGraph(graphObj);
if(toVertex && fromVertex){
            const edgeObj= new Edge(fromVertex!,toVertex!,parseFloat(price),parseInt(time));
            graphObj.addEdge(edgeObj);
          graph?.addEdge(edgeObj);
          }
            return {
              from,
              to,
              price: parseFloat(price),
              time,
            };
          });
          setCapitals(capitalsData);
          setEdges(edgesData);
          
          
  };

        reader.readAsText(file); // Start reading the file content
     
     
     
        setFileLoaded(true);
      } catch (error) {
        console.error("Failed to read the file:", error);
      }
   
   
   
    }};
    const calculateEmojiPositions = (coordinates: [number, number][]) => {
      return coordinates; 
    };
  
  const getImageForCountry = (country: string | undefined) => {
    if (!country) {
      return 'public/country_flags/unknown.png'; 
    }
  try{
    const formattedCountry = country.toLowerCase().replace(/\s+/g, "-");

    const imagePath =  `/country_flags/${formattedCountry}.png`;

    return imagePath;}catch(e){

    }  };
  
   
  

  const handleRun = () => {
    // Mock function to simulate calculations
    const dijkstra = new Dijkstra();
const start:Vertex= graph?.getVertexByName(source)!;
    const end:Vertex= graph?.getVertexByName(target)!;
     dijkstra.dijkstra(filter,start,graph!,end);
    const results=dijkstra.getFinalValues(end);
    const pathData= dijkstra.getPathAndVertices(end);
   const coordinatesLine:[number,number][]=[];
    pathData.vertices.forEach(vertex=>{
    const country = vertex.getCountry(); // Get the Country from Vertex
    const coordinates: [number, number] = [country.getLatitude(), country.getLongitude()]; // Ensure this is a tuple
    coordinatesLine.push(coordinates); // Push the coordinates to the array

   })
    
   if (results?.dist === Infinity) {
    setPath("No Path");
    setCoordinatesArray([]);
    setDistance("unknown");
    setCost("unknown");
    setTime("unknown");
  } else {
    setCoordinatesArray(coordinatesLine);
    setPath(pathData.pathString); 
    setDistance(results?.dist.toFixed(3)+" km");
    setCost(results?.cost+"$");
    setTime(results?.time+"m");
  }
   
    
    console.log(graph?.getEdgesCount());
    
  };
  if (!fileLoaded) {
    return (
      <div className="file-upload-container">
        {/* File upload button with custom styles */}
        <input 
          type="file" 
          onChange={handleFileChange} 
          accept=".txt" 
          id="file-input" 
          className="file-upload-input"
        />
        <label htmlFor="file-input" className="file-upload-button">
          Select a File
        </label>
      </div>
    );
  }
  const emojiPositions = calculateEmojiPositions(coordinatesArray);

  return (
    <div className="app-container">
     {/* Map Type Selection */}
     {windowSize.width === 1920 && windowSize.height === 945 && (
        <div className="map-type-toggle">
          <label>Select Map Type:</label>
          <select value={mapType} onChange={handleMapTypeChange}>
            <option value="real">Real Map</option>
            <option value="image">Image Map</option>
          </select>
        </div>
      )}
      {/* Map Section */}
      {mapType === 'real' && <MapContainer
        center={[20, 0]}
        zoom={3}
        zoomControl={false}
        scrollWheelZoom={true}
        dragging={true}
        className="map-container"
       
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        />
         {/* Render markers for each capital */}
         {capitals.map((capital, index) => {
  // Check if the capital's coordinates are part of the path
  const isInPath = () => {
    console.log(coordinatesArray.length);
    if (coordinatesArray.length === 0) {
      return true;
    }
    return coordinatesArray.some(
      ([lat, lon]) => lat === capital.coordinates[0] && lon === capital.coordinates[1]
    );
  };
  

  return (
    <Marker
      key={index}
      position={capital.coordinates}
      opacity={isInPath() ? 1 : 0.3}  // Set opacity here for the marker itself
      icon={L.icon({
        iconUrl: placeholder,
        iconSize: [20, 20],
        iconAnchor: [7, 15],
      })}
      eventHandlers={{
        click: () => {
          handleMarkerClick(capital.name);
        },
      }}
    >
      <Popup>
        <img src={getImageForCountry(capital.country)} height={40} />
        <h3>{capital.name}</h3>
        <h4>{capital.country ? capital.country : "unknown"}</h4>
        <p>Coordinates: {capital.coordinates[0]}, {capital.coordinates[1]}</p>
      </Popup>
      {showCapitalNames && (
        <Marker
          position={capital.coordinates}
          opacity={isInPath() ? 1 : 0.3}  // Set opacity here for the capital name marker
          icon={L.divIcon({
            className: 'capital-name-icon',
            html: `<div class="capital-name">${capital.name}</div>`,
            iconSize: [80, 30],
            iconAnchor: [40, 15],
          })}
        />
      )}
    </Marker>
  );
})}

           <Polyline
            positions={coordinatesArray} // Array of tuples [latitude, longitude]
            color="red"
            weight={3}
            opacity={0.7}
        />
      </MapContainer>}
      
      
      {mapType === 'image' && (
  <ImageMap
          capitals={capitals}
          scaleLatitude={scaleLatitude}
          scaleLongitude={scaleLongitude}
          handleMarkerClick={handleMarkerClick} showCapitalNames={showCapitalNames}    
          flag={getImageForCountry}
          coordinatesLine={coordinatesArray}
  />
)}


      {/* Control Panel */}
      <div className="control-panel">
        {/* Input Section */}
        <div className="input-section">
        <label>
        Source:
        <CustomDropdown
         close={()=>{setOpenDropdown(null)}}
  
        capitals={capitals}
        selectedValue={source}
        setSelectedValue={setSource}
        getImageForCountry={getImageForCountry}
        label="Source"
        isOpen={openDropdown === "Source"}
        toggleDropdown={() => handleDropdownToggle("Source")
          
        }
  
      /></label>
          <label>
            Target:
            <CustomDropdown
        capitals={capitals}
        selectedValue={target}
        setSelectedValue={setTarget}
        getImageForCountry={getImageForCountry}
        label="Destination"
        isOpen={openDropdown === "Destination"}
        toggleDropdown={() => handleDropdownToggle("Destination")}
        close={closeDropDown}
  
      />
          </label>
          <label>
            Filter:
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as "cost" | "time" | "dist")}
              className="form-input"
            >
              <option value="dist">⏳ Shortest</option>
              <option value="cost">💰 Cheapest</option>
              <option value="time">🕒 Fastest</option>
            </select>
          </label>
        </div>
          {/* Run Button */}
          <button className="run-button" onClick={handleRun}>
          🚀 Run
        </button>
        {/* Reset Button */}
        <button className="reset-button" onClick={resetData}>
          🔄 Reset
        </button>
       
        {/* Output Section */}
        <div className="output-section">
          <label>
            Path:
            <textarea
              value={path}
              readOnly
              className="form-textarea"
              placeholder="🚗 Path will be displayed here"
            />
          </label>
          <label>
            Distance:
            <input
              type="text"
              value={distance}
              readOnly
              className="form-input"
              placeholder="📏 Distance will be displayed here"
            />
          </label>
          <label>
            Cost:
            <input
              type="text"
              value={cost}
              readOnly
              className="form-input"
              placeholder="💵 Cost will be displayed here"
            />
          </label>
          <label>
            Time:
            <input
              type="text"
              value={time}
              readOnly
              className="form-input"
              placeholder="⏰ Time will be displayed here"
            />
          </label>
        </div>
        
        <button onClick={() => setShowCapitalNames(!showCapitalNames)}>
  {showCapitalNames ? '⚙️Hide Capital Names' : '⚙️Show Capital Names'}
</button>

      </div>
    </div>
  );
}

export default App;
