import { useState } from 'react';
import './App.css';

function BillCalculator() {
  const [isSplitMode, setIsSplitMode] = useState(true);
  const [billAmount, setBillAmount] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [extraCharge, setExtraCharge] = useState(false);
  const [peopleList, setPeopleList] = useState([]);
  const [results, setResults] = useState([]);
  const [calculated, setCalculated] = useState(false);
  const [splitShare, setSplitShare] = useState(0);

  const addPerson = () => {
    setPeopleList([...peopleList, { name: '', orders: [], discount: '' }]);
  };

  const addOrder = (pIndex) => {
    setPeopleList(peopleList.map((person, i) =>
      i === pIndex ? { ...person, orders: [...person.orders, { orderName: '', cost: '' }] } : person
    ));
  };

  const deleteOrder = (pIndex, oIndex) => {
    setPeopleList(peopleList.map((person, i) =>
      i === pIndex ? { ...person, orders: person.orders.filter((_, j) => j !== oIndex) } : person
    ));
  };

  const deletePerson = (pIndex) => {
    const updatedPeople = peopleList.filter((_, i) => i !== pIndex);
    setPeopleList(updatedPeople);
    if (updatedPeople.length === 0) setExtraCharge(false);
  };

  const updatePersonName = (pIndex, value) => {
    setPeopleList(peopleList.map((person, i) => i === pIndex ? { ...person, name: value } : person));
  };

  const updateDiscount = (pIndex, value) => {
    setPeopleList(peopleList.map((person, i) => i === pIndex ? { ...person, discount: value } : person));
  };

  const updateOrder = (pIndex, oIndex, field, value) => {
    setPeopleList(peopleList.map((person, i) =>
      i === pIndex ? { ...person, orders: person.orders.map((order, j) => j === oIndex ? { ...order, [field]: value } : order) } : person
    ));
  };

  const calculateReceipt = () => {
    const bill = Number(billAmount) || 0;
    const people = Number(numberOfPeople) || 0;

    const totalExtrasCost = peopleList.reduce((total, person) => {
      return total + person.orders.reduce((sum, order) => sum + (Number(order.cost) || 0), 0);
    }, 0);

    const remainingBill = Math.max(0, bill - totalExtrasCost);
    const baseShare = people > 0 ? remainingBill / people : 0;
    
    setSplitShare(baseShare);

    if (extraCharge) {
      const finalResults = peopleList.map(person => {
        const extraTotal = person.orders.reduce((sum, order) => sum + (Number(order.cost) || 0), 0);
        const discount = Number(person.discount) || 0;
        
        return {
          name: person.name || "Unnamed",
          total: Math.max(0, baseShare + extraTotal - discount)
        };
      });

      setResults(finalResults);
    } else {
      setResults([]);
    }
    
    setCalculated(true);
  };

  return (
    <div className="container">
      <div className="mode">
        <button onClick={() => setIsSplitMode(true)}>Split Evenly</button>
        <button onClick={() => setIsSplitMode(false)}>Individual Payment</button>
      </div>

      {isSplitMode && (
        <div className="split-mode">
          <label>Total Bill Amount</label>
          <input type="number" value={billAmount} onChange={(e) => setBillAmount(e.target.value)}/>

          <label>Number of People</label>
          <input type="number" value={numberOfPeople} onChange={(e) => setNumberOfPeople(e.target.value)}/>

          <div className="extra-checkbox">
            <input type="checkbox" checked={extraCharge} onChange={(e) => setExtraCharge(e.target.checked)}/>
            <label>Extra Items</label>
          </div>

          {extraCharge && (
            <div className="extra-people-list">
              {peopleList.map((person, pIndex) => (
                <div key={pIndex} className="person-card">
                  <button onClick={() => deletePerson(pIndex)}>Delete Person</button>
                  <input placeholder="Enter Name" value={person.name} onChange={(e) => updatePersonName(pIndex, e.target.value)} />
                  <input type="number" placeholder="Discount" value={person.discount} onChange={(e) => updateDiscount(pIndex, e.target.value)} />

                  {person.orders.map((order, oIndex) => (
                    <div key={oIndex} className="order-row">
                      <input placeholder="Item" value={order.orderName} onChange={(e) => updateOrder(pIndex, oIndex, 'orderName', e.target.value)} />
                      <input type="number" placeholder="Cost" value={order.cost} onChange={(e) => updateOrder(pIndex, oIndex, 'cost', e.target.value)} />
                      <button onClick={() => deleteOrder(pIndex, oIndex)}>Delete Item</button>
                    </div>
                  ))}
                  <button onClick={() => addOrder(pIndex)}>Add Item</button>
                </div>
              ))}
              <button className="add-person-btn" onClick={addPerson}>Add Person</button>
            </div>
          )}
        </div>
      )}

      {!isSplitMode && <div>Wala pa hehe next next commit n lang awa n lang</div>}

      <button className="calculate-btn" onClick={calculateReceipt}>Calculate Receipt</button>

      {calculated && (
        <div className="results-display">
          <h3>Final</h3>
          {results.map((res, i) => (
            <p key={i}>{res.name}: {res.total.toFixed(2)}</p>
          ))}
          <p>Standard Share (Others): {splitShare.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
}

export default BillCalculator;