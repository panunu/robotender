import React, { Component } from 'react'
import './App.css'
import Lottie from 'react-lottie'
import * as fillAnimation from './pink_drink_machine.json'

const SpeechRecognition = SpeechRecognition || window.webkitSpeechRecognition
const SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList
const SpeechRecognitionEvent = SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent

const words = [
  'hello',
  'hi',
  'thank you',
  'thanks',
  'cheers',
  'shit',
  'fuck',
  'yes',
  'no',
  'number one',
  'number two',
  'one',
  'two',
  'love you',
]
const grammar = `#JSGF V1.0; grammar words; public <word> = ${words.join(' | ')} ;`
const speechRecognitionList = new SpeechGrammarList()
speechRecognitionList.addFromString(grammar, 1)

const recognition = new SpeechRecognition()
recognition.grammars = speechRecognitionList
recognition.continuous = false
recognition.lang = 'en-US'
recognition.interimResults = false
recognition.maxAlternatives = 1

const synth = window.speechSynthesis

class App extends Component {
  state = {
    shouldBeListening: true,
    isListening: false,
    status: 'hello', // hello | drink? | choice | fill
  }

  componentDidMount() {
    recognition.start()

    recognition.onresult = (event) => {
      const word = event.results[event.results.length - 1][0].transcript

      if (!this.state.shouldBeListening || synth.speaking || synth.pending) {
        try { recognition.abort() } catch (e) { }

        return
      }

      this.artificialIntelligence(word)
    }

    recognition.onspeechend = () => console.log('Speech has stopped being detected')
    recognition.onspeechstart = () => console.log('Speech has been detected')
    recognition.onaudioend = () => this.setState({ isListening: false })
    recognition.onaudiostart = () => this.setState({ isListening: true })

    setInterval(() => { try { this.state.shouldBeListening && recognition.start() } catch (e) { } } , 100)
  }

  artificialIntelligence = word => {
    const { status } = this.state

    this.setListening(false)

    if (status === 'hello') {
      if (
        word.includes('hello') ||
        word.includes('hi')
      ) {
        this.hello()
      }
    } else if (status === 'drink?') {
      if (word.includes('yes')) {
        this.chooseDrink()
      } else if (word.includes('no')) {
        this.cancel()
      }
    } else if (status === 'choice') {
      if (word.includes(1) || word.includes(2) || word.includes('one') || word.includes('two')) {
        this.fixDrink((word.includes('one') || word.includes(1)) ? 1 : 2)
      } else if (word.includes('nothing')) {
        this.cancel()
      }
    }

    if (
      word.includes('thank') ||
      word.includes('thanks') ||
      word.includes('cheers')
    ) {
      this.say('Oh... you are so kind')
    }

    if (word.includes('love you')) {
      this.say('I love you, too. Or then I am just drunk')
    }

    if (word.includes('*')) {
      this.say('Mind your language, mister!')
    }

    setTimeout(() => this.setListening(true), 1)
  }

  hello = () => {
    this.say('Hello there! ...')
    this.say('Can I fix you a drink?')

    this.setState({ status: 'drink?' })
  }

  cancel = () => {
    this.say('Ok, well, fuck off')

    this.setState({ status: 'hello' })
  }

  chooseDrink = () => {
    this.say('Got it! Take a look at the drink list. Let me know what you want.')

    this.setState({ status: 'choice' })
  }

  fixDrink = (choice) => {
    const drinks = {
      1: 'Jack Daniels Cola',
      2: 'Jallu kola'
    }

    this.say(`Excellent choice!`)
    this.say(`One ${drinks[choice]}, coming right up!`)

    this.setState({ status: 'fill' })

    // TODO: Make the API call here.

    setTimeout(() => {
      this.say('All done! Enjoy your evening with your increased alcohol level in your blood')

      this.setState({ status: 'done' })

      setTimeout(() => this.setState({ status: 'hello' }), 8000)
    }, 12000)
  }

  say = what => {
    const utterance = new SpeechSynthesisUtterance(what)
    utterance.pitch = 1.2
    utterance.rate = 0.9
    utterance.volume = 1
    utterance.lang = 'en-US'

    synth.speak(utterance)
  }

  setListening = shouldListen => {
    this.setState({ shouldBeListening: shouldListen })
  }

  render() {
    const { status } = this.state

    const done = {
      loop: true,
      autoplay: true,
      animationData: require('./thirsty'),
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    }

    const fill = {
      ...done,
      animationData: require('./loader'),
    }

    const idle = {
      ...done,
      animationData: require('./soda_loader'),
    }

    const listening = {
      ...done,
      animationData: require('./ripple_loading_animation'),
    }

    return (
      <div className="App">
        {status === 'hello' && <div>
          <Lottie
            options={idle}
            height={400}
            width={400}
          />

          <div className="sub">
            Want me to fix you a drink? <br/>Just say <i>hello</i>.
          </div>
        </div>}

        {status === 'drink?' && <div>
          <Lottie
            options={idle}
            height={400}
            width={400}
          />

          Yes / No
        </div>}

        {status === 'choice' && <div>
          <div className="cards">
            <div className="card">
              <h1>1</h1>

              <h2>Jack Daniels Cola</h2>

              <div className="sub">The best there is.</div>
            </div>

            <div style={{ flex: 0.2 }}></div>

            <div className="card">
              <h1>2</h1>

              <h2>Jallu-kola</h2>

              <div className="sub">Nothing beats Jallu.</div>
            </div>
          </div>

          <div className="sub">
            Place your glass on the designated target.<br/>
            Choose a drink by saying it's number.<br/>
          </div>
        </div>}

        {status === 'fill' && <div>
          <Lottie
            options={fill}
            height={600}
            width={600}
          />

          <div className="sub">
            Please have your glass on the designated target.
          </div>
        </div>}

        {status === 'done' && <div>
          <Lottie
            options={done}
            height={600}
            width={600}
          />

          Done!

          <div className="sub">Have a nice evening.</div>
        </div>}

        <div className="listening">
          {this.state.isListening &&
            <Lottie
              options={listening}
              height={80}
              width={80}
            />
          }
        </div>

        <div class="brand">RoboTender</div>
      </div>
    );
  }
}

export default App
