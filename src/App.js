import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const SpeechRecognition = SpeechRecognition || window.webkitSpeechRecognition
const SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
const SpeechRecognitionEvent = SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent

const words = [
  'hello',
  'thank you',
  'thanks',
  'cheers',
]
const grammar = `#JSGF V1.0; grammar words; public <word> = ${words.join(' | ')} ;`
const speechRecognitionList = new SpeechGrammarList()
speechRecognitionList.addFromString(grammar, 1)

const recognition = new SpeechRecognition()
recognition.grammars = speechRecognitionList
recognition.continuous = true;
recognition.lang = 'en-US'
recognition.interimResults = false
recognition.maxAlternatives = 1

class App extends Component {
  state = {
    isListening: true
  }

  componentDidMount() {
    recognition.start()

    recognition.onresult = (event) => {
      if (!this.state.isListening) {
        return
      }

      const word = event.results[event.results.length - 1][0].transcript

      this.artificialIntelligence(word)
    }
  }

  artificialIntelligence = word => {
    this.setListening(false)

    console.log(word)

    if (word.includes('hello')) {
      this.hello()
    }

    if (
      word.includes('thank') ||
      word.includes('thanks') ||
      word.includes('cheers')
    ) {
      this.say('You are most welcome')
    }

    this.setListening(true)
  }

  hello = () => {
    this.say('Hello there')
  }

  say = (what) => {
    const synth = window.speechSynthesis

    const utterance = new SpeechSynthesisUtterance(what)
    utterance.pitch = 1.6
    utterance.rate = Math.min(Math.random() + 0.7, 1.2)

    synth.speak(utterance)
  }

  setListening = shouldListen => {
    this.setState({ isListening: shouldListen })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;
