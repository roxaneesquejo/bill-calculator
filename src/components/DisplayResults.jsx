import { useState } from "react";

function DisplayResults({ results, splitShare, separatePayment }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  return (
    <div className="results-display">
      <h3>Final Breakdown</h3>

      {!separatePayment && (
        <div className="split-info">
          <span>Base Split per Person</span>
          <strong>{Number(splitShare).toFixed(2)}</strong>
        </div>
      )}

      <div className="results-list">
        {results.map((res, i) => (
          <div key={`result-${i}-${res.name}`} className="result-card">
            <div
              className="result-header"
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
            >
              <div className="result-main-info">
                <span className="result-name">{res.name || "Unnamed"}</span>
                <span className="result-total">
                  {Number(res.total).toFixed(2)}
                </span>
              </div>
              <button
                className={`expand-btn ${expandedIndex === i ? "open" : ""}`}
              >
                {expandedIndex === i ? "−" : "+"}
              </button>
            </div>

            {expandedIndex === i && (
              <div className="result-details">
                <div className="detail-row">
                  <span>Base Share</span>
                  <span>{Number(res.baseShare).toFixed(2)}</span>
                </div>

                {res.orders.length > 0 && (
                  <div className="orders-list">
                    <p className="detail-label">Orders</p>
                    <ul>
                      {res.orders.map((o, j) => (
                        <li key={`order-${j}-${o.orderName}`}>
                          <span>{o.orderName || "Item"}</span>
                          <span>{Number(o.cost).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {res.discountAmount > 0 && (
                  <div className="detail-row discount-row">
                    <span>Discount</span>
                    <span>-{Number(res.discountAmount).toFixed(2)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DisplayResults;
