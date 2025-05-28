import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faTrash, faCheck, faCheckCircle, faCalendarAlt, faFlag } from "@fortawesome/free-solid-svg-icons";

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
  onMarkComplete,
  isCompleted,
  isTodo,
  dueDate,
  priority,
  details,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [rotated, setRotated] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [emoji, setEmoji] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  // Format date to display in a readable format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Check if a due date is overdue
  const isOverdue = (dateString) => {
    if (!dateString) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day
    const dueDate = new Date(dateString);
    return dueDate < today;
  };

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
        } ${isNameRTL ? "rtl" : "ltr"} ${isCompleted ? "completed" : ""} ${isTodo ? "todo-item" : ""}`}
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
              setShowDetails(!showDetails);
            }}
          >
            <FontAwesomeIcon aria-hidden="true" icon={faCaretDown} />
          </button>
          <div className="item-info-header">
            <p className={isCompleted ? "completed-text" : ""}>{name}</p>
            <div className="catagory-emoji-wrapper">
              <span>{emoji}</span>
            </div>
          </div>
        </div>
        {isTodo && !showDetails && (
          <div className="todo-actions">
            <div className="todo-info">
              <button 
                className={`complete-button ${isCompleted ? "completed" : ""}`}
                onClick={() => onMarkComplete()}
                aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
              >
                <FontAwesomeIcon icon={isCompleted ? faCheckCircle : faCheck} />
                <span>{isCompleted ? "Completed" : "Mark Complete"}</span>
              </button>
              {dueDate && (
                <div className={`todo-due-date ${isOverdue(dueDate) ? 'overdue' : ''}`}>
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  <span>{formatDate(dueDate)}</span>
                </div>
              )}
            </div>
            <button aria-label="Remove item" className="remove" onClick={() => setIsDeleting(true)}>
              <FontAwesomeIcon aria-hidden="true" icon={faTrash} />
            </button>
          </div>
        )}
        {(!isTodo || showDetails) && <div className="item-info">
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
        </div>}
        
        {isTodo && showDetails && (
          <div className="todo-details">
            {dueDate && (
              <div className={`todo-due-date ${isOverdue(dueDate) ? 'overdue' : ''}`}>
                <FontAwesomeIcon icon={faCalendarAlt} />
                <span>Due: {formatDate(dueDate)}</span>
              </div>
            )}
            {priority && (
              <div className={`todo-priority priority-${priority}`}>
                <FontAwesomeIcon icon={faFlag} />
                <span>Priority: {priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
              </div>
            )}
            {details && (
              <div className="todo-details-text">
                <h4>Details:</h4>
                <p>{details}</p>
              </div>
            )}
          </div>
        )}
        {(!isTodo || showDetails) && (
          <select
            value={catagory}
            onChange={(e) => onCatagoryChange(e.target.value)}
            className="catagory-select"
            aria-label="Select catagory"
          >
            {catagories.map((cata) => (
              <option key={cata.name}>{cata.name}</option>
            ))}
          </select>
        )}
      </div>
    </>
  );
};
export default Card;
