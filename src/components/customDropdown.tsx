import React from "react";
import './customDropdown.css';

type Capital = {
  name: string;
  coordinates: [number, number];
  country?: string;
};

interface CustomDropdownProps {
  capitals: Capital[];
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  getImageForCountry: (country: string | undefined) => string | undefined;
  label: string;
  isOpen: boolean;
  toggleDropdown: () => void;
  close: () => void
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  capitals,
  selectedValue,
  setSelectedValue,
  getImageForCountry,
  label,
  isOpen,
  toggleDropdown,close
}) => {
  const handleSelect = (value: string) => {
    setSelectedValue(value);
    
    close();
  };

   // Sort the capitals alphabetically by name
   const sortedCapitals = [...capitals].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="dropdown-container">
      <button
        onClick={toggleDropdown}
        className="dropdown-button"
      >
        {selectedValue || `🌍 Select ${label}`} <span className="dropdown-arrow">▼</span>
      </button>

      {isOpen && (
        <ul className="dropdown-list">
          {sortedCapitals.map((capital) => (
            <li
              key={capital.name}
              onClick={() => handleSelect(capital.name)}
              className="dropdown-item"
            >
              <img
                src={getImageForCountry(capital.country)}
                alt={capital.name}
                className="dropdown-image"
              />
              {capital.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
