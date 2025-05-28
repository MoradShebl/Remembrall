import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faTrash } from "@fortawesome/free-solid-svg-icons";

// Function to detect if text contains Arabic characters
const containsArabic = (text) => {
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(text);
};

const Card = ({
  name,
  location,
  time,
  catagory,
  catagories,
  onRemove,
  onLocationChange,
  onTimeChange,
  onCatagoryChange,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [rotated, setRotated] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [emoji, setEmoji] = useState(false);

  useEffect(() => {
    const matched = catagories.find((c) => c.name === catagory);
    setEmoji(matched ? matched.emoji : "");
  }, [catagories, catagory]);
  
  // Check if name contains Arabic text
  const isNameRTL = containsArabic(name);
  const isLocationRTL = containsArabic(location);

  return (
    <>
      <div
        className={`item ${expanded ? "expanded" : "collapsed"} ${
          isDeleting ? "deleting" : ""
        } ${isNameRTL ? "rtl" : "ltr"}`}
        onAnimationEnd={isDeleting ? () => onRemove() : undefined}
        style={{ touchAction: "manipulation" }}
      >
        <div className="dropdown">
          <button
            className={`dropdown-button ${rotated ? "rotated" : ""}`}
            aria-label="Open options menu"
            onClick={() => {
              setExpanded(!expanded);
              setRotated(!rotated);
            }}
          >
            <FontAwesomeIcon aria-hidden="true" icon={faCaretDown} />
          </button>
          <div className="item-info-header">
            <p>{name}</p>
            <div className="catagory-emoji-wrapper">
              <span>{emoji}</span>
            </div>
          </div>
        </div>
        <div className="item-info">
          {time ? (
            <div className={`time-informations-wrapper ${isLocationRTL ? "location-rtl" : "location-ltr"}`}>
              <input
                className="location-input"
                value={time}
                onChange={(e) => onTimeChange(e.target.value)}
              />
              <p>{location}</p>
            </div>
          ) : (
            <div className={isLocationRTL ? "location-rtl" : "location-ltr"}>
              <input
                className="location-input"
                value={location}
                onChange={(e) => onLocationChange(e.target.value)}
              />
            </div>
          )}
          <button aria-label="Remove item" className="remove" onClick={() => setIsDeleting(true)}>
            <FontAwesomeIcon aria-hidden="true" icon={faTrash} />
          </button>
        </div>
        <select
          value={catagory}
          onChange={(e) => onCatagoryChange(e.target.value)}
          className="catagory-select"
          aria-label="Select catagory"
        >
          {catagories.map((cata) => (
            <>
              <option key={cata.name}>{cata.name}</option>
            </>
          ))}
        </select>
      </div>
    </>
  );
};
export default Card;
