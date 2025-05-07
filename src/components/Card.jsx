import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faTrash } from "@fortawesome/free-solid-svg-icons";

const Card = ({
  name,
  location,
  time,
  onRemove,
  onLocationChange,
  onTimeChange,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [rotated, setRotated] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
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
          <p>{name}</p>
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
            <input
              className="location-input"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
            />
          )}
          <button className="remove" onClick={() => setIsDeleting(true)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </div>
    </>
  );
};
export default Card;
