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
