# 🎙️ NEXUS - AI Voice Assistant

A premium, modern AI voice assistant powered by Google's Gemini API. Interact with AI through natural voice commands with real-time speech recognition and synthesis.

![GitHub last commit](https://img.shields.io/github/last-commit/Jeevankumar-502/Voice_Assistance)
![GitHub repo size](https://img.shields.io/github/repo-size/Jeevankumar-502/Voice_Assistance)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- 🎤 **Voice Recognition** - Speak naturally and the AI will understand
- 🔊 **Voice Synthesis** - AI responds with natural-sounding speech
- 🌈 **Glassmorphism UI** - Modern, sleek interface with animated orb
- 🎯 **Gemini AI Integration** - Powered by Google's Gemini 1.5 Flash model
- 💾 **Local Storage** - Your API key and voice preferences saved locally
- 🌙 **Dark Mode** - Beautiful dark theme for comfortable use
- 📱 **Responsive Design** - Works on desktop and mobile devices
- ⚡ **Real-time Processing** - Instant speech-to-text and response generation

## 🚀 Quick Start

### Prerequisites

- Modern web browser with Web Speech API support (Chrome, Edge, Safari)
- Google Gemini API key ([Get one free here](https://aistudio.google.com/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jeevankumar-502/Voice_Assistance.git
   cd Voice_Assistance
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     python -m http.server 8000
     # Then visit http://localhost:8000
     ```

3. **Configure Settings**
   - Click the ⚙️ settings button
   - Enter your Google Gemini API key
   - Select your preferred voice
   - Click "Save & Close"

4. **Start Using**
   - Click the microphone button (Tap to Speak)
   - Speak your query
   - Listen to the AI response

## 🎯 How to Use

### Basic Workflow

1. **Click the Microphone Button** - The orb will turn pink and start listening
2. **Speak Your Command** - Speak clearly and naturally
3. **Wait for Processing** - The orb turns blue while processing
4. **Hear the Response** - The AI will speak the answer (orb turns golden)

### Voice States

| State | Color | Meaning |
|-------|-------|---------|
| Idle | Cyan | Ready to listen |
| Listening | Pink | Capturing your speech |
| Processing | Blue | AI is thinking |
| Speaking | Golden | AI is responding |

### Example Queries

- "What's the weather like today?"
- "Tell me a joke"
- "Explain quantum computing"
- "What time is it?"
- "How do I make pasta?"

## ⚙️ Configuration

### Getting Your API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Click "Create API Key"
3. Copy the key
4. Paste it in NEXUS settings

### Changing Voice

- Open Settings (⚙️ button)
- Select from available system voices
- Click "Save & Close"
- Your choice is remembered for next time

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Speech APIs**: Web Speech API (Recognition & Synthesis)
- **AI Backend**: Google Gemini 1.5 Flash API
- **Styling**: Custom CSS with Glassmorphism design
- **Storage**: Browser LocalStorage

## 📁 Project Structure

```
Voice_Assistance/
├── index.html          # Main HTML structure
├── app.js              # Core application logic (NexusAssistant class)
├── style.css           # Styling and animations
└── README.md           # This file
```

## 📖 File Descriptions

### `index.html`
- Sets up the DOM structure
- Imports fonts and stylesheets
- Contains modal for settings
- Includes the orb visualizer

### `app.js`
- **NexusAssistant Class** - Main application controller
- **Speech Recognition Setup** - Configures Web Speech API for input
- **Speech Synthesis Setup** - Configures voice output
- **Gemini Integration** - Handles API calls to Google's AI model
- **Event Handling** - Manages user interactions

### `style.css`
- **Color Scheme** - Dark mode with cyan/purple accents
- **Animations** - Orb breathing, rotating, talking animations
- **Layout** - Flexbox-based responsive design
- **Glassmorphism** - Frosted glass effect for modern look

## 🔑 Key Functions

### Core Methods

```javascript
// Start listening for voice input
assistant.startListening()

// Process voice command
assistant.processCommand(text)

// Get AI response from Gemini
assistant.getGeminiResponse(prompt)

// Speak the response
assistant.speak(text)

// Update orb state (idle, listening, thinking, speaking)
assistant.setOrbState(state)
```

## 🐛 Troubleshooting

### Issue: "Speech API not supported"
- **Solution**: Use a modern browser (Chrome, Edge, Safari)
- Check that microphone permissions are enabled

### Issue: API Key not working
- **Solution**: Verify the key is correct at [Google AI Studio](https://aistudio.google.com/apikey)
- Ensure you have API quota remaining
- Check the browser console for error messages

### Issue: No voice output
- **Solution**: Check browser volume settings
- Select a different voice in settings
- Ensure your system has audio output configured

### Issue: Speech recognition not starting
- **Solution**: Allow microphone access when prompted
- Try a different browser
- Check if another app is using the microphone

## 🎨 Customization

### Change Color Scheme

Edit the CSS variables in `style.css`:

```css
:root {
    --accent-blue: #00d2ff;
    --accent-purple: #9d50bb;
    --accent-cyan: #3a7bd5;
    /* ... other colors ... */
}
```

### Modify AI Personality

Edit the system instruction in `app.js`:

```javascript
const systemInstruction = "You are Nexus, a premium, concise AI voice assistant...";
```

### Adjust Orb Size

Change the dimensions in `style.css`:

```css
.orb {
    width: 280px;    /* Change this */
    height: 280px;   /* And this */
}
```

## 📱 Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Best experience |
| Edge | ✅ Full | Full support |
| Safari | ✅ Full | Requires iOS 14.5+ |
| Firefox | ⚠️ Partial | Limited speech API support |
| Opera | ✅ Full | Works well |

## 🔐 Privacy & Security

- **API Keys**: Stored locally in browser, never sent to external servers (except Google)
- **Voice Data**: Processed through Web Speech API and Google services
- **No Tracking**: No analytics or tracking implemented
- **HTTPS Recommended**: Use HTTPS in production for secure API key transmission

## 🚀 Future Enhancements

- [ ] Multiple language support
- [ ] Conversation history
- [ ] Custom command shortcuts
- [ ] Offline mode with local AI
- [ ] Export conversation logs
- [ ] Voice activity detection
- [ ] Real-time transcript display improvements
- [ ] Integration with other APIs (weather, news, etc.)

## 📝 Recent Fixes

### v1.1.0 (Latest)
- ✅ Fixed voice synthesis not working
- ✅ Removed module script type for better compatibility
- ✅ Added default voice selection
- ✅ Improved error handling
- ✅ Fixed transcript filtering

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Jeevankumar-502**
- GitHub: [@Jeevankumar-502](https://github.com/Jeevankumar-502)

## 📧 Support

For issues, questions, or suggestions, please:
- Open an [issue](https://github.com/Jeevankumar-502/Voice_Assistance/issues)
- Contact via GitHub

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- Web Speech API for speech recognition and synthesis
- Open source community for inspiration

---

**Made with ❤️ by Jeevankumar-502**

⭐ If you find this project helpful, please give it a star!
