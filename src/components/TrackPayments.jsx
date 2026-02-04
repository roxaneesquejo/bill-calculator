import { useState } from 'react';

function TrackPayments({ peopleList, results, updatePaymentStatus, updateAmountPaid }) {
  const [showTracker, setShowTracker] = useState(false);

  return (
    <>
      <button 
        className="track-btn" 
        onClick={() => setShowTracker(!showTracker)}
      >
        {showTracker ? "Hide Tracker" : "Track Payments"}
      </button>

      {showTracker && (
        <div className="payment-tracker-container">
          <h3>Payment Tracker</h3>
          {peopleList.map((person, i) => {
            const personResult = results && results[i];
            const totalToPay = personResult ? personResult.total : 0;
            const amountPaid = Number(person.amountPaid) || 0;
            const balance = totalToPay - amountPaid;

            return (
              <div key={i}>
                
                <div>
                  <span>{person.name || "Unnamed"}</span>
                  <select 
                    value={person.paymentStatus} 
                    onChange={(e) => updatePaymentStatus(i, e.target.value)}
                  >
                    <option value="Not Paid">Not Paid</option>
                    <option value="Paid Partially">Paid Partially</option>
                    <option value="Paid">Paid</option>
                    <option value="Change Given">Change Given</option>
                  </select>
                </div>

                <div>
                  <input type="number" placeholder="Amount Paid" value={person.amountPaid} onChange={(e) => updateAmountPaid(i, e.target.value)}/>
                  
                  <span>
                    {totalToPay === 0 ? (
                      <span>(Calculate receipt first)</span>
                    ) : balance > 0.01 ? (
                      `To Pay: ${balance.toFixed(2)}`
                    ) : balance < -0.01 ? (
                      `Change: ${Math.abs(balance).toFixed(2)}`
                    ) : (
                      <span>Settled</span>
                    )}
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default TrackPayments;