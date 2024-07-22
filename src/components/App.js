import { useState, useEffect, useReducer } from "react";
import Header from "./Header";
import Loader from "./Loader";
import Error from "./Error";
import Main from "./Main";
import Question from "./Question";
import StartScreen from "./StartScreen";
import Options from "./Options";
import Progress from "./Progress";
import NextButton from "./NextButton";
import FinishScreen from "./FinishScreen";
import Timer from "./Timer";
import Footer from "./Footer";
import Login from "./Login";

const SECS_PER_QUESTION = 180;

const initialState = {
  questions: [], //loading, error, ready, active finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
  users: [],
  login: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "usersFetched":
      return {
        ...state,
        users: action.payload,
      };
    case "loginSuccess":
      return {
        ...state,
        login: true,
      };

    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: SECS_PER_QUESTION,
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };

    case "newAnswer":
      // Getting the current question
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };

    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
        secondsRemaining: SECS_PER_QUESTION,
      };

    case "finish":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };

    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        login: true,
        status: "ready",
      };

    case "logout":
      return {
        ...initialState,
        questions: state.questions,
        users: state.users,
        status: "ready",
      };

    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining--,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };

    default:
      throw new Error("Action unknown");
  }
}

export default function App() {
  const [
    {
      questions,
      status,
      index,
      answer,
      points,
      highScore,
      secondsRemaining,
      users,
      login,
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  const maxPossiblePoints = questions.reduce(
    (prev, curr) => prev + curr.points,
    0
  );
  const numOfQuestions = questions.length;

  useEffect(function () {
    fetch("http://localhost:5000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((error) => dispatch({ type: "dataFailed" }));
  }, []);

  useEffect(function () {
    fetch("http://localhost:8000/users")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "usersFetched", payload: data }))
      .catch((error) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      {!login && <Login dispatch={dispatch} users={users} />}
      {login && (
        <>
          <Header />
          <Main>
            {status === "loading" && <Loader />}
            {status === "ready" && (
              <StartScreen
                numOfQuestions={numOfQuestions}
                dispatch={dispatch}
              />
            )}
            {status === "error" && <Error />}
            {status === "active" && (
              <>
                <Progress
                  index={index}
                  totalQsns={questions.length}
                  points={points}
                  maxPossiblePoints={maxPossiblePoints}
                  answer={answer}
                />
                <Question
                  question={questions[index]}
                  dispatch={dispatch}
                  answer={answer}
                  index={index}
                />
                <Footer>
                  <Timer
                    dispatch={dispatch}
                    secondsRemaining={secondsRemaining}
                  />
                  <NextButton
                    dispatch={dispatch}
                    answer={answer}
                    index={index}
                    numOfQuestions={numOfQuestions}
                  />
                </Footer>
              </>
            )}

            {status === "finished" && (
              <>
                <FinishScreen
                  points={points}
                  maxPossiblePoints={maxPossiblePoints}
                  highScore={highScore}
                  dispatch={dispatch}
                />
              </>
            )}
          </Main>
        </>
      )}
    </div>
  );
}
