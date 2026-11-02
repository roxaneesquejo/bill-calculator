import { useBillCalculator } from "./hooks/useBillCalculator";
import PersonCard from "./components/Person";
import DisplayResults from "./components/DisplayResults";
import TrackPayments from "./components/TrackPayments";
import "./styles/App.css";
import "./styles/index.css";
import splitLogo from "./assets/splitLogo.png";
import { useRef, useState } from "react";

function BillCalculator() {
  const {
    billAmount,
    setBillAmount,
    numberOfPeople,
    setNumberOfPeople,
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
  } = useBillCalculator();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState("calculator");

  const handleAddPerson = () => {
    addPerson();
    setNumberOfPeople((prev) => Number(prev) + 1);
  };

  const handleRemovePerson = () => {
    if (numberOfPeople > 1) {
      deletePerson();
      setNumberOfPeople((prev) => Number(prev) - 1);
    }
  };

  const handleInputPerson = (e) => {
    const num = Number(e.target.value);
    if (num < 1) return;

    setNumberOfPeople(num);

    const diff = num - peopleList.length;
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        addPerson();
      }
    } else if (diff < 0) {
      for (let i = 0; i < Math.abs(diff); i++) {
        deletePerson(peopleList.length - 1 - i);
      }
    }
  };

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
                  <button
                    className="calculator-opt"
                    onClick={() => setSelectedMode("calculator")}
                  >
                    Calculator
                  </button>
                  
                  <button 
                    className="people-opt"
                    onClick={() => {
                      setSelectedMode("people");
                      separatePayment(true);
                    }}
                  >
                    People
                  </button>
                  
                  <button 
                    className="track-opt"
                    onClick={() => setSelectedMode("payments")}
                  >
                    Track Payments
                  </button>
                </div>

                {selectedMode === 'calculator' && (
                  <div className="calculator-div">
                    <label>Total Bill Amount</label>
                    <input
                      type="number"
                      value={billAmount}
                      onChange={(e) => setBillAmount(e.target.value)}
                    />

                    <label>Number of People</label>
                    <button
                      className="minus-button"
                      onClick={handleRemovePerson}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={numberOfPeople}
                      onChange={handleInputPerson}
                    />

                    <button className="plus-button"
                    onClick={handleAddPerson}>
                      +
                    </button>

                    {calculated && (
                      <>
                        <DisplayResults
                          results={results}
                          splitShare={splitShare}
                          separatePayment={separatePayment}
                        />
                    
                      </>
                    )}

                    <div className="button-group">
                      <button className="calculate-btn" onClick={calculateReceipt}>
                        Calculate Receipt
                      </button>
                      <button className="reset-btn" onClick={resetCalculator}>
                        Reset
                      </button>
                    </div>
                    
                  </div>
                )}

                {selectedMode === 'people' && (
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
                    <button id="add-person-btn" onClick={handleAddPerson}>
                      Add Person
                    </button>
                  </div>
                )}

                {selectedMode === 'payments' && (
                  <TrackPayments
                    peopleList={peopleList}
                    results={results}
                    updatePaymentStatus={updatePaymentStatus}
                    updateAmountPaid={updateAmountPaid}
                  />
                )}
              </div>


            </div>
          </div>
        </div>  
      )}
    </>
  );
}

export default BillCalculator;
