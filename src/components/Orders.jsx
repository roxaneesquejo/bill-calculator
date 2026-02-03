// This basically gets values via user input from the html.

function Orders({ 
  order, 
  oIndex, 
  pIndex, 
  updateOrder, 
  deleteOrder 
}) {
  return (
    <div className="order-row">
      <input placeholder="Item" value={order.orderName} onChange={(e) => updateOrder(pIndex, oIndex, 'orderName', e.target.value)}/>
      <input type="number" placeholder="Cost" value={order.cost} onChange={(e) => updateOrder(pIndex, oIndex, 'cost', e.target.value)} />
      <button onClick={() => deleteOrder(pIndex, oIndex)}>Delete Item</button>
    </div>
  );
}

export default Orders;