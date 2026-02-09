// This basically gets values via user input from the html.

function Orders({ order, orderIndex, personIndex, updateOrder, deleteOrder }) {
  return (
    <div className="order-row">
      <input
        className="input-item"
        placeholder="Item"
        value={order.orderName}
        onChange={(e) =>
          updateOrder(personIndex, orderIndex, "orderName", e.target.value)
        }
      />

      <input
        className="input-cost"
        type="number"
        placeholder="Cost"
        value={order.cost}
        onChange={(e) =>
          updateOrder(personIndex, orderIndex, "cost", e.target.value)
        }
      />
      <button
        className="delete-item-btn"
        onClick={() => deleteOrder(personIndex, orderIndex)}
        title="Remove Item"
      >
        &times;
      </button>
    </div>
  );
}

export default Orders;
