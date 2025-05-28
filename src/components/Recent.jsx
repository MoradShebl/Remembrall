import { useState, useEffect } from "react";
import Card from "./Card.jsx";
import SpeechRecognition from "./voiceRecognition.jsx";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faXmark,
  faBriefcase,
  faHome,
  faUser,
  faBook,
  faLaptop,
  faPhone,
  faCar,
  faKey,
  faWallet,
  faGlasses,
} from "@fortawesome/free-solid-svg-icons";

function Recent({ darkMode, speechLanguage, categories }) {
  const [items, setItems] = useState([]);

  // Get the appropriate FontAwesome icon based on the icon name
  const getIconFromName = (iconName) => {
    switch (iconName) {
      case "faUser":
        return faUser;
      case "faBriefcase":
        return faBriefcase;
      case "faHome":
        return faHome;
      case "faBook":
        return faBook;
      case "faLaptop":
        return faLaptop;
      case "faPhone":
        return faPhone;
      case "faCar":
        return faCar;
      case "faKey":
        return faKey;
      case "faWallet":
        return faWallet;
      case "faGlasses":
        return faGlasses;
      default:
        return faUser; // Default fallback
    }
  };

  // Convert categories from props to the format expected by the Card component
  const catagories = categories
    ? categories.map((cat) => ({
        name: cat.name,
        emoji: (
          <FontAwesomeIcon
            className="catagory-icon"
            icon={getIconFromName(cat.icon)}
          />
        ),
      }))
    : [
        {
          name: "Personal",
          emoji: <FontAwesomeIcon className="catagory-icon" icon={faUser} />,
        },
        {
          name: "Work",
          emoji: (
            <FontAwesomeIcon className="catagory-icon" icon={faBriefcase} />
          ),
        },
        {
          name: "Home",
          emoji: <FontAwesomeIcon className="catagory-icon" icon={faHome} />,
        },
      ];

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [time, setTime] = useState("");
  const [addTime, setAddTime] = useState(false);
  const [catagory, setCatagory] = useState("Personal");
  const [searchtype, setSearchType] = useState("name");

  const [addItemScreen, setAddItemScreen] = useState(false);

  const [userPosition, setUserPosition] = useState(null);

  const [currentFilter, setCurrentFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("items"); // 'items' or 'times'

  const handleRemove = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleAddItem = (name, location, category = catagory) => {
    if (!name) {
      alert("Please enter a name");
      return;
    }
    if (!location) {
      alert("Please enter a location");
      return;
    }

    // Validate that the category exists in our categories list
    const validCategory = categories
      ? categories.find(
          (cat) => cat.name.toLowerCase() === category.toLowerCase()
        )?.name
      : catagories.find(
          (cat) => cat.name.toLowerCase() === category.toLowerCase()
        )?.name;

    setItems([
      ...items,
      {
        id: items.length + 1,
        name: name,
        location: location,
        catagory: validCategory || catagory, // Use validated category or default
      },
    ]);
    setAddItemScreen(false);
    setName("");
    setLocation("");
  };

  const handleAddTime = (name, location, time) => {
    if (!name) {
      alert("Please enter a name");
      return;
    }
    if (!time) {
      alert("Please enter a time");
      return;
    }
    setItems([
      ...items,
      {
        id: items.length + 1,
        name: name,
        location: location ? location : "Online",
        catagory: catagory,
        time: time,
      },
    ]);
    setAddItemScreen(false);
    setName("");
    setLocation("");
    setTime("");
  };

  const handleLocationChange = (id, newLocation) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, location: newLocation } : item
      )
    );
  };

  const handleTimeChange = (id, newTime) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, time: newTime } : item))
    );
  };

  const removeAddingList = () => {
    setAddItemScreen(false);
    setAddTime(false);
    console.log(addTime);
  };

  const handleAddTimeScreen = () => {
    setAddItemScreen(true);
    setAddTime(true);
  };

  const handleLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const placeName = data.display_name || "Unknown location";
            setLocation(placeName);
          } catch (error) {
            console.error("Error fetching location name:", error);
            setLocation("Error fetching location");
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation not supported");
    }
  };

  const handleCatagoryChange = (id, newCatagory) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, catagory: newCatagory } : item
      )
    );
  };

  const handleCatagoryFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  const getFilteredItems = () => {
    // First filter by active section (items or times)
    let filtered = items.filter((item) => {
      if (activeSection === "items") {
        return !item.time; // Show only items without time property
      } else {
        return item.time; // Show only items with time property
      }
    });

    // Then filter by category if not 'All'
    if (currentFilter !== "All") {
      filtered = filtered.filter((item) => item.catagory === currentFilter);
    }

    // Finally filter by search term if present
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((item) => {
        const propertyToSearch = searchtype.toLowerCase();
        if (propertyToSearch === "name" && item.name) {
          return item.name.toLowerCase().includes(searchTerm.toLowerCase());
        } else if (propertyToSearch === "location" && item.location) {
          return item.location.toLowerCase().includes(searchTerm.toLowerCase());
        }
        return false;
      });
    }

    return filtered;
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const storedItems = localStorage.getItem("items");
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPosition([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation not supported");
    }
  }, []);

  return (
    <>
      <div className="item-container" data-theme={darkMode ? "dark" : "light"}>
        <div className="up">
          <h2>Your Folks:</h2>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search..."
              className="catagory-select search-input"
              onChange={(e) => handleSearchChange(e)}
              value={searchTerm}
            />
            <select
              className="select-what-search-for"
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="location">Location</option>
            </select>
          </div>
          <select
            onChange={(e) => handleCatagoryFilterChange(e.target.value)}
            className="catagories-filter-select catagory-select"
          >
            <option value="All">All Categories</option>
            {catagories.map((cata) => (
              <option key={cata.name} value={cata.name}>
                {cata.name}
              </option>
            ))}
          </select>
          {getFilteredItems().length === 0 ? (
            <div className="empty">
              <p>No Folks here!</p>
            </div>
          ) : (
            getFilteredItems().map((item) => (
              <Card
                key={item.id}
                name={item.name}
                location={item.location}
                time={item.time}
                catagory={item.catagory}
                catagories={catagories}
                onRemove={() => handleRemove(item.id)}
                onLocationChange={(newLocation) =>
                  handleLocationChange(item.id, newLocation)
                }
                onTimeChange={(newTime) => handleTimeChange(item.id, newTime)}
                onCatagoryChange={(newCatagory) =>
                  handleCatagoryChange(item.id, newCatagory)
                }
              />
            ))
          )}
        </div>
        <div className="buttom">
          <div className="add">
            {activeSection === "items" ? (
              <button
                className="add-button"
                onClick={() => setAddItemScreen(true)}
              >
                <span>Add item</span>
              </button>
            ) : (
              <button
                className="add-button"
                onClick={() => handleAddTimeScreen()}
              >
                <p>Add time</p>
              </button>
            )}
          </div>
          <div className="speech-recognition-container">
            <SpeechRecognition
              aria-label="Start speech recognition"
              onAddItem={handleAddItem}
              speechLanguage={speechLanguage}
              categories={
                categories ||
                catagories.map((cat) => ({
                  name: cat.name,
                  icon:
                    cat.name === "Personal"
                      ? "faUser"
                      : cat.name === "Work"
                      ? "faBriefcase"
                      : "faHome",
                }))
              }
            />
          </div>
          <div className="sections-choose">
            <div
              className={`section-btn ${
                activeSection === "items" ? "active" : ""
              }`}
              onClick={() => setActiveSection("items")}
            >
              Items
            </div>
            <div
              className={`section-btn ${
                activeSection === "times" ? "active" : ""
              }`}
              onClick={() => setActiveSection("times")}
            >
              Times
            </div>
          </div>
        </div>
      </div>
      {addItemScreen && (
        <div className="bg">
          <div className="add-item-screen">
            <div className="header">
              <h2>Add new {addTime ? "time" : "item"}</h2>
              <button className="close" onClick={() => removeAddingList()}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <input
              type="text"
              placeholder={addTime ? "Time name" : "Item name"}
              onChange={(e) => setName(e.target.value)}
            />
            {addTime && (
              <input
                type="time"
                placeholder="Time"
                onChange={(e) => setTime(e.target.value)}
              />
            )}
            <div className="location-wrapper">
              <input
                type="text"
                placeholder={
                  addTime
                    ? "Time location (Online by default)"
                    : "Item location"
                }
                onChange={(e) => setLocation(e.target.value)}
                value={location}
              />
              <button className="location" onClick={handleLocation}>
                <FontAwesomeIcon icon={faLocationDot} />
              </button>
            </div>
            <select
              className="catagory-select add-item-select"
              onChange={(e) => setCatagory(e.target.value)}
            >
              {catagories.map((cata) => (
                <>
                  <option>{cata.name}</option>
                </>
              ))}
            </select>
            {userPosition ? (
              <MapContainer
                center={userPosition}
                zoom={13}
                style={{ height: "400px", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              </MapContainer>
            ) : (
              <p>Loading map...</p>
            )}
            <div className="add-item-buttons">
              <button
                className="add-button add-item-screen-button"
                onClick={() =>
                  addTime
                    ? handleAddTime(name, location, time)
                    : handleAddItem(name, location)
                }
              >
                Add {addTime ? "time" : "item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Recent;
