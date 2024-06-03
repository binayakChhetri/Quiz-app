function Progress({ index, totalQsns, points, maxPossiblePoints, answer }) {
  return (
    <header className="progress">
      <progress max={totalQsns} value={index + Number(answer !== null)} />

      <p>
        Question<strong> {index + 1}</strong>/{totalQsns}
      </p>
      <p>
        <strong>{points}</strong>/{maxPossiblePoints}
      </p>
    </header>
  );
}

export default Progress;
