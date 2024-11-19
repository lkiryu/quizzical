import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'
import { decode } from 'html-entities'
import Question from './components/Question/Question'
import './App.css'

function App() {
  const [allquestions, setAllquestions] = useState([])
  const [startGame, setStartGame] = useState(false)
  const [playAgain, setPlayAgain] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    if (playAgain === false) {
      async function getData() {
        const response = await fetch("https://opentdb.com/api.php?amount=5&type=multiple")
        const data = await response.json()
        let questions = []
        data.results.forEach(question => {
          questions.push({
            id: nanoid(),
            category: question.category,
            question: question.question,
            correctAnswer: question.correct_answer,
            incorrect_answers: question.incorrect_answers,
            userAnswer: ""
          })
        })
        setAllquestions(questions)
      }
      getData()
    }
  }, [playAgain])

  function getUserAnswer(id, event) {
    setAllquestions(prevQuestion => {
      return prevQuestion.map(question => {
        return question.id === id ? { ...question, userAnswer: event.target.innerHTML } : question
      })
    })
  }

  function checkAnswers() {
    setPlayAgain(true)
    allquestions.map(question => {
      if (question.correctAnswer === question.userAnswer) {
        setScore(prevScore => prevScore + 1)
      }
    })
  }

  function restartGame() {
    setScore(0)
    setPlayAgain(false)
  }

  const questionElements = allquestions.map(question => {
    const { correctAnswer, incorrect_answers } = question
    const shuffledAnswers = [...incorrect_answers, correctAnswer].sort()

    const answersElements = shuffledAnswers.map(answer => {
      return (
        <button
          key={nanoid()}
          className={`answer 
            ${question.userAnswer === answer ? "selected" : ""}
            ${playAgain && question.correctAnswer === answer ? "correct" : ""}
            ${playAgain && question.userAnswer === answer && question.correctAnswer !== question.userAnswer ? "incorrect" : ""}
            `}
          onClick={(event) => getUserAnswer(question.id, event)}
          disabled={playAgain}
        >
          {decode(answer)}
        </button>
      )
    })

    return (
      <Question
        key={question.id}
        category={decode(question.category)}
        question={decode(question.question)}
      >
        <div className='answers-container'>
          {answersElements}
        </div>
      </Question>
    )
  })

  function startNewGame() {
    setStartGame(oldGame => !oldGame)
    setScore(0)
  }

  return (
    <main className='container'>
      {startGame ?
        <>
          <div className='question-container'>
            {questionElements}
          </div>
          <div className='button-container'>
            {playAgain &&
              <p className='score'>You scored {score}/5 correct answers</p>
            }
            <button className='button' onClick={playAgain ? restartGame : checkAnswers}>{playAgain ? "Play again" : "Check answers"}</button>
          </div>
        </>
        :
        <div className='start-game-container'>
          <h1 className='title'>Quizzical</h1>
          <button className='button' onClick={startNewGame}>Start Quiz</button>
        </div>
      }
    </main>
  )
}

export default App
