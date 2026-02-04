import { useState } from 'react';

// This displays the calculated results
function DisplayResults({results, splitShare}) {
  const [expandedIndex, setExpandedIndex] = useState(null); // For results breakdown

  return (
    <div className="results-display">
      <h3>Final Breakdown</h3>
      <p className="split-info">Split per Person: {splitShare.toFixed(2)}</p>
      
      {results.map((res, i) => (
        <div key={i} className="result-card">
          <div className="result-header">
            <strong>{res.name} </strong>
            <span>{res.total.toFixed(2)}</span>
            <button 
              className="expand-btn"
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
            >
              {expandedIndex === i ? 'Hide' : '...'}
            </button>
          </div>

          {expandedIndex === i && (
            <div className="result-details">
              <div className="detail-row">
                <span>Base Share:</span>
                <span>{res.baseShare.toFixed(2)}</span>
              </div>
              {res.orders.length > 0 && (
                <div className="orders-list">
                  <p>Orders:</p>
                  <ul>
                    {res.orders.map((o, j) => (
                      <li key={j}>
                        {o.orderName || 'Item'}: {Number(o.cost).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {res.discountAmount > 0 && (
                <div className="detail-row discount">
                  <span>Discount:</span>
                  <span>-{res.discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default DisplayResults;