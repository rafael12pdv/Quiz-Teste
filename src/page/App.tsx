import React, { useEffect, useState, } from 'react';
import { Question } from '../models/apiModel';
import axios from 'axios';
import '../index.css'

export default function App() {

  const [data, setData] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questionCurrent, setQuestionCurrent] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [userStarted, setUserStarted] = useState(false);
  const [username, setUsername] = useState('');

  const handleAnswerButtonClick = (answer: string) => {
    if (answer === data[questionCurrent]?.resposta_correta) {
      setScore(score + 1);
    }
    const nextQuestion = questionCurrent + 1;
    if (nextQuestion < data.length) {
      setQuestionCurrent(nextQuestion);
      shuffleAnswers(nextQuestion);
    } else {
      setShowScore(true);
    }
  };
  const shuffleArray = (array: any[]) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const shuffleAnswers = (questionIndex: number) => {
    const answers = [
      data[questionIndex]?.resposta_correta,
      data[questionIndex]?.resposta_errada1,
      data[questionIndex]?.resposta_errada2
    ];
    setShuffledAnswers(shuffleArray(answers));
  };

  const fetchData = async () => {
    try {
      const response = await axios.get('https://be-teste-tec-b5dc1a90bbd0.herokuapp.com/api/atividades/list');
      setData(response.data.data);
      shuffleAnswers(0);
      setIsLoading(false);

    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  };



  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (data.length > 0) {
      shuffleAnswers(questionCurrent);
    }
  }, [questionCurrent, data]);


  const startQuiz = () => {
    setUserStarted(true);
  };

  return (
    <div className='app'>
      {isLoading ? (
        <p  className='Text' >Carregando...</p>
      ) : (
        <>
          {showScore ? (
            <>
              <div className='Text'>SCORE</div>
              <div className='score-section'>Você acertou {score}</div>
              <div className='score-section'>Você errou {data.length - score -1}</div>
              <div className='score-section'>Você acertou {(score / (data.length -1)) * 100}%</div>
            </>
          ) : (
            <div>
              {!userStarted ? (<div className='question-section'>
                <div className='question-count'>
                <div className='Text'>QUIZ</div>
                <br></br>
                  <input
                    className='name-input'
                    type='text'
                    placeholder='Insira seu nome'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <button onClick={startQuiz}>Iniciar Quiz</button>
              </div>
              ) : (
                <div className='question-section'>
                  <div className='Text'>
                    <span>{username}</span>
                  </div>
                  <div className='question-count'>
                    <span>Question {questionCurrent + 1}</span>/{data.length}
                  </div>
                  <div className='question-text'>{data[questionCurrent]?.pergunta}</div>
                  <div className='answer-section'>
                    {shuffledAnswers.map((answer, index) => (
                      <button key={index} onClick={() => handleAnswerButtonClick(answer)}>
                        {answer}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
