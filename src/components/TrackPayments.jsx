import { useState } from "react";
import writeXlsxFile from "write-excel-file";

function TrackPayments({
  peopleList,
  results,
  updatePaymentStatus,
  updateAmountPaid,
}) {
  const [showTracker, setShowTracker] = useState(false);

  const handleExport = async () => {
    const data = peopleList.map((person, i) => {
      const personResult = results && results[i];
      const totalToPay = personResult ? personResult.total : 0;
      const discountAmount = personResult ? personResult.discountAmount : 0;
      const amountPaid = Number(person.amountPaid) || 0;
      const balance = totalToPay - amountPaid;

      return {
        name: person.name ? String(person.name) : "Unnamed",
        total: Number(totalToPay).toFixed(2),
        discount: Number(discountAmount).toFixed(2),
        amountPaid: amountPaid,
        status: person.paymentStatus
          ? String(person.paymentStatus)
          : "Not Paid",
        balance: Number(balance).toFixed(2),
      };
    });

    const schema = [
      { column: "Name", type: String, value: (row) => row.name, width: 20 },
      {
        column: "Total Bill",
        type: String,
        value: (row) => row.total,
        width: 15,
      },
      {
        column: "Discount",
        type: String,
        value: (row) => row.discount,
        width: 15,
      },
      {
        column: "Amount Paid",
        type: Number,
        value: (row) => row.amountPaid,
        width: 15,
      },
      { 
        column: "Status", 
        type: String, 
        value: (row) => row.status, 
        width: 20 
      },
      {
        column: "Balance",
        type: String,
        value: (row) => row.balance,
        width: 15,
      },
    ];

    await writeXlsxFile(data, {
      schema,
      fileName: "SplitTracker.xlsx",
    });
  };

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
              <div key={`payment-${i}-${person.name}`}>
                <div>
                  <strong>{person.name || "Unnamed"}</strong>
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

                <div className="payment-tracker">
                  <input
                    type="number"
                    placeholder="Amount Paid"
                    value={person.amountPaid}
                    onChange={(e) => updateAmountPaid(i, e.target.value)}
                  />

                  <span className="balance-info">
                    {balance < -0.01 ? (
                      <span className="receive-amount">
                        Receive: {Math.abs(balance).toFixed(2)}
                      </span>
                    ) : balance > 0.01 ? (
                      <span className="owe-amount">
                        To Pay: {balance.toFixed(2)}
                      </span>
                    ) : (
                      <span className="settled">Settled</span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="import-export-btn">
        <button className="export-btn" onClick={handleExport}>
          Export to Excel
        </button>
      </div>
    </>
  );
}

export default TrackPayments;
