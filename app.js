class VoiceAssistant {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.apiKey = localStorage.getItem("AQ.Ab8RN6KcJ69Et56vVTcE1nPllvaQUmYxUfN7I89ba_4ItxI0cg") || "";
        
        // DOM Elements
        this.statusText = document.getElementById("status-text");
        this.userSpeech = document.getElementById("user-speech");
        this.aiResponse = document.getElementById("ai-response");
        this.micButton = document.getElementById("mic-btn");
        this.settingsBtn = document.getElementById("settings-btn");
        this.settingsModal = document.getElementById("settings-modal");
        this.apiKeyInput = document.getElementById("api-key-input");
        this.voiceSelect = document.getElementById("voice-select");
        this.saveSettingsBtn = document.getElementById("save-settings");
        this.nexusOrb = document.getElementById("nexus-orb");
        
        this.init();
    }
    
    init() {
        this.setupSpeechRecognition();
        this.setupEventListeners();
        this.populateVoices();
    }
    
    setupEventListeners() {
        // Microphone button
        this.micButton.addEventListener("click", () => this.toggleMicrophone());
        
        // Settings button
        this.settingsBtn.addEventListener("click", () => this.openSettings());
        
        // Settings modal
        this.saveSettingsBtn.addEventListener("click", () => this.saveSettings());
        this.settingsModal.addEventListener("click", (e) => {
            if (e.target === this.settingsModal) {
                this.closeSettings();
            }
        });
    }
    
    setupSpeechRecognition() {
        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            this.statusText.innerText =
                "Speech recognition is not supported in this browser";
            console.error("Speech Recognition API not supported");
            return;
        }

        this.recognition = new SpeechRecognition();

        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = "en-US";

        this.recognition.onstart = () => {
            console.log("Microphone started");

            this.isListening = true;
            this.setOrbState("listening");
            this.statusText.innerText = "Listening...";
            this.userSpeech.innerText = "";
        };

        this.recognition.onresult = (event) => {
            let transcript = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }

            transcript = transcript.trim();

            console.log("Recognized:", transcript);

            if (transcript) {
                this.userSpeech.innerText = transcript;
            }
        };

        this.recognition.onerror = (event) => {
            console.error("Speech Recognition Error:", event.error);

            this.isListening = false;
            this.setOrbState("idle");

            if (event.error === "not-allowed") {
                this.statusText.innerText =
                    "Microphone permission denied";
            } else if (event.error === "no-speech") {
                this.statusText.innerText =
                    "No speech detected. Try again.";
            } else if (event.error === "audio-capture") {
                this.statusText.innerText =
                    "Microphone not available";
            } else {
                this.statusText.innerText =
                    "Microphone error: " + event.error;
            }
        };

        this.recognition.onend = () => {
            console.log("Speech recognition ended");

            if (this.isListening) {
                this.isListening = false;

                const text = this.userSpeech.innerText.trim();

                if (text && text !== "...") {
                    this.processCommand(text);
                } else {
                    this.setOrbState("idle");
                    this.statusText.innerText = "Ready";
                }
            }
        };
    }
    
    // START LISTENING - This was missing!
    startListening() {
        if (this.recognition && !this.isListening) {
            console.log("Starting speech recognition");
            this.recognition.start();
            this.micButton.classList.add("active");
        }
    }
    
    // STOP LISTENING
    stopListening() {
        if (this.recognition && this.isListening) {
            console.log("Stopping speech recognition");
            this.recognition.stop();
            this.micButton.classList.remove("active");
        }
    }
    
    // TOGGLE MICROPHONE
    toggleMicrophone() {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }
    
    setOrbState(state) {
        this.nexusOrb.className = `orb ${state}`;
    }
    
    async processCommand(text) {
        if (!this.apiKey) {
            this.statusText.innerText = "API Key not set. Open settings.";
            return;
        }
        
        try {
            this.statusText.innerText = "Processing...";
            this.setOrbState("processing");
            
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: text }] }],
                    }),
                }
            );
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            const aiText = data.candidates[0].content.parts[0].text;
            
            this.aiResponse.innerText = aiText;
            this.statusText.innerText = "Ready";
            this.setOrbState("idle");
            
            // Speak the response
            this.speak(aiText);
        } catch (error) {
            console.error("Error processing command:", error);
            this.statusText.innerText = "Error: " + error.message;
            this.setOrbState("idle");
        }
    }
    
    speak(text) {
        if ("speechSynthesis" in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = speechSynthesis.getVoices()[this.voiceSelect.value] || speechSynthesis.getVoices()[0];
            speechSynthesis.speak(utterance);
        }
    }
    
    populateVoices() {
        if ("speechSynthesis" in window) {
            const voices = speechSynthesis.getVoices();
            this.voiceSelect.innerHTML = voices
                .map((voice, index) => `<option value="${index}">${voice.name}</option>`)
                .join("");
        }
    }
    
    openSettings() {
        this.settingsModal.classList.remove("hidden");
        this.apiKeyInput.value = this.apiKey;
    }
    
    closeSettings() {
        this.settingsModal.classList.add("hidden");
    }
    
    saveSettings() {
        this.apiKey = this.apiKeyInput.value;
        localStorage.setItem("geminiApiKey", this.apiKey);
        this.closeSettings();
        this.statusText.innerText = "Settings saved!";
    }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    new VoiceAssistant();
});
