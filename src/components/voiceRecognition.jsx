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

const SpeechRecognition = ({ onAddItem, speechLanguage, categories }) => {
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
    let itemCategory = "Personal"; // Default category

    // Define patterns for category commands
    const categoryPatterns = [
      // "Add keys to drawer in Work category"
      { pattern: /add\s+(.+?)\s+to\s+(.+?)\s+in\s+(.+?)\s+category/i, type: 'addToInCategory' },
      // "Add laptop to Home category in office"
      { pattern: /add\s+(.+?)\s+to\s+(.+?)\s+category\s+in\s+(.+)/i, type: 'addToCategoryIn' },
      // "Add notebook in Personal category at desk"
      { pattern: /add\s+(.+?)\s+in\s+(.+?)\s+category\s+at\s+(.+)/i, type: 'addInCategoryAt' },
      // "Put headphones in bag in Work category"
      { pattern: /put\s+(.+?)\s+in\s+(.+?)\s+in\s+(.+?)\s+category/i, type: 'putInInCategory' },
      // "My keys are in drawer in Work category"
      { pattern: /my\s+(.+?)\s+(?:is|are)\s+in\s+(.+?)\s+in\s+(.+?)\s+category/i, type: 'isInInCategory' },
      // "I left my phone at work in Personal category"
      { pattern: /i\s+left\s+(?:my\s+)?(.+?)\s+at\s+(.+?)\s+in\s+(.+?)\s+category/i, type: 'leftAtInCategory' },
    ];
    
    // Define basic command patterns (without category)
    const basicPatterns = [
      { pattern: /add\s+(.+?)\s+to\s+(.+)/i, type: 'addTo' },
      { pattern: /put\s+(.+?)\s+in\s+(.+)/i, type: 'putIn' },
      { pattern: /my\s+(.+?)\s+(?:is|are)\s+in\s+(.+)/i, type: 'isIn' },
      { pattern: /i\s+left\s+(?:my\s+)?(.+?)\s+at\s+(.+)/i, type: 'leftAt' },
      { pattern: /i\s+put\s+(.+?)\s+on\s+(.+)/i, type: 'putOn' }
    ];
    
    // First try to match category patterns
    let matched = false;
    
    for (const { pattern, type } of categoryPatterns) {
      const match = command.match(pattern);
      if (match) {
        if (type === 'addToCategoryIn') {
          itemName = match[1].trim();
          itemCategory = match[2].trim();
          itemLocation = match[3].trim();
        } else if (type === 'addInCategoryAt') {
          itemName = match[1].trim();
          itemCategory = match[2].trim();
          itemLocation = match[3].trim();
        } else {
          itemName = match[1].trim();
          itemLocation = match[2].trim();
          itemCategory = match[3].trim();
        }
        matched = true;
        console.log(`Matched category pattern: ${type}`);
        break;
      }
    }
    
    // If no category pattern matched, try basic patterns
    if (!matched) {
      for (const { pattern, type } of basicPatterns) {
        const match = command.match(pattern);
        if (match) {
          itemName = match[1].trim();
          itemLocation = match[2].trim();
          matched = true;
          console.log(`Matched basic pattern: ${type}`);
          break;
        }
      }
    }
    
    // If still no match, try simple parsing
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
    
    // Capitalize first letter of item name and category
    itemName = itemName.charAt(0).toUpperCase() + itemName.slice(1);
    itemCategory = itemCategory.charAt(0).toUpperCase() + itemCategory.slice(1);
    
    // Validate category exists using provided categories or defaults
    const validCategoryNames = categories ? categories.map(cat => cat.name) : ['Personal', 'Work', 'Home'];
    if (!validCategoryNames.includes(itemCategory)) {
      itemCategory = 'Personal'; // Default to Personal if invalid
    }

    console.log(`Parsed: Item "${itemName}" at location "${itemLocation}" in category "${itemCategory}"`);
    
    // Reset state and add the item with category
    setStatus("not listening");
    setText("");
    onAddItem(itemName, itemLocation, itemCategory);
  }, [text, setText, onAddItem, categories]);

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
              ? "Listening... (Try: 'Add keys to drawer in Work category')"
              : "Tap mic and say: 'Add keys to drawer in Work category'"
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