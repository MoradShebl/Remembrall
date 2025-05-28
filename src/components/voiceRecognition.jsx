import useSpeechRecognition from "../Hooks/useSpeechRecognition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useCallback } from "react";
import {
  faMicrophone,
  faMicrophoneSlash,
  faPaperPlane,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const SpeechRecognition = ({ onAddItem, onAddTime, speechLanguage, categories, activeSection }) => {
  const [status, setStatus] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const { text, setText, isListening, startListening, stopListening } =
    useSpeechRecognition(speechLanguage);

  // Update status based on listening state and text content
  useEffect(() => {
    if (!isListening && text && text !== 'help') {
      setStatus("listened");
    } else if (isListening && !text) {
      setStatus("listening");
    } else if (!isListening && !text) {
      setStatus("not listening");
    }
  }, [isListening, text]);

  useEffect(() => {
    text === "help" ? setShowHelp(true) : null
  }, [text]);

  // Use useCallback to memoize the handleCommand function
  const handleCommand = useCallback(() => {
    if (!text) return;
    
    const command = text.trim().toLowerCase();
    
    let itemName = "";
    let itemLocation = "";
    let itemCategory = "Personal"; // Default category
    let itemTime = "";
    let isTimeCommand = false;
    let isTodoCommand = false;
    let todoPriority = "medium";
    let todoDueDate = "";
    let todoDetails = "";

    // Log the received command for debugging
    console.log("Processing voice command:", command, "Active section:", activeSection);
    
    // Define patterns for to-do commands
    const todoPatterns = [
      // "Add to-do buy groceries with high priority due tomorrow"
      { pattern: /add\s+(?:a\s+)?to-?do\s+(.+?)(?:\s+with\s+(high|medium|low)\s+priority)?(?:\s+due\s+(.+?))?(?:\s+details\s+(.+))?$/i, type: 'addTodo' },
      // "Create to-do finish report due Friday with medium priority"
      { pattern: /create\s+(?:a\s+)?to-?do\s+(.+?)(?:\s+due\s+(.+?))?(?:\s+with\s+(high|medium|low)\s+priority)?(?:\s+details\s+(.+))?$/i, type: 'createTodo' },
      // "To-do call mom tomorrow with high priority"
      { pattern: /to-?do\s+(.+?)(?:\s+(?:due\s+|by\s+|on\s+)(.+?))?(?:\s+with\s+(high|medium|low)\s+priority)?(?:\s+details\s+(.+))?$/i, type: 'simpleTodo' },
      // "Remind me to call mom with high priority"
      { pattern: /remind\s+me\s+to\s+(.+?)(?:\s+(?:due\s+|by\s+|on\s+)(.+?))?(?:\s+with\s+(high|medium|low)\s+priority)?(?:\s+details\s+(.+))?$/i, type: 'remindTodo' },
      // Simple todo command
      { pattern: /make\s+(?:a\s+)?to-?do\s+(.+)/i, type: 'simpleTodo2' },
      // Even simpler todo command
      { pattern: /add\s+task\s+(.+)/i, type: 'simpleTask' },
      // Exact pattern for "add to do buy milk"
      { pattern: /^add\s+to\s+do\s+(.+)$/i, type: 'exactTodo' },
    ];
    
    // Define patterns for time commands
    const timePatterns = [
      // "Remind me about meeting at 3:00 PM"
      { pattern: /remind\s+(?:me\s+)?(?:about\s+)?(.+?)\s+at\s+(.+?)(?:\s+(?:in|at)\s+(.+))?/i, type: 'remindAt' },
      // "Set a reminder for dentist appointment at 2:30 PM"
      { pattern: /set\s+a\s+reminder\s+for\s+(.+?)\s+at\s+(.+?)(?:\s+(?:in|at)\s+(.+))?/i, type: 'reminderAt' },
      // "Add time for meeting at 4:00 PM"
      { pattern: /add\s+time\s+for\s+(.+?)\s+at\s+(.+?)(?:\s+(?:in|at)\s+(.+))?/i, type: 'timeFor' },
      // "Meeting at 3:00 PM"
      { pattern: /(.+?)\s+at\s+([0-9]{1,2}:[0-9]{2}(?:\s*[ap]m)?)(?:\s+(?:in|at)\s+(.+))?/i, type: 'eventAt' },
    ];
    
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
    
    // Helper function to parse dates from text
    const parseDueDate = (dateText) => {
      if (!dateText) return "";
      
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      // Format a date as YYYY-MM-DD for input[type="date"]
      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };
      
      const lowerDateText = dateText.toLowerCase();
      
      if (lowerDateText === "today") {
        return formatDate(today);
      } else if (lowerDateText === "tomorrow") {
        return formatDate(tomorrow);
      } else if (lowerDateText.includes("next")) {
        // Handle "next Monday", "next week", etc.
        const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const dayIndex = weekdays.findIndex(day => lowerDateText.includes(day));
        
        if (dayIndex !== -1) {
          const targetDate = new Date(today);
          const currentDay = today.getDay();
          const daysToAdd = (dayIndex + 7 - currentDay) % 7 || 7; // If today, go to next week
          targetDate.setDate(today.getDate() + daysToAdd);
          return formatDate(targetDate);
        } else if (lowerDateText.includes("week")) {
          const nextWeek = new Date(today);
          nextWeek.setDate(today.getDate() + 7);
          return formatDate(nextWeek);
        }
      } else {
        // Try to handle day names like "Monday", "Tuesday", etc.
        const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const dayIndex = weekdays.findIndex(day => lowerDateText.includes(day));
        
        if (dayIndex !== -1) {
          const targetDate = new Date(today);
          const currentDay = today.getDay();
          let daysToAdd = (dayIndex - currentDay) % 7;
          if (daysToAdd <= 0) daysToAdd += 7; // If today or earlier, go to next week
          targetDate.setDate(today.getDate() + daysToAdd);
          return formatDate(targetDate);
        }
      }
      
      // Default to tomorrow if we couldn't parse the date
      return formatDate(tomorrow);
    };
    
    // Determine which patterns to try first based on activeSection
    let matched = false;
    
    // Prioritize patterns based on activeSection
    if (activeSection === 'todos') {
      // First try to match to-do patterns
      for (const { pattern, type } of todoPatterns) {
        const match = command.match(pattern);
        if (match) {
          console.log(`Match found for todo pattern type: ${type}`, match);
          
          if (type === 'addTodo' || type === 'simpleTodo') {
            itemName = match[1].trim();
            todoPriority = match[2] ? match[2].trim().toLowerCase() : "medium";
            todoDueDate = match[3] ? parseDueDate(match[3].trim()) : "";
            todoDetails = match[4] ? match[4].trim() : "";
          } else if (type === 'createTodo') {
            itemName = match[1].trim();
            todoDueDate = match[2] ? parseDueDate(match[2].trim()) : "";
            todoPriority = match[3] ? match[3].trim().toLowerCase() : "medium";
            todoDetails = match[4] ? match[4].trim() : "";
          } else if (type === 'remindTodo') {
            itemName = match[1].trim();
            todoDueDate = match[2] ? parseDueDate(match[2].trim()) : "";
            todoPriority = match[3] ? match[3].trim().toLowerCase() : "medium";
            todoDetails = match[4] ? match[4].trim() : "";
          } else if (type === 'simpleTodo2' || type === 'simpleTask' || type === 'exactTodo') {
            // Handle simpler todo patterns
            itemName = match[1].trim();
            todoPriority = "medium";
            todoDueDate = "";
            todoDetails = "";
          }
          
          // Set default location for todo items
          itemLocation = "To-do";
          matched = true;
          isTodoCommand = true;
          break;
        }
      }
    } else if (activeSection === 'times') {
      // First try to match time patterns
      for (const { pattern, type } of timePatterns) {
        const match = command.match(pattern);
        if (match) {
          console.log(`Match found for time pattern type: ${type}`, match);
          
          itemName = match[1].trim();
          itemTime = match[2].trim();
          itemLocation = match[3] ? match[3].trim() : "Online";
          
          matched = true;
          isTimeCommand = true;
          console.log(`Matched time pattern: ${type}`);
          console.log(`Extracted: name="${itemName}", time="${itemTime}", location="${itemLocation}"`);
          break;
        }
      }
    }
    
    // If no match found yet based on activeSection priority, try other patterns
    if (!matched) {
      // If we're not in todos section or no todo match was found, try time patterns
      if (activeSection !== 'times') {
        for (const { pattern, type } of timePatterns) {
          const match = command.match(pattern);
          if (match) {
            console.log(`Match found for time pattern type: ${type}`, match);
            
            itemName = match[1].trim();
            itemTime = match[2].trim();
            itemLocation = match[3] ? match[3].trim() : "Online";
            
            matched = true;
            isTimeCommand = true;
            console.log(`Matched time pattern: ${type}`);
            console.log(`Extracted: name="${itemName}", time="${itemTime}", location="${itemLocation}"`);
            break;
          }
        }
      }
      
      // If we're not in todos section or no match was found yet, try todo patterns
      if (!matched && activeSection !== 'todos') {
        for (const { pattern, type } of todoPatterns) {
          const match = command.match(pattern);
          if (match) {
            console.log(`Match found for todo pattern type: ${type}`, match);
            
            if (type === 'addTodo' || type === 'simpleTodo') {
              itemName = match[1].trim();
              todoPriority = match[2] ? match[2].trim().toLowerCase() : "medium";
              todoDueDate = match[3] ? parseDueDate(match[3].trim()) : "";
              todoDetails = match[4] ? match[4].trim() : "";
            } else if (type === 'createTodo') {
              itemName = match[1].trim();
              todoDueDate = match[2] ? parseDueDate(match[2].trim()) : "";
              todoPriority = match[3] ? match[3].trim().toLowerCase() : "medium";
              todoDetails = match[4] ? match[4].trim() : "";
            } else if (type === 'remindTodo') {
              itemName = match[1].trim();
              todoDueDate = match[2] ? parseDueDate(match[2].trim()) : "";
              todoPriority = match[3] ? match[3].trim().toLowerCase() : "medium";
              todoDetails = match[4] ? match[4].trim() : "";
            } else if (type === 'simpleTodo2' || type === 'simpleTask' || type === 'exactTodo') {
              // Handle simpler todo patterns
              itemName = match[1].trim();
              todoPriority = "medium";
              todoDueDate = "";
              todoDetails = "";
            }
            
            // Set default location for todo items
            itemLocation = "To-do";
            matched = true;
            isTodoCommand = true;
            break;
          }
        }
      }
      
      // If no match yet, try category patterns
      if (!matched) {
        for (const { pattern, type } of categoryPatterns) {
          const match = command.match(pattern);
          if (match) {
            console.log(`Match found for pattern type: ${type}`, match);
            
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
            console.log(`Extracted: name="${itemName}", location="${itemLocation}", category="${itemCategory}"`);
            break;
          }
        }
      }
      
      // If still no match, try basic patterns
      if (!matched) {
        for (const { pattern, type } of basicPatterns) {
          const match = command.match(pattern);
          if (match) {
            itemName = match[1].trim();
            itemLocation = match[2].trim();
            matched = true;
            console.log(`Matched basic pattern: ${type}`);
            console.log(`Extracted: name="${itemName}", location="${itemLocation}"`);
            break;
          }
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
    
    // If we matched a pattern, add the item or time
    if (matched) {
      // Validate category if provided
      if (itemCategory) {
        const validCategory = categories.find(
          (cat) => cat.name.toLowerCase() === itemCategory.toLowerCase()
        );
        
        if (!validCategory) {
          console.log(`Category '${itemCategory}' not found, using 'Personal'`);
          itemCategory = "Personal";
        } else {
          itemCategory = validCategory.name; // Use the proper casing from the categories array
        }
      }
      
      if (isTimeCommand && onAddTime) {
        // Format time if needed
        if (itemTime.match(/^\d{1,2}(?::\d{2})?$/)) {
          // If time is just numbers like "3" or "3:30", assume it's a 24-hour format
          // If it's just a number like "3", add ":00"
          if (!itemTime.includes(':')) {
            itemTime = `${itemTime}:00`;
          }
        }
      }
    }
    
    // Execute the command
    if (matched) {
      if (isTodoCommand) {
        console.log("Executing todo command with:", { itemName, itemLocation, itemCategory, todoPriority, todoDueDate, todoDetails });
        
        // Create a to-do object with the parsed information
        const todoItem = {
          name: itemName,
          location: itemLocation,
          catagory: itemCategory, // Note: using catagory with 'a' to match Recent.jsx
          priority: todoPriority,
          dueDate: todoDueDate,
          details: todoDetails,
          isTodo: true
        };
        
        // Add the to-do item
        onAddItem(itemName, itemLocation, itemCategory, todoItem);
      } else if (isTimeCommand) {
        console.log("Executing time command with:", { itemName, itemLocation, itemTime });
        onAddTime(itemName, itemLocation, itemTime);
      } else {
        console.log("Executing item command with:", { itemName, itemLocation, itemCategory });
        onAddItem(itemName, itemLocation, itemCategory);
      }
      
      // Clear the text after processing
      setText("");
      setStatus("not listening");
    } else {
      console.log("No pattern matched for command:", command);
      alert("Sorry, I didn't understand that command. Try again or check the help for examples.");
    }
  }, [text, setText, onAddItem, onAddTime, categories, activeSection]);
  
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
              : "Say help If you stuck"
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
                <h4>Time Commands</h4>
                <ul>
                  <li><strong>"Remind me about meeting at 3:00 PM"</strong> - Set a time reminder</li>
                  <li><strong>"Set a reminder for dentist at 2:30 PM"</strong> - Create a timed event</li>
                  <li><strong>"Add time for meeting at 4:00 PM"</strong> - Add a time-based item</li>
                  <li><strong>"Meeting at 3:00 PM in office"</strong> - Quick time addition with location</li>
                </ul>
              </div>
              
              <div className="help-section">
                <h4>To-Do Commands</h4>
                <ul>
                  <li><strong>"Add to-do buy groceries"</strong> - Simple to-do creation</li>
                  <li><strong>"Create to-do finish report due Friday"</strong> - To-do with due date</li>
                  <li><strong>"To-do call mom with high priority"</strong> - To-do with priority</li>
                  <li><strong>"Remind me to pay bills due tomorrow with high priority"</strong> - Complete to-do</li>
                  <li><strong>"Add to-do meeting notes details discuss project timeline"</strong> - With details</li>
                </ul>
              </div>
              
              <div className="help-section">
                <h4>Category Commands (Beta)</h4>
                <ul>
                  <li><strong>"Add keys to drawer in Work category"</strong></li>
                  <li><strong>"Add laptop in office to Home category"</strong></li>
                  <li><strong>"Add notebook at desk in Personal category"</strong></li>
                  <li><strong>"Put headphones in bag in Work category"</strong></li>
                </ul>
              </div>
              
              <div className="help-section">
                <h4>Available Categories</h4>
                <ul>
                  <li><strong>Personal</strong> - For personal belongings</li>
                  <li><strong>Work</strong> - For work-related items</li>
                  <li><strong>Home</strong> - For household items</li>
                  <li><strong>Custom</strong> - You can make it in settings</li>
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