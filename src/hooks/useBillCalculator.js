  import { useState } from "react";

export function useBillCalculator(){
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

    // Add a person to the people list
  const addPerson = () => {
    // Syntax: setterFunction([...array, {items to be added to the list}]) | Note: [...peopleList] creates a new array but copies all items already inside the array. 
    setPeopleList([...peopleList, { name: '', orders: [], discount: '', paymentStatus: 'Not Paid', amountPaid: '' }]); 
  };

  // Delete a person
  const deletePerson = (personIndex) => {
    const updatedPeople = peopleList.filter((_, i) => i !== personIndex); // Note: .filter creates a new array, if it does not match the personIndex (to delete), it keeps it in the array.  
    setPeopleList(updatedPeople); // Sets the people list to the updated list
    if (updatedPeople.length === 0) setSeparatePayment(false); // If there are no people, there are no separation of payments
  };

  // Add order to a person
  const addOrder = (personIndex) => { // personIndex receives the person's index in the array
    setPeopleList(peopleList.map((person, i) => // Note: .map takes the people list. | person = current item in the list and their data, i = position of the person in the list
      i === personIndex ? {...person, orders: [...person.orders, { orderName: '', cost: '' }] } : person // checks if the personIndex matches a person in the people list
      // If it matches, it keeps their name, orders (but adds another empty field to input another order)
    ));
  };

  // Deletes a person's order
  const deleteOrder = (personIndex, orderIndex) => {
    setPeopleList(peopleList.map((person, i) => // Same as addOrder
      i === personIndex ? { ...person, orders: person.orders.filter((_, j) => j !== orderIndex) } : person // Same as addOrder but this filters orders (filters mentioned earlier)
    ));
  };

  /*
    Updating
      For person, discount, payment status, it takes the personIndex and value (of changed input). Map does its thing and after that, it changes the value for the variable needed.
      For update order, it maps the person's orders, sees if the item in the array matches the index, and changes the value of what will match.
  */

  const updatePersonName = (personIndex, value) => {
    setPeopleList(peopleList.map((person, i) => i === personIndex ? { ...person, name: value} : person));
  };

  const updateDiscount = (personIndex, value) => {
    setPeopleList(peopleList.map((person, i) => i === personIndex ? { ...person, discount: value } : person));
  };

  const updatePaymentStatus = (personIndex, value) => {
    setPeopleList(peopleList.map((person, i) => i === personIndex ? { ...person, paymentStatus: value } : person));
  };

  const updateAmountPaid = (personIndex, value) => {
    setPeopleList(peopleList.map((person, i) => i === personIndex ? { ...person, amountPaid: value } : person));
  };

  const updateOrder = (personIndex, orderIndex, field, value) => {
    setPeopleList(peopleList.map((person, i) =>
      i === personIndex ? { ...person, orders: person.orders.map((order, j) => j === orderIndex ? { ...order, [field]: value } : order) } : person
    ));
};

  
  // The fun part
  const calculateReceipt = () => {
    const bill = Number(billAmount) || 0; // Takes the input for bill, if none, it will be set to 0. 
    const people = Math.max(Number(numberOfPeople), peopleList.length); // Takes the input for people, if none, it will be set to 0. 

    const totalExtrasCost = peopleList.reduce((total, person) => { // Note: .reduce iterates through an array and reduces it to a single value. For example, it looks at all the items values in the array and adds all of them, making it an integer. 
      // ^^ This is the reduce for all the people splitting the bill. Total is the accumulator (the one that holds the value for what you are adding). | Person gets the value of an individual, connected to another reduce below.
      return total + person.orders.reduce((sum, order) => sum + (Number(order.cost) || 0), 0); // Reduce for their individual orders: sum = accumulated values of extra order each iteration. It is added by the costs of the extra order. If no extra orders, its initial value is 0.
      // The bottom line here is that, the second .reduce gets the sum of an individual's orders(array), and adds it to total (Total costs of all extra orders of ALL INDIVIDUALS). First .reduce makes sure to loop through every person(another array).
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
          discountAmount: discount 
        };
      });

      setResults(finalResults); // Setter
    } else {
      setResults([]); // Empty array if there are no separate orders.
    }
    
    setCalculated(true);
  };

  return {
    billAmount,
    numberOfPeople,
    separatePayment,
    peopleList,
    results,
    splitShare,
    calculated,
    
    setBillAmount,
    setNumberOfPeople,
    setSeparatePayment,
    
    addPerson,
    deletePerson,
    updatePersonName,
    updateDiscount,
    updatePaymentStatus,
    updateAmountPaid,
    addOrder,
    deleteOrder,
    updateOrder,
    calculateReceipt
  };
}
  