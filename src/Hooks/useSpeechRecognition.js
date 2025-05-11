/* global webkitSpeechRecognition */

import { useEffect, useState, useRef } from "react";

// Don't create the recognition instance here, we'll do it inside the hook

const useSpeechRecognition = (speechLanguage) => {
    const [text, setText] = useState("")
    const [isListening, setIsListening] = useState(false)
    const recognitionRef = useRef(null);
    const languageRef = useRef(speechLanguage);
    
    // Update language ref when speechLanguage changes
    useEffect(() => {
        languageRef.current = speechLanguage;
    }, [speechLanguage]);
    
    // Initialize recognition instance once
    useEffect(() => {
        if (typeof window !== 'undefined' && "webkitSpeechRecognition" in window) {
            recognitionRef.current = new webkitSpeechRecognition();
            
            // Set up event handlers
            recognitionRef.current.onresult = (event) => {
                setText(event.results[0][0].transcript);
                recognitionRef.current.stop();
                setIsListening(false);
            };
            
            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };
            
            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
        
        // Cleanup function
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.onresult = null;
                recognitionRef.current.onerror = null;
                recognitionRef.current.onend = null;
            }
        };
    }, []);
    
    const startListening = () => {
        if (!recognitionRef.current) return;
        
        setText('');
        setIsListening(true);
        
        // Set the language correctly before starting
        recognitionRef.current.lang = languageRef.current;
        
        try {
            recognitionRef.current.start();
        } catch (error) {
            console.error('Speech recognition start error:', error);
            setIsListening(false);
        }
    };
    
    const stopListening = () => {
        if (!recognitionRef.current) return;
        
        setIsListening(false);
        try {
            recognitionRef.current.stop();
        } catch (error) {
            console.error('Speech recognition stop error:', error);
        }
    };
    
    return {
        text,
        setText,
        isListening,
        startListening,
        stopListening,
        hasRecognitionSupport: !!recognitionRef.current,
    };
};

export default useSpeechRecognition;
