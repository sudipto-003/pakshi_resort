import React from "react";

function FoodItem({ id, type, name, desc, price, available, selectAfood, foodTypes }) {
  return (
    <div className="foodItem" onClick={() => selectAfood(id, type, name, desc, price, available, foodTypes)}>
        <div className="id">{id}</div>
      <div className="name">{name}</div>
      <div className="desc">{desc.length === 0 ? "........" : desc}</div>
      <div className="price">{price} ৳</div>
    </div>
  );
}

export default FoodItem;
