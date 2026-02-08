import { useBillCalculator } from './hooks/useBillCalculator'; 
import PersonCard from './components/Person';
import DisplayResults from './components/DisplayResults'; 
import TrackPayments from './components/TrackPayments';
import './styles/App.css';
import './styles/index.css';
import splitLogo from './assets/splitLogo.png';

function BillCalculator() {

  const {
    billAmount, setBillAmount,
    numberOfPeople, setNumberOfPeople,
    separatePayment, setSeparatePayment,
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
    resetCalculator
  } = useBillCalculator();

  return (
    <div className="container">
        <img src={splitLogo} className='splitLogo' alt="Split Logo"/> 
        
        <div>
          <label>Total Bill Amount</label>
          <input type="number" value={billAmount} onChange={(e) => setBillAmount(e.target.value)}/>

          <label>Number of People</label>
          <input type="number" value={numberOfPeople} onChange={(e) => setNumberOfPeople(e.target.value)} disabled={separatePayment}/>
          <div className="separate-checkbox">
           <input type="checkbox" checked={separatePayment} onChange={(e) => {
              setSeparatePayment(e.target.checked);
                if (e.target.checked) {
                  setNumberOfPeople('');
                }
              }}
            />
            <label>Separate Payment</label>
          </div>

         {separatePayment && (
            <div className="extra-people-list">
              {peopleList.map((person, personIndex) => (
                <PersonCard
                  key={personIndex}
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
              <button id="add-person-btn" onClick={addPerson}>Add Person</button>
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
      </div>
      
      {calculated && (
        <>
          <DisplayResults results={results} splitShare={splitShare} separatePayment={separatePayment}/>

          <TrackPayments 
            peopleList={peopleList} 
            results={results} 
            updatePaymentStatus={updatePaymentStatus} 
            updateAmountPaid={updateAmountPaid}
          />
        </>
      )}

      <div className="about">by RK-ADE</div>
    </div>
  );
}

export default BillCalculator;