import { useReducer } from "react";
const initialState = { count: 0, step: 1 };

// Reducer function takes the current state and all the information that is contained
// in the action in order to compute the next state.
// Usually, based on the action type the reducer then takes some kind of decision.
function reducer(state, action) {
  console.log(state, action);

  switch (action.type) {
    case "dec":
      return { ...state, count: state.count - state.step };
    case "inc":
      return { ...state, count: state.count + state.step };
    case "setCount":
      return { ...state, count: action.payload };
    case "setStep":
      return { ...state, step: action.payload };
    case "reset":
      return initialState;
    default:
      throw new Error("Unknown action");
  }

  // if (action.type === "inc") return state + 1;
  // if (action.type === "dec") return state - 1;
  // if (action.type === "setCount") return action.payload;

  // Here the sum of state & action will be the new state.
  // return state + action;
}

function DateCounter() {
  // We will use useReducer hook to replace below two hooks.
  // const [count, setCount] = useState(0);
  // const [step, setStep] = useState(1);

  // The dispatch function can be used to update the state. It just works in a slightly different way.
  // The useReducer function returns the dispatch function just like the useState returns the setState function.

  const [state, dispatch] = useReducer(reducer, initialState); // state(current state) = 0

  const { count, step } = state;

  // This mutates the date object.
  const date = new Date("june 21 2027");
  date.setDate(date.getDate() + count);

  const dec = function () {
    // setCount((count) => count - 1);
    // setCount((count) => count - step);

    dispatch({ type: "dec" });
  };

  const inc = function () {
    // setCount((count) => count + 1);
    // setCount((count) => count + step);

    // action(next state) = 1
    // Simply put, "{ type: "inc", playload: 1}" This object is called  action when we work with reducer function.
    // Object can be of any shape, but the written one is the standard.
    dispatch({ type: "inc" });
  };

  const defineCount = function (e) {
    dispatch({ type: "setCount", payload: Number(e.target.value) });
    // setCount(Number(e.target.value));
  };

  const defineStep = function (e) {
    dispatch({ type: "setStep", payload: Number(e.target.value) });
    // setStep(Number(e.target.value));
  };

  const reset = function () {
    dispatch({ type: "reset" });
    // setCount(0);
    // setStep(1);
  };

  return (
    <div className="counter">
      <div>
        <input
          type="range"
          min="0"
          max="10"
          value={step}
          onChange={defineStep}
        />
        <span>{step}</span>
      </div>

      <div>
        <button onClick={dec}>-</button>
        <input value={count} onChange={defineCount} />
        <button onClick={inc}>+</button>
      </div>

      <p>{date.toDateString()}</p>

      <div>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}
export default DateCounter;
