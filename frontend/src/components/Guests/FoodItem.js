import React from "react";
import { connect } from "react-redux";
import {addFoodToBasket} from '../../redux/foods/foodAction'
import { lock, unlock } from "../../assets/images/SVG";

function FoodItem({ id, name, desc, available, price, addFoodToBasket }) {
  const addForOrder = () => {
    if(available){
      addFoodToBasket({id, name, price, quantity: 1, note: ""});
    }
  }
  return (
    <div 
      className={available ? "foodItem" : "foodItem disabled"} 
      onClick={addForOrder}
    >
      <div className="name">{name}</div>
      <div className="desc">{desc.length === 0 ? "........" : desc}</div>
      <div className="price">{price}</div>
      <div className={available ? "status unlock" : "status lock"}>
        {available ? unlock : lock}
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return { addFoodToBasket: (data) => {dispatch(addFoodToBasket(data))}, };
};
export default connect(null, mapDispatchToProps)(FoodItem);
