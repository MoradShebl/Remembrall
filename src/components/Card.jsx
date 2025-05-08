import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faTrash } from "@fortawesome/free-solid-svg-icons";

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

  return (
    <>
      <div
        className={`item ${expanded ? "expanded" : "collapsed"} ${
          isDeleting ? "deleting" : ""
        }`}
        onAnimationEnd={isDeleting ? () => onRemove() : undefined}
      >
        <div className="dropdown">
          <button
            className={`dropdown-button ${rotated ? "rotated" : ""}`}
            onClick={() => {
              setExpanded(!expanded);
              setRotated(!rotated);
            }}
          >
            <FontAwesomeIcon icon={faCaretDown} />
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
            <div className="time-informations-wrapper">
              <input
                className="location-input"
                value={time}
                onChange={(e) => onTimeChange(e.target.value)}
              />
              <p>{location}</p>
            </div>
          ) : (
            <>
              <input
                className="location-input"
                value={location}
                onChange={(e) => onLocationChange(e.target.value)}
              />
            </>
          )}
          <button className="remove" onClick={() => setIsDeleting(true)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
        <select
          value={catagory}
          onChange={(e) => onCatagoryChange(e.target.value)}
          className="catagory-select"
        >
          {catagories.map((cata) => (
            <>
              <option>{cata.name}</option>
            </>
          ))}
        </select>
      </div>
    </>
  );
};
export default Card;
