import { useEffect, useState } from "react";
import { QuestionData, useQuestionData } from "./hooks/useQuestionData";
import { nanoid } from "nanoid";
import { decode } from "html-entities";
import QuestionContainer from "./components/QuestionContainer";

export default function App() {
  const { data, isFetching, refetch } = useQuestionData();
  const [allQuestions, setAllQuestions] = useState<QuestionData[] | undefined>(
    []
  );
  const [startGame, setStartGame] = useState(false);
  const [playAgain, setPlayAgain] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (data) {
      setAllQuestions(data);
    }
  }, [data]);

  function getUserAnswer(
    id: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    setAllQuestions((prevData) => {
      return prevData?.map((question) => {
        return question.question === id
          ? { ...question, userAnswer: (event.target as Element).innerHTML }
          : question;
      });
    });
  }

  function checkAnswers() {
    setPlayAgain(true);
    allQuestions?.map((question) => {
      if (question.correct_answer === question.userAnswer) {
        setScore((prevScore) => prevScore + 1);
      }
    });
  }

  function restartGame() {
    refetch();
    setScore(0);
    setPlayAgain(false);
  }

  function startNewGame() {
    refetch();
    setStartGame((oldGame) => !oldGame);
    setScore(0);
  }

  const questionElements = allQuestions?.map((question) => {
    const { correct_answer, incorrect_answers } = question;
    const shuffledAnswers = [...incorrect_answers, correct_answer].sort();

    const answersElements = shuffledAnswers.map((answer) => (
      <button
        key={nanoid()}
        onClick={(event) => getUserAnswer(question.question, event)}
        disabled={playAgain}
        className={`px-4 py-1 rounded-xl cursor-pointer text-sm  border-[1px] text-dark_purple ${
          playAgain && question.correct_answer === answer
            ? "bg-correct border-correct"
            : playAgain &&
              question.userAnswer === answer &&
              question.correct_answer !== question.userAnswer
            ? "bg-incorrect border-incorrect"
            : question.userAnswer === answer
            ? "bg-light_gray border-light_gray"
            : "bg-soft_white border-light_purple"
        }`}
      >
        {decode(answer)}
      </button>
    ));

    return (
      <QuestionContainer
        key={nanoid()}
        category={decode(question.category)}
        question={decode(question.question)}
      >
        {answersElements}
      </QuestionContainer>
    );
  });

  return (
    <main className="flex flex-col items-center justify-center min-h-screen max-lg:h-full max-lg:py-10 bg-soft_white bg-[url(/assets/images/blobs-blue.png),_url(/assets/images/blobs-yellow.png)] bg-no-repeat bg-[position:left_bottom,right_top] bg-[auto_300px] font-Karla">
      {startGame ? (
        isFetching ? (
          <p className="font-bold text-5xl text-dark_purple">Loading...</p>
        ) : (
          <>
            <div className="w-[800px] max-lg:w-72">{questionElements}</div>
            <div className="flex items-center justify-center gap-5">
              {playAgain && (
                <p className="text-dark_purple font-bold text-2xl">
                  You scored {score}/5 correct answers
                </p>
              )}
              <button
                className="bg-light_purple px-7 py-4 text-white cursor-pointer rounded-xl hover:brightness-75 transition"
                onClick={playAgain ? restartGame : checkAnswers}
              >
                {playAgain ? "Play again" : "Check answers"}
              </button>
            </div>
          </>
        )
      ) : (
        <div className="flex flex-col items-center">
          <h1 className="text-dark_purple text-4xl mb-10 font-semibold">
            Quizzical
          </h1>
          <button
            className="bg-light_purple px-7 py-4 text-white cursor-pointer rounded-xl hover:brightness-75 transition"
            onClick={startNewGame}
          >
            Start Quiz
          </button>
        </div>
      )}
    </main>
  );
}
