// This displays the calculated results

function DisplayResults({results, splitShare}) {
  return (
    <div className="results-display">
      <h3>Final</h3>
      {results.map((res, i) => (
        <p key={i}>
          {res.name}: {res.total.toFixed(2)}
        </p>
      ))}
      <p>Split Amount: {splitShare.toFixed(2)}</p>
    </div>
  );
}

export default DisplayResults;