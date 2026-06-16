/**
 * NEXUS - AI Voice Assistant
 * Core Application Logic
 */

class NexusAssistant {
    constructor() {
        this.apiKey = localStorage.getItem('nexus_api_key') || '';
        this.isListening = false;
        this.isProcessing = false;
        this.voices = [];
        this.selectedVoice = null;
        
        // DOM Elements
        this.orb = document.getElementById('nexus-orb');
        this.micBtn = document.getElementById('mic-btn');
        this.statusText = document.getElementById('status-text');
        this.userSpeech = document.getElementById('user-speech');
        this.aiResponse = document.getElementById('ai-response');
        this.settingsBtn = document.getElementById('settings-btn');
        this.settingsModal = document.getElementById('settings-modal');
        this.saveSettingsBtn = document.getElementById('save-settings');
        this.apiKeyInput = document.getElementById('api-key-input');
        this.voiceSelect = document.getElementById('voice-select');

        this.init();
    }

    init() {
        this.setupSpeechRecognition();
        this.setupSpeechSynthesis();
        this.setupEventListeners();
        this.loadSettings();
        
        if (!this.apiKey) {
            this.showSettings();
        }
    }

    setupSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            this.statusText.innerText = "Speech API not supported";
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            this.setOrbState('listening');
            this.statusText.innerText = "Listening...";
        };

        this.recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('');
            
            this.userSpeech.innerText = transcript;
        };

        this.recognition.onerror = (event) => {
            console.error("SR Error:", event.error);
            this.stopListening();
        };

        this.recognition.onend = () => {
            if (this.isListening) {
                const finalTranscript = this.userSpeech.innerText;
                if (finalTranscript && finalTranscript !== "...") {
                    this.processCommand(finalTranscript);
                } else {
                    this.stopListening();
                }
            }
        };
    }

    setupSpeechSynthesis() {
        this.synth = window.speechSynthesis;
        
        const loadVoices = () => {
            this.voices = this.synth.getVoices();
            this.populateVoices();
        };

        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = loadVoices;
        }
        loadVoices();
    }

    populateVoices() {
        this.voiceSelect.innerHTML = '';
        this.voices.forEach((voice, index) => {
            const option = document.createElement('option');
            option.textContent = `${voice.name} (${voice.lang})`;
            option.value = index;
            this.voiceSelect.appendChild(option);
        });

        const storedVoiceIdx = localStorage.getItem('nexus_voice_idx');
        if (storedVoiceIdx !== null && this.voices[storedVoiceIdx]) {
            this.voiceSelect.value = storedVoiceIdx;
            this.selectedVoice = this.voices[storedVoiceIdx];
        } else if (this.voices.length > 0) {
            // Default to first voice if none stored
            this.selectedVoice = this.voices[0];
            this.voiceSelect.value = 0;
        }
    }

    setupEventListeners() {
        this.micBtn.addEventListener('click', () => this.toggleListening());
        this.settingsBtn.addEventListener('click', () => this.showSettings());
        this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        this.voiceSelect.addEventListener('change', (e) => {
            this.selectedVoice = this.voices[e.target.value];
        });
    }

    toggleListening() {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    startListening() {
        if (!this.apiKey) {
            console.warn("Nexus: Missing API Key");
            this.showSettings();
            return;
        }
        
        try {
            this.isListening = true;
            this.recognition.start();
            this.userSpeech.innerText = "...";
            this.aiResponse.innerText = "";
            console.log("Nexus: Voice recognition started");
        } catch (err) {
            console.error("Nexus: Failed to start recognition:", err);
            this.stopListening();
            // Fallback for when recognition already started or other browser errors
            if (err.name === 'InvalidStateError') {
                this.recognition.stop();
                setTimeout(() => this.startListening(), 100);
            }
        }
    }

    stopListening() {
        this.isListening = false;
        this.recognition.stop();
        this.setOrbState('idle');
        this.statusText.innerText = "Ready";
    }

    async processCommand(text) {
        this.stopListening();
        this.setOrbState('thinking');
        this.statusText.innerText = "Processing...";
        this.isProcessing = true;

        try {
            const response = await this.getGeminiResponse(text);
            this.displayResponse(response);
            this.speak(response);
        } catch (error) {
            console.error("Gemini Error:", error);
            this.displayResponse("I'm sorry, I'm having trouble connecting to my brain right now.");
        } finally {
            this.isProcessing = false;
        }
    }

    async getGeminiResponse(prompt) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`;
        
        const systemInstruction = "You are Nexus, a premium, concise AI voice assistant. Keep your responses short, helpful, and natural for speech. Avoid long lists or complex markdown.";
        
        const body = {
            contents: [{
                parts: [{
                    text: `${systemInstruction}\n\nUser: ${prompt}`
                }]
            }]
        };

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message || 'API Request Failed');
        }

        const data = await res.json();
        return data.candidates[0].content.parts[0].text;
    }

    displayResponse(text) {
        this.aiResponse.innerText = text;
    }

    speak(text) {
        if (this.synth.speaking) {
            this.synth.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Ensure a voice is selected
        if (this.selectedVoice) {
            utterance.voice = this.selectedVoice;
        } else if (this.voices.length > 0) {
            utterance.voice = this.voices[0];
        }

        utterance.onstart = () => {
            this.setOrbState('speaking');
            this.statusText.innerText = "Speaking...";
        };

        utterance.onend = () => {
            this.setOrbState('idle');
            this.statusText.innerText = "Ready";
        };

        this.synth.speak(utterance);
    }

    setOrbState(state) {
        this.orb.className = `orb ${state}`;
    }

    showSettings() {
        this.settingsModal.classList.remove('hidden');
        this.apiKeyInput.value = this.apiKey;
    }

    saveSettings() {
        this.apiKey = this.apiKeyInput.value;
        const voiceIdx = this.voiceSelect.value;
        this.selectedVoice = this.voices[voiceIdx];
        
        localStorage.setItem('nexus_api_key', this.apiKey);
        localStorage.setItem('nexus_voice_idx', voiceIdx);
        
        this.settingsModal.classList.add('hidden');
    }

    loadSettings() {
        this.apiKey = localStorage.getItem('nexus_api_key') || '';
        this.apiKeyInput.value = this.apiKey;
    }
}

// Initialize on Load
window.addEventListener('DOMContentLoaded', () => {
    window.assistant = new NexusAssistant();
});