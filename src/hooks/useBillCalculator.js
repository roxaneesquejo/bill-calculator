import { useState, useCallback } from "react";

export function useBillCalculator() {
  // syntax: const [variable, function to set value to variable] = setInitialValue(value);

  // These are for user inputs
  const [billAmount, setBillAmount] = useState(""); // Input and set bill amount
  const [numberOfPeople, setNumberOfPeople] = useState("1"); // Input and set number of people

  // These are for calculations
  const [peopleList, setPeopleList] = useState([
    {
      name: "",
      orders: [],
      discount: "",
      paymentStatus: "Not Paid",
      amountPaid: "",
    },
  ]); // Array/people list
  
  // Add a person to the people list
  const addPerson = () => {
    // Syntax: setterFunction([...array, {items to be added to the list}]) | Note: [...peopleList] creates a new array but copies all items already inside the array.
    setPeopleList((currentPeople) => [
      ...currentPeople,
      {
        name: "",
        orders: [],
        discount: "",
        paymentStatus: "Not Paid",
        amountPaid: "",
      },
    ]);
  };

  // Delete a person
  const deletePerson = (personIndex) => {
    setPeopleList((currentPeople) => currentPeople.filter((_, i) => i !== personIndex),);
  };

  // Add order to a person
  const addOrder = (personIndex) => {
    // personIndex receives the person's index in the array
    setPeopleList(
      peopleList.map(
        (
          person,
          i, // Note: .map takes the people list. | person = current item in the list and their data, i = position of the person in the list
        ) =>
          i === personIndex
            ? {
                ...person,
                orders: [...person.orders, { orderName: "", cost: "" }],
              }
            : person, // checks if the personIndex matches a person in the people list
        // If it matches, it keeps their name, orders (but adds another empty field to input another order)
      ),
    );
  };

  // Deletes a person's order
  const deleteOrder = (personIndex, orderIndex) => {
    setPeopleList(
      peopleList.map(
        (
          person,
          i, // Same as addOrder
        ) =>
          i === personIndex
            ? {
                ...person,
                orders: person.orders.filter((_, j) => j !== orderIndex),
              }
            : person, // Same as addOrder but this filters orders (filters mentioned earlier)
      ),
    );
  };

  /*
    Updating
      For person, discount, payment status, it takes the personIndex and value (of changed input). Map does its thing and after that, it changes the value for the variable needed.
      For update order, it maps the person's orders, sees if the item in the array matches the index, and changes the value of what will match.
  */

  // Helper function to update a specific field for a person
  const updatePerson = (personIndex, field, value) => {
    setPeopleList(
      peopleList.map((person, i) =>
        i === personIndex ? { ...person, [field]: value } : person,
      ),
    );
  };

  const updatePersonName = (personIndex, value) =>
    updatePerson(personIndex, "name", value);

  const updateDiscount = (personIndex, value) =>
    updatePerson(personIndex, "discount", value);

  const updatePaymentStatus = (personIndex, value) =>
    updatePerson(personIndex, "paymentStatus", value);

  const updateAmountPaid = (personIndex, value) =>
    updatePerson(personIndex, "amountPaid", value);

  const updateOrder = (personIndex, orderIndex, field, value) => {
    setPeopleList(
      peopleList.map((person, i) =>
        i === personIndex
          ? {
              ...person,
              orders: person.orders.map((order, j) =>
                j === orderIndex ? { ...order, [field]: value } : order,
              ),
            }
          : person,
      ),
    );
  };

  // The fun part
  const calculateReceipt = useCallback(() => {
    const bill = Number(billAmount) || 0; // Takes the input for bill, if none, it will be set to 0.
    const people = Math.max(Number(numberOfPeople), peopleList.length); // Takes the input for people, if none, it will be set to 0.

    const totalExtrasCost = peopleList.reduce((total, person) => {
      // Note: .reduce iterates through an array and reduces it to a single value. For example, it looks at all the items values in the array and adds all of them, making it an integer.
      // ^^ This is the reduce for all the people splitting the bill. Total is the accumulator (the one that holds the value for what you are adding). | Person gets the value of an individual, connected to another reduce below.
      return (
        total + person.orders.reduce((sum, order) => sum + (Number(order.cost) || 0), 0)
      ); // Reduce for their individual orders: sum = accumulated values of extra order each iteration. It is added by the costs of the extra order. If no extra orders, its initial value is 0.
      // The bottom line here is that, the second .reduce gets the sum of an individual's orders(array), and adds it to total (Total costs of all extra orders of ALL INDIVIDUALS). First .reduce makes sure to loop through every person(another array).
    }, 0);

    const remainingBill = Math.max(0, bill - totalExtrasCost); // The total bill is subtracted by the extra order costs, to get the share of those who did not get an extra order.
    const baseShare = people > 0 ? remainingBill / people : 0; // The base share is calculated by dividing the remaining bill by the number of people. It is 0 if no people.

    // Calculate each person's share before applying individual discounts
    const grossResults = peopleList.map((person, personIndex) => {
      const extraTotal = person.orders.reduce(
        (sum, order) => sum + (Number(order.cost) || 0),
        0,
      ); // Gets the total cost of a person's orders.
      const personGrossTotal = baseShare + extraTotal; // Calculates the cost of share plus the separate orders.

      // This is to handle discounts whether it is a whole number or a percentage.
      let discount = 0;
      const discountInput = String(person.discount).trim();

      if (discountInput.includes("%")) {
        // To check if whole number or percentage
        const percentage = parseFloat(discountInput.replace("%", "")); // Removes the percentage symbol, because we only need the numbers for float.
        if (!isNaN(percentage)) {
          discount = baseShare * (percentage / 100); // This makes sure people with discount only apply to the person's base share.
        }
      } else {
        discount = parseFloat(discountInput) || 0; // If not percentage, just get the whole number
      }

      return {
        name: person.name || `Person ${personIndex + 1}`,
        grossTotal: personGrossTotal,
        baseShare,
        orders: person.orders,
        discountAmount: Math.min(Math.max(0, discount), baseShare),
      };
    });

    const totalDiscount = grossResults.reduce(
      (total, person) => total + person.discountAmount,
      0,
    );

    const peopleWithoutDiscount = grossResults.filter((person) => person.discountAmount === 0,).length;
    const discountShare = peopleWithoutDiscount > 0 ? totalDiscount / peopleWithoutDiscount : 0;

    const results = grossResults.map((person) => ({
      name: person.name,
      total: person.grossTotal - person.discountAmount + (person.discountAmount === 0 ? discountShare : 0),
      baseShare: person.baseShare,
      orders: person.orders,
      discountAmount: person.discountAmount,
    }));

    return { results, splitShare: baseShare };
  }, [billAmount, numberOfPeople, peopleList]);

  const calculation = calculateReceipt();
  
  const resetCalculator = () => {
    setBillAmount("");
    setNumberOfPeople("1");
    setPeopleList([]);
  };

  return {
    billAmount,
    numberOfPeople,
    peopleList,
    results: calculation.results,
    splitShare: calculation.splitShare,

    setBillAmount,
    setNumberOfPeople,

    addPerson,
    deletePerson,
    updatePersonName,
    updateDiscount,
    updatePaymentStatus,
    updateAmountPaid,
    addOrder,
    deleteOrder,
    updateOrder,
    calculateReceipt,
    resetCalculator,
  };
}
