import { useState } from 'react';
import './App.css';
import PersonCard from './components/Person';
import DisplayResults from './components/DisplayResults'; 
import TrackPayments from './components/TrackPayments';// Hello if you're reading this! I will walk you through the code because I learn better this way :P

function BillCalculator() {

  // syntax: const [variable, function to set value to variable] = setInitialValue(value);

  // These are for user inputs
  const [billAmount, setBillAmount] = useState(''); // Input and set bill amount
  const [numberOfPeople, setNumberOfPeople] = useState(''); // Input and set number of people
  const [separatePayment, setSeparatePayment] = useState(false); // Check if there are separate payments

  // These are for calculations
  const [peopleList, setPeopleList] = useState([]); // Array/people list of separate payments
  const [results, setResults] = useState([]); // Results array (it is an array because we want to calculate the results of every individual)
  const [splitShare, setSplitShare] = useState(0); // Calculate the amount to be splitted by everyone
  const [calculated, setCalculated] = useState(false); // For results to show when "Calculate Button" is clicked

  const [showPaymentTracker, setShowPaymentTracker] = useState(false);

  // Add a person to the people list
  const addPerson = () => {
    // Syntax: setterFunction([...array, {items to be added to the list}]) | Note: [...peopleList] creates a new array but copies all items already inside the array. 
    setPeopleList([...peopleList, { name: '', orders: [], discount: '', paymentStatus: 'Not Paid', amountPaid: '' }]); 
  };

  // Delete a person
  const deletePerson = (pIndex) => {
    const updatedPeople = peopleList.filter((_, i) => i !== pIndex); // Note: .filter creates a new array, if it does not match the personIndex (to delete), it keeps it in the array.  
    setPeopleList(updatedPeople); // Sets the people list to the updated list
    if (updatedPeople.length === 0) setSeparatePayment(false); // If there are no people, there are no separation of payments
  };

  // Add order to a person
  const addOrder = (pIndex) => { // pIndex receives the person's index in the array
    setPeopleList(peopleList.map((person, i) => // Note: .map takes the people list. | person = current item in the list and their data, i = position of the person in the list
      i === pIndex ? {...person, orders: [...person.orders, { orderName: '', cost: '' }] } : person // checks if the pIndex matches a person in the people list
      // If it matches, it keeps their name, orders (but adds another empty field to input another order)
    ));
  };

  // Deletes a person's order
  const deleteOrder = (pIndex, oIndex) => {
    setPeopleList(peopleList.map((person, i) => // Same as addOrder
      i === pIndex ? { ...person, orders: person.orders.filter((_, j) => j !== oIndex) } : person // Same as addOrder but this filters orders (filters mentioned earlier)
    ));
  };

  /*
    Updating
      For person, discount, payment status, it takes the personIndex and value (of changed input). Map does its thing and after that, it changes the value for the variable needed.
      For update order, it maps the person's orders, sees if the item in the array matches the index, and changes the value of what will match.
  */

  const updatePersonName = (pIndex, value) => {
    setPeopleList(peopleList.map((person, i) => i === pIndex ? { ...person, name: value} : person));
  };

  const updateDiscount = (pIndex, value) => {
    setPeopleList(peopleList.map((person, i) => i === pIndex ? { ...person, discount: value } : person));
  };

  const updatePaymentStatus = (pIndex, value) => {
    setPeopleList(peopleList.map((person, i) => i === pIndex ? { ...person, paymentStatus: value } : person));
  };

  const updateAmountPaid = (pIndex, value) => {
    setPeopleList(peopleList.map((person, i) => i === pIndex ? { ...person, amountPaid: value } : person));
  };

  const updateOrder = (pIndex, oIndex, field, value) => {
    setPeopleList(peopleList.map((person, i) =>
      i === pIndex ? { ...person, orders: person.orders.map((order, j) => j === oIndex ? { ...order, [field]: value } : order) } : person
    ));
  };

  // The fun part
  const calculateReceipt = () => {
    const bill = Number(billAmount) || 0; // Takes the input for bill, if none, it will be set to 0. 
    const people = Math.max(Number(numberOfPeople), peopleList.length); // Takes the input for people, if none, it will be set to 0. 

    const totalExtrasCost = peopleList.reduce((total, person) => { // Note: .reduce iterates through an array and reduces it to a single value. For example, it looks at all the items values in the array and adds all of them, making it an integer. 
      // ^^ This is the reduce for all the people splitting the bill. Total is the accumulator (the one that holds the value for what you are adding). | Person gets the value of an individual, connected to another reduce below.
      return total + person.orders.reduce((sum, order) => sum + (Number(order.cost) || 0), 0); // Reduce for their individual orders: sum = accumulated values of extra order each iteration. It is added by the costs of the extra order. If no extra orders, its initial value is 0.
      // The bottomline here is that, the second .reduce gets the sum of an individual's orders(array), and adds it to total (Total costs of all extra orders of ALL INDIVIDUALS). First .reduce makes sure to loop through every person(another array).
    }, 0); 

    const remainingBill = Math.max(0, bill - totalExtrasCost); // The total bill is subtracted by the extra order costs, to get the share of those who did not get an extra order.
    const baseShare = people > 0 ? remainingBill / people : 0; // The base share is calculated by dividing the remaining bill by the number of people. It is 0 if no people.
    
    setSplitShare(baseShare); // Setter

    // Calculates the share of those with extra orders.
    if (separatePayment) {
        const finalResults = peopleList.map(person => {
        const extraTotal = person.orders.reduce((sum, order) => sum + (Number(order.cost) || 0), 0); // Gets the total cost of a person's orders.
        const personGrossTotal = baseShare + extraTotal; // Calculates the cost of share plus the separate orders.

        // This is to handle discounts whether it is a whole number or a percentage.
        let discount = 0;
        const discountInput = String(person.discount).trim();

        if (discountInput.includes('%')) { // To check if whole number or percentage
          const percentage = parseFloat(discountInput.replace('%', '')); // Removes the percentage symbol, because we only need the numbers for float.
          if (!isNaN(percentage)) { 
            discount = personGrossTotal * (percentage / 100); // If it is a percentage, get how much is discounted.
          }
        } else {
          discount = parseFloat(discountInput) || 0; // If not percentage, just get the whole number
        }

        return {
          name: person.name || "Unnamed",
          total: Math.max(0, personGrossTotal - discount),
          baseShare: baseShare,                 
          orders: person.orders,               
          discount: discount       
        };
      });

      setResults(finalResults); // Setter
    } else {
      setResults([]); // Empty array if there are no separate orders.
    }
    
    setCalculated(true);
  };

  return (
    <div className="container">
        <div>
          <label>Total Bill Amount</label>
          <input type="number" value={billAmount} onChange={(e) => setBillAmount(e.target.value)}/>

          <label>Number of People</label>
          <input type="number" value={numberOfPeople} onChange={(e) => setNumberOfPeople(e.target.value)}/>

          <div className="extra-checkbox">
            <input type="checkbox" checked={separatePayment} onChange={(e) => setSeparatePayment(e.target.checked)}/>
            <label>Separate Payment</label>
          </div>

         {separatePayment && (
            <div className="extra-people-list">
              {peopleList.map((person, pIndex) => (
                <PersonCard
                  key={pIndex}
                  pIndex={pIndex}
                  person={person}
                  deletePerson={deletePerson}
                  updatePersonName={updatePersonName}
                  updateDiscount={updateDiscount}
                  addOrder={addOrder}
                  updateOrder={updateOrder}
                  deleteOrder={deleteOrder}
                />
              ))}
              <button className="add-person-btn" onClick={addPerson}>Add Person</button>
            </div>
          )}
        </div>

      <button className="calculate-btn" onClick={calculateReceipt}>Calculate Receipt</button>
      {calculated && (
        <DisplayResults results={results} splitShare={splitShare}/>
      )}
      
      <TrackPayments 
        peopleList={peopleList} 
        results={results} 
        updatePaymentStatus={updatePaymentStatus} 
        updateAmountPaid={updateAmountPaid}
      />
    </div>
  );
} 

/* 
  RK Notes:
    * We have a nested array. (Array of People and within them, their array of orders)
    * [...peopleList]: ... creates a new array but copies all items already inside the array (peopleList). 
    * .filter: creates a new array, if it does not match the personIndex (to delete), it keeps it in the array.  
    * .map: takes the people list. (person = current item in the list and their data, i = position of the person in the list)
    * .reduce iterates through an array and reduces it to a single value. For example, it looks at all the items values in the array and adds all of them, making it an integer. 
*/

export default BillCalculator;