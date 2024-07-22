function StartScreen({ numOfQuestions, dispatch }) {
  return (
    <div className="start">
      <h2>Welcome to EURO 2024 Quiz!</h2>
      <h3>{`There will be a total of ${numOfQuestions} questions to check how much you know about the tournament.`}</h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "start" })}
      >
        Let's start!
      </button>
    </div>
  );
}

export default StartScreen;
