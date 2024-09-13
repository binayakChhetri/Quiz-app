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
  questions: [
    {
      question:
        "What was significant about Italy's 2-1 win against Albania in Group B?",
      options: [
        "It was Italy's 50th victory in a EURO finals",
        "Albania scored the fastest-ever EURO goal",
        "There were more shots than any other game is EURO history",
        "Italy scored the latest-ever EURO goal",
      ],
      correctOption: 1,
      points: 10,
    },
    {
      question:
        "Georgia appeared at a major international tournament for the very first time. Who did their one and only victory at EURO 2024 come against?",
      options: ["Czechia", "Turkey", "Spain", "Portugal"],
      correctOption: 3,
      points: 10,
    },
    {
      question:
        "Which goalkeeper saved all three penalties in a shoot-out during his team's round of 16 victory?",
      options: [
        "Mike Maignan (France)",
        "Jordan Pickford (England)",
        "Diogo Costa (Portugal)",
        "Unai Simon (Spain)",
      ],
      correctOption: 2,
      points: 10,
    },
    {
      question:
        "Whose winner after 89 minutes 59 seconds was the latest ever scored in the semi-finals of a EURO or World Cup (excluding extra time)?",
      options: [
        "Dani Olmo (Spain)",
        "Ollie Watkina (England)",
        "Lamine Yamal (Spain)",
        "Harry Kane (England)",
      ],
      correctOption: 1,
      points: 10,
    },
    {
      question:
        "Spain beat England 2-1 in the final in Berlin. Who scored the winning goal?",
      options: [
        "Lamine Yamal",
        "Nico Williams",
        "Mike Merino",
        "Mikel Oyarzabal",
      ],
      correctOption: 3,
      points: 10,
    },
    {
      question:
        "Spain's 15 goals at EURO 2024 is a new tournament record. Which team did they surpass? ",
      options: ["Germany", "France", "England", "Portugal"],
      correctOption: 1,
      points: 10,
    },
    {
      question:
        "Which player attempted the most shots at EURO 2024 with a total of 24?",
      options: [
        "Cristiano Ronaldo",
        "Kai Havertz",
        "Kylian Mbappe",
        "Memphis Depay",
      ],
      correctOption: 2,
      points: 10,
    },
    {
      question:
        "Which side had the most overall average possession in the tournament with a total of 64.8%?",
      options: ["Netherlands", "Italy", "England", "Portugal"],
      correctOption: 3,
      points: 10,
    },
    {
      question: "A total of how many goals were scored at the tournament? ",
      options: ["95", "117", "128", "133"],
      correctOption: 1,
      points: 10,
    },
    {
      question: "Which country hosted the EURO 2024?",
      options: ["Germany", "Belgium", "France", "Denmark"],
      correctOption: 0,
      points: 10,
    },
    {
      question: "Who scored Euro 2024's first goal?",
      options: [
        "Kai Havertz",
        "Jamal Musiala",
        "Florian Wirtz",
        "Niclas Fullkrug",
      ],
      correctOption: 2,
      points: 10,
    },
    {
      question:
        "The Czech Republic v Turkey game set a new record for the most cards in a Euros match. How many cards (both yellow and red) were dished out?",
      options: ["12", "15", "18", "21"],
      correctOption: 2,
      points: 10,
    },
    {
      question: "Who holds the all-time Euro goals record?",
      options: [
        "Harry Kane",
        "Cristiano Ronaldo",
        "Nico Williams",
        "Lamine Yamal",
      ],
      correctOption: 1,
      points: 10,
    },
    {
      question:
        "Which player appeared in a record 6th Euro tournament at EURO 2024?",
      options: [
        "Cristiano Ronaldo",
        "Toni Kroos",
        "Luka Modric",
        "Kylian Mbappe",
      ],
      correctOption: 0,
      points: 10,
    },
    {
      question: "How many time England won EURO title?",
      options: ["1", "3", "0", "5"],
      correctOption: 2,
      points: 10,
    },
  ], //loading, error, ready, active finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
  users: [
    {
      username: "kin_65",
      password: "it'sEuro@13",
      id: 0,
    },
    {
      username: "ak47",
      password: "homie%^12",
      id: 1,
    },
    {
      username: "john12",
      password: "john1234",
      id: 2,
    },
  ],
  login: false,
};

function reducer(state, action) {
  switch (action.type) {
    // case "dataReceived":
    //   return {
    //     ...state,
    //     questions: action.payload,
    //     status: "ready",
    //   };
    // case "usersFetched":
    //   return {
    //     ...state,
    //     users: action.payload,
    //   };
    case "loginSuccess":
      return {
        ...state,
        login: true,
        status: "ready",
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

  /* useEffect(function () {
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
  }, []); */

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
