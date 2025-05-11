import useSpeechRecognition from "../Hooks/useSpeechRecognition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useCallback } from "react";
import {
  faMicrophone,
  faMicrophoneSlash,
  faPaperPlane,
  faXmark,
  faCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";

const SpeechRecognition = ({ onAddItem, speechLanguage }) => {
  const [status, setStatus] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const { text, setText, isListening, startListening, stopListening } =
    useSpeechRecognition(speechLanguage);

  // Update status based on listening state and text content
  useEffect(() => {
    if (!isListening && text) {
      setStatus("listened");
    } else if (isListening && !text) {
      setStatus("listening");
    } else if (!isListening && !text) {
      setStatus("not listening");
    }
  }, [isListening, text]);

  // Use useCallback to memoize the handleCommand function
  const handleCommand = useCallback(() => {
    if (!text) return;
    
    const command = text.trim().toLowerCase();
    
    let itemName = "";
    let itemLocation = "";

    // Define all command patterns
    const patterns = [
      { pattern: /add\s+(.+?)\s+to\s+(.+)/i, type: 'addTo' },
      { pattern: /put\s+(.+?)\s+in\s+(.+)/i, type: 'putIn' },
      { pattern: /my\s+(.+?)\s+is\s+in\s+(.+)/i, type: 'isIn' },
      { pattern: /i\s+left\s+(.+?)\s+at\s+(.+)/i, type: 'leftAt' },
      { pattern: /i\s+put\s+(.+?)\s+on\s+(.+)/i, type: 'putOn' }
    ];
    
    // Try to match the command against each pattern
    let matched = false;
    
    for (const { pattern, type } of patterns) {
      const match = command.match(pattern);
      if (match) {
        itemName = match[1].trim();
        itemLocation = match[2].trim();
        matched = true;
        console.log(`Matched pattern: ${type}`);
        break;
      }
    }
    
    // If no pattern matched, try simple parsing
    if (!matched) {
      const words = command.split(" ");
      if (words.length >= 2) {
        itemName = words[0];
        itemLocation = words.slice(1).join(" ");
      } else {
        itemName = command;
        itemLocation = "Unknown location";
      }
    }

    // Clean up the item name (remove common article words)
    itemName = itemName.replace(/^(my|the|a|an)\s+/i, "");
    
    // Capitalize first letter of item name
    itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);

    console.log(`Parsed: Item "${itemName}" at location "${itemLocation}"`);
    
    // Reset state and add the item
    setStatus("not listening");
    setText("");
    onAddItem(itemName, itemLocation);
  }, [text, setText, onAddItem]);

  const cancelListening = useCallback(() => {
    setStatus("not listening");
    setText("");
  }, [setText]);

  return (
    <div className="speech-recognition-container">
      <div className="speech-recognition">
        <input
          className="speech-recognition-input"
          value={text}
          placeholder={
            status === "listening"
              ? "Listening... (Try: 'Add keys to kitchen drawer')"
              : "Click the button and say: 'Add keys to kitchen drawer'"
          }
          onClick={cancelListening}
          readOnly
        />
        <button
          style={{
            backgroundColor:
              status === "listening"
                ? "var(--error-color)"
                : status === "listened"
                ? "var(--green-color)"
                : "var(--accent-color)",
          }}
          className="speech-recognition-button"
          onClick={
            status === "not listening"
              ? startListening
              : status === "listening"
              ? stopListening
              : handleCommand
          }
          aria-label={
            status === "listening" 
              ? "Stop listening" 
              : status === "listened"
              ? "Process command"
              : "Start speech recognition"
          }
        >
          {status === "listening" ? (
            <FontAwesomeIcon icon={faMicrophoneSlash} />
          ) : status === "listened" ? (
            <FontAwesomeIcon icon={faPaperPlane} />
          ) : (
            <FontAwesomeIcon icon={faMicrophone} />
          )}
        </button>
        <button 
          className="help-button"
          onClick={() => setShowHelp(true)}
          aria-label="Show voice command help"
        >
          <FontAwesomeIcon icon={faCircleQuestion} />
        </button>
      </div>
      {showHelp && (
        <div className="help-overlay">
          <div className="help-modal">
            <div className="help-header">
              <h3>Voice Command Help</h3>
              <button 
                className="close-help" 
                onClick={() => setShowHelp(false)}
                aria-label="Close help"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            
            <div className="help-content">
              <div className="help-section">
                <h4>Basic Commands</h4>
                <ul>
                  <li><strong>"Add keys to drawer"</strong> - Basic item addition</li>
                  <li><strong>"Put wallet in bedroom"</strong> - Alternative way to add</li>
                  <li><strong>"My glasses are in the car"</strong> - Descriptive addition</li>
                  <li><strong>"I left my phone at work"</strong> - Location-based addition</li>
                </ul>
              </div>
              
              <div className="help-section">
                <h4>Category Commands</h4>
                <ul>
                  <li><strong>"Add keys to drawer in Work category"</strong></li>
                  <li><strong>"Add laptop to Home category in office"</strong></li>
                  <li><strong>"Add notebook in Personal category at desk"</strong></li>
                  <li><strong>"Put headphones in bag in Work category"</strong></li>
                </ul>
              </div>
              
              <div className="help-section">
                <h4>Available Categories</h4>
                <ul>
                  <li><strong>Personal</strong> - For personal belongings</li>
                  <li><strong>Work</strong> - For work-related items</li>
                  <li><strong>Home</strong> - For household items</li>
                </ul>
              </div>
              
              <div className="help-section">
                <h4>Tips</h4>
                <ul>
                  <li>Speak clearly and at a normal pace</li>
                  <li>Wait for the microphone icon before speaking</li>
                  <li>If a category isn't recognized, "Personal" is used by default</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeechRecognition;