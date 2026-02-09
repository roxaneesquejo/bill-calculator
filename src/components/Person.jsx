import Orders from './Orders'; 

// This basically gets values via user input from the html.

function Person({ 
  person, 
  personIndex, 
  deletePerson, 
  updatePersonName, 
  updateDiscount, 
  addOrder, 
  updateOrder, 
  deleteOrder 
}) {
  return (
    <div className="person-card">
      
      <div className="person-header">
        <input 
          className="input-name"
          placeholder="Enter Name" 
          value={person.name} 
          onChange={(e) => updatePersonName(personIndex, e.target.value)}
        />
        <input 
          className="input-discount"
          type="text" 
          placeholder="Discount" 
          value={person.discount} 
          onChange={(e) => updateDiscount(personIndex, e.target.value)}
        />
      </div>

      <div className="person-orders">
        {person.orders.map((order, orderIndex) => (
          <Orders key={`${personIndex}-${orderIndex}`}
            order={order}
            orderIndex={orderIndex}
            personIndex={personIndex}
            updateOrder={updateOrder}
            deleteOrder={deleteOrder}
          />
        ))}
      </div>
      
      <div className="person-footer">
        <button className="person-btn delete-btn" onClick={() => deletePerson(personIndex)}>
           Delete Person
        </button>
        <button className ="person-btn add-btn" onClick={() => addOrder(personIndex)}>
          Add Item
        </button>
      </div>

    </div>
  );
}

export default Person;