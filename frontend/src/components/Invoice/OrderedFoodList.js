import React from "react";
import { rsvg } from "../../assets/images/SVG";

function OrderedFoodList({ orderedFoods }) {
  return (
    <>
      <h2>Ordered Foods</h2>
      <div className="table">
        <div className="table-heading">
          <div className="name">Name {rsvg}</div>
          <div className="type">Type {rsvg}</div>
          <div className="quantity">Quantity {rsvg}</div>
          <div className="price">Price{rsvg}</div>
          <div className="total">Price{rsvg}</div>
        </div>

        {orderedFoods &&
          orderedFoods.map((food) => (
            <div className="orderItem">
              <div className="name">{food.food.name}</div>
              <div className="type">{food.food.food_type}</div>
              <div className="quantity">{food.quantity}</div>
              <div className="price">{food.order_price}</div>
              <div className="total">{food.total}</div>
            </div>
          ))}
      </div>
      <button className="payforFood">Pay for Foods</button>
    </>
  );
}

export default OrderedFoodList;
