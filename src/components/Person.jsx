import Orders from './Orders'; 

// This basically gets values via user input from the html.

function Person({ 
  person, 
  pIndex, 
  deletePerson, 
  updatePersonName, 
  updateDiscount, 
  addOrder, 
  updateOrder, 
  deleteOrder 
}) {
  return (
    <div className="person-card">
      <button onClick={() => deletePerson(pIndex)}>Delete Person</button>
      <input placeholder="Enter Name" value={person.name} onChange={(e) => updatePersonName(pIndex, e.target.value)}/>
      <input type="text" placeholder="Discount" value={person.discount} onChange={(e) => updateDiscount(pIndex, e.target.value)}/>

      {person.orders.map((order, oIndex) => (
        <Orders key={oIndex}
          order={order}
          oIndex={oIndex}
          pIndex={pIndex}
          updateOrder={updateOrder}
          deleteOrder={deleteOrder}
        />
      ))}
      
      <button onClick={() => addOrder(pIndex)}>Add Item</button>
    </div>
  );
}

export default Person;