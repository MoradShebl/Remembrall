import { useState, useEffect } from "react";
import Card from "./components/Card.jsx";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faXmark } from "@fortawesome/free-solid-svg-icons";

function Recent() {
  const [items, setItems] = useState([
    { id: 1, name: "Wallet (it's example)", location: "On the bed" },
    { id: 2, name: "Keys (it's example)", location: "In the drawer" },
  ]);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const [addItemScreen, setAddItemScreen] = useState(false);

  const [userPosition, setUserPosition] = useState(null);

  const handleRemove = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleAddItem = (name, location) => {
    if (!name || !location) {
      alert("Please enter a name and location");
      return;
    }
    if (items.some((item) => item.name === name)) {
      alert("Item with this name already exists you can change the location from the list");
      return;
    }
    setItems([
      ...items,
      { id: items.length + 1, name: name, location: location },
    ]);
    setAddItemScreen(false);
    setName("");
    setLocation("");
  };

  const handleLocationChange = (id, newLocation) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, location: newLocation } : item
      )
    );
  };

  const handleLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            const placeName = data.display_name || 'Unknown location';
            setLocation(placeName);
          } catch (error) {
            console.error("Error fetching location name:", error);
            setLocation('Error fetching location');
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

  useEffect(() => {
    const storedItems = localStorage.getItem('items');
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items));
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
      <div className="item-container">
        <h2>Your Items:</h2>
        {items.map((item) => (
          <Card
            key={item.id}
            name={item.name}
            location={item.location}
            onRemove={() => handleRemove(item.id)}
            onLocationChange={(newLocation) =>
              handleLocationChange(item.id, newLocation)
            }
          />
        ))}
        <div className="add">
          <button className="add-button" onClick={() => setAddItemScreen(true)}>
            Add new
          </button>
        </div>
      </div>
      {addItemScreen && (
        <div className="bg">
          <div className="add-item-screen">
            <div className="header">
              <h2>Add new item</h2>
              <button className="close" onClick={() => setAddItemScreen(false)}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <input
              type="text"
              placeholder="Item name"
              onChange={(e) => setName(e.target.value)}
            />
            <div className="location-wrapper">
              <input
                type="text"
                placeholder="Item location"
                onChange={(e) => setLocation(e.target.value)}
                value={location}
              />
              <button className="location" onClick={handleLocation}>
                <FontAwesomeIcon icon={faLocationDot} />
              </button>
            </div>
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
            <button
              className="add-button add-item-screen-button"
              onClick={() => handleAddItem(name, location)}
            >
              Add item
            </button>
          </div>
        </div>
      )}
    </>
  );
}
export default Recent;
