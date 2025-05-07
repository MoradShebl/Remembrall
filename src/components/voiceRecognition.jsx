import useSpeechRecognition from "../Hooks/useSpeechRecognition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import {
  faMicrophone,
  faMicrophoneSlash,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";

const SpeechRecognition = ({ onAddItem }) => {
  const [status, setStatus] = useState("");
  const { text, setText, isListening, startListening, stopListening } =
    useSpeechRecognition();

  useEffect(() => {
    if (!isListening && text) {
      setStatus("listened");
    } else if (isListening && !text) {
      setStatus("listening");
    } else if (!isListening && !text) {
      setStatus("not listening");
    }
  }, [isListening, text]);

  const handleCommand = () => {
    const words = text.split(" ");
    console.log(words);

    setStatus("not listening");
    setText("");
    onAddItem(words[0], words.slice(1).join(" "));
  };

  return (
    <div className="speech-recognition">
      <input
        className="speech-recognition-input"
        value={text}
        placeholder={
          status === "listening"
            ? "Listening..."
            : "Click the button to start listening"
        }
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
      >
        {status === "listening" ? (
          <FontAwesomeIcon icon={faMicrophoneSlash} />
        ) : status === "listened" ? (
          <FontAwesomeIcon icon={faPaperPlane} />
        ) : status === "not listening" ? (
          <FontAwesomeIcon icon={faMicrophone} />
        ) : (
          <FontAwesomeIcon icon={faMicrophone} />
        )}
      </button>
    </div>
  );
};

export default SpeechRecognition;
