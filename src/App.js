import React, { Component } from 'react'
import './App.css'
import Lottie from 'react-lottie'

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

const doneAnimation = {
  loop: true,
  autoplay: true,
  animationData: require('./thirsty'),
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
}

const fillAnimation = {
  ...doneAnimation,
  animationData: require('./loader'),
}

const idleAnimation = {
  ...doneAnimation,
  animationData: require('./soda_loader'),
}

const listeningAnimation = {
  ...doneAnimation,
  animationData: require('./ripple_loading_animation'),
}

const sadAnimation = {
  ...doneAnimation,
  animationData: require('./sad'),
}

class App extends Component {
  state = {
    shouldBeListening: true,
    isListening: false,
    status: 'hello', // hello | drink? | choice | fill | done | cancel
  }

  componentDidMount() {
    recognition.start()

    recognition.onresult = (event) => {
      const word = event.results[event.results.length - 1][0].transcript

      if (!this.state.shouldBeListening || synth.speaking || synth.pending) {
        // try { recognition.abort() } catch (e) { }
        // TODO: Try to avoid listening when speaking.

        return
      }

      this.artificialIntelligence(word)
    }

    recognition.onspeechend = () => console.log('Speech has stopped being detected')
    recognition.onspeechstart = () => console.log('Speech has been detected')
    recognition.onaudioend = () => this.setState({ isListening: false })
    recognition.onaudiostart = () => this.setState({ isListening: true })

    setInterval(() => { try { this.state.shouldBeListening && recognition.start() } catch (e) { } } , 200)
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
    this.say('Aww... That makes me a sad robot. It is so lonely here!')

    this.setState({ status: 'cancel' })

    setTimeout(() => this.setState({ status: 'hello' }), 6500)
  }

  chooseDrink = () => {
    this.say('Got it! Take a look at the drink list. Let me know what would you like.')

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
      this.say('Here you go! I hope you will have a lovely evening.')

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

    const backgroundColors = {
      hello: '#293868',
      'drink?': '#6e46a0',
      choice: '#610051',
      fill: '#463068',
      done: '#463068',
      cancel: '#7c879a',
    }

    return (
      <div className="App" style={{ backgroundColor: backgroundColors[status] }}>
        {status === 'hello' && <div>
          <Lottie
            options={idleAnimation}
            height={400}
            width={400}
          />

          <div className="sub">
            Want me to fix you a drink? <br/>Just say <i>hello</i>.
          </div>
        </div>}

        {status === 'drink?' && <div>
          <Lottie
            options={idleAnimation}
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
            options={fillAnimation}
            height={600}
            width={600}
          />

          <div className="sub">
            Please have your glass on the designated target.
          </div>
        </div>}

        {status === 'done' && <div>
          <Lottie
            options={doneAnimation}
            height={600}
            width={600}
          />

          All done!

          <div className="sub">Have a nice evening.</div>
        </div>}

        {status === 'cancel' && <div>
          <Lottie
            options={sadAnimation}
            height={1000}
            width={1000}
          />
        </div>}

        <div className="listening">
          {this.state.isListening &&
            <Lottie
              options={listeningAnimation}
              height={80}
              width={80}
            />
          }
        </div>

        <div className="brand">RoboTender</div>
      </div>
    );
  }
}

export default App
