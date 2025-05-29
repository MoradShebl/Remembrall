import useSpeechRecognition from "../Hooks/useSpeechRecognition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useCallback } from "react";
import {
  faMicrophone,
  faMicrophoneSlash,
  faPaperPlane,
  faXmark,
  faCircleXmark,
  faLightbulb
} from "@fortawesome/free-solid-svg-icons";

const exampleCommand = "Add keys to drawer in Work category";

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
    if (text === "help") setShowHelp(true);
  }, [text]);

  // Use useCallback to memoize the handleCommand function
  const handleCommand = useCallback(() => {
    // ...existing code...
    // (No changes to your parsing logic)
    // ...existing code...
  }, [text, setText, onAddItem, onAddTime, categories, activeSection]);

  const cancelListening = useCallback(() => {
    setStatus("not listening");
    setText("");
  }, [setText]);

  // New: Clear input button
  const clearInput = () => {
    setText("");
    setStatus("not listening");
  };

  // New: Fill example command
  const tryExample = () => {
    setText(exampleCommand);
    setShowHelp(false);
    setStatus("listened");
  };

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
          aria-label="Speech recognition input"
          tabIndex={0}
        />
        {/* Clear button */}
        {text && (
          <button
            className="speech-clear-btn"
            onClick={clearInput}
            aria-label="Clear input"
            tabIndex={0}
            style={{
              position: "absolute",
              right: 60,
              top: 8,
              background: "none",
              border: "none",
              color: "#888",
              cursor: "pointer"
            }}
          >
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>
        )}
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
          tabIndex={0}
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
        <div className="help-overlay" tabIndex={0} aria-modal="true" role="dialog">
          <div className="help-modal" style={{ maxHeight: "90vh", overflowY: "auto" }}>
            <div className="help-header">
              <h3>
                <FontAwesomeIcon icon={faLightbulb} style={{ color: "#facc15", marginRight: 8 }} />
                Voice Command Help
              </h3>
              <button 
                className="close-help" 
                onClick={() => setShowHelp(false)}
                aria-label="Close help"
                tabIndex={0}
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
              <div className="help-section">
                <h4>Try an Example</h4>
                <button className="add-button" onClick={tryExample} style={{ marginTop: 8 }}>
                  <FontAwesomeIcon icon={faPaperPlane} /> Try: "{exampleCommand}"
                </button>
              </div>
              <div className="help-section">
                <h4>More Tips</h4>
                <ul>
                  <li>Use "help" at any time to see this guide.</li>
                  <li>Use the clear (<FontAwesomeIcon icon={faCircleXmark} />) button to reset input.</li>
                  <li>For best results, use a headset or quiet environment.</li>
                  <li>Categories are case-insensitive.</li>
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