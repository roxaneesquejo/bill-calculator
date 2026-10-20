import { useBillCalculator } from "./hooks/useBillCalculator";
import PersonCard from "./components/Person";
import DisplayResults from "./components/DisplayResults";
import TrackPayments from "./components/TrackPayments";
import "./styles/App.css";
import "./styles/index.css";
import splitLogo from "./assets/splitLogo.png";
import { useRef, useState } from "react";
import readXlsxFile from "read-excel-file";

function BillCalculator() {
  const {
    billAmount,
    setBillAmount,
    numberOfPeople,
    setNumberOfPeople,
    setSeparatePayment,
    separatePayment,
    peopleList,
    results,
    splitShare,
    calculated,

    addPerson,
    deletePerson,
    updatePersonName,
    updateDiscount,
    addOrder,
    deleteOrder,
    updateOrder,
    calculateReceipt,
    updatePaymentStatus,
    updateAmountPaid,
    resetCalculator,
    importPaymentData,
  } = useBillCalculator();

  const fileInputRef = useRef(null);

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const rows = await readXlsxFile(file);

      if (!rows || rows.length < 2) {
        throw new Error("File appears to be empty or missing headers.");
      }

      const headers = rows[0].map((h) => String(h).trim().toLowerCase());
      const dataRows = rows.slice(1);

      const nameIndex = headers.indexOf("name");
      const statusIndex = headers.indexOf("status");
      const amountIndex = headers.indexOf("amount paid");
      const totalIndex = headers.indexOf("total bill");
      const discountIndex = headers.indexOf("discount");

      if (nameIndex === -1) {
        throw new Error("Could not find a 'Name' column in the Excel file.");
      }

      const formattedData = dataRows.map((row) => ({
        Name: row[nameIndex],
        Status: statusIndex !== -1 ? row[statusIndex] : undefined,
        "Amount Paid": amountIndex !== -1 ? row[amountIndex] : 0,
        "Total Bill": totalIndex !== -1 ? row[totalIndex] : 0,
        Discount: discountIndex !== -1 ? row[discountIndex] : 0,
      }));

      importPaymentData(formattedData);
      alert("Import Successful!");
    } catch (error) {
      console.error("Import Error:", error);
      alert(`Error reading file: ${error.message}`);
    } finally {
      e.target.value = null;
    }
  };

  const [isOpen, setIsOpen] = useState(false); 

  return (
    <>
      <div className="container">
      
        <div>
          <img src={splitLogo} className="splitLogo" alt="Split Logo" />
          <div className="tagline">good friends do good math</div>  
        </div>

        <div className="button-group">
          <button className="scan-btn">
            Scan Receipt
          </button>
          <button className="manual-btn" onClick={() => setIsOpen(true)}>
            Manual Mode
          </button>
        </div>     
        <div className="about">by RK-ADE</div>
      </div>

      {isOpen && (
        <div className="manual-container">
          <div className="popout-container">
            <div className="calculator-container">
              <button className="close-btn" onClick={() => setIsOpen(false)} aria-label="Close calculator">
                X
              </button>
              <div>
                <div className="options-container">
                  <button className="calculator-opt">Calculator</button>
                  <button className="people-opt">People</button>
                  <button className="track-opt">Track Payments</button>
                </div>
                <label>Total Bill Amount</label>
                <input
                  type="number"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                />

                <label>Number of People</label>
                <input
                  type="number"
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(e.target.value)}
                  disabled={separatePayment}
                />

                {separatePayment && (
                  <div className="extra-people-list">
                    {peopleList.map((person, personIndex) => (
                      <PersonCard
                        key={`person-${personIndex}`}
                        personIndex={personIndex}
                        person={person}
                        deletePerson={deletePerson}
                        updatePersonName={updatePersonName}
                        updateDiscount={updateDiscount}
                        addOrder={addOrder}
                        updateOrder={updateOrder}
                        deleteOrder={deleteOrder}
                      />
                    ))}
                    <button id="add-person-btn" onClick={addPerson}>
                      Add Person
                    </button>
                  </div>
                )}
              </div>

              <div className="button-group">
                <button className="calculate-btn" onClick={calculateReceipt}>
                  Calculate Receipt
                </button>
                <button className="reset-btn" onClick={resetCalculator}>
                  Reset
                </button>
                <button className="import-btn" onClick={handleImportClick}>
                  Import Excel
                </button>
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </div>

              {calculated && (
                <>
                  <DisplayResults
                    results={results}
                    splitShare={splitShare}
                    separatePayment={separatePayment}
                  />

                  <TrackPayments
                    peopleList={peopleList}
                    results={results}
                    updatePaymentStatus={updatePaymentStatus}
                    updateAmountPaid={updateAmountPaid}
                  />
                </>
              )}

            </div>
          </div>
        </div>  
      )}
    </>
  );
}

export default BillCalculator;
