import React from "react";
import { apiResponse, cartItemModel } from "../../../Interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../../Storage/Redux/store";
import { useState, useEffect } from "react";
import { inputHelper } from "../../../Helper";
import MiniLoader from "../Common/MiniLoader";
import { useInitiatePaymentMutation } from "../../../Apis/paymentApi";
import { useNavigate } from "react-router-dom";
function CartPickupDetails(){
    const[loading,setLoading]=useState(false);
    const userData = useSelector((state : RootState) => state.userAuthStore);
    const shoppingCartFromStore: cartItemModel[] = useSelector(
        (state: RootState) => state.shoppingCartStore.cartItems ?? []
      );

  
    let grandTotal = 0;
    let totalItems = 0;
    const initialUserData = {
    name: userData.fullName,
    email: userData.email,
    phoneNumber: "",
  };

  shoppingCartFromStore?.map((cartItem: cartItemModel) => {
    totalItems += cartItem.quantity ?? 0;
    grandTotal += (cartItem.menuItem?.price ?? 0) * (cartItem.quantity ?? 0);
    return null;
  });

  const navigate = useNavigate();
  const [userInput, setUserInput] = useState(initialUserData);
  const [initiatePayment] =  useInitiatePaymentMutation();
  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  useEffect(() =>{
    setUserInput({
      name: userData.fullName,
      email: userData.email,
      phoneNumber:"",
    });
  },[userData])

  // ✅ Only check cart length **after all hooks**
  if (shoppingCartFromStore.length === 0) {
    return (
      <div className="p-5 text-center text-muted">
        There are no items in your cart. Please add items to continue.
      </div>
    );
  }

  const handleSubmit= async (e:React.FormEvent<HTMLFormElement>)=> {
    e.preventDefault();
    setLoading(true);

    const {data} :apiResponse = await initiatePayment(userData.id);
    //const orderSummary = {grandTotal , totalItems};
    ///console.log(data);
    navigate("/payment",{
      state: {apiResult: data?.result, userInput},
    });
  };

    return(

        <div className="border pb-5 pt-3">
        <h1 style={{ fontWeight: "300" }} className="text-center text-success">
          Pickup Details
        </h1>
        <hr />
        <form onSubmit={handleSubmit} className="col-10 mx-auto">
          <div className="form-group mt-3">
            Pickup Name
            <input
              type="text"
              value={userInput.name}
              className="form-control"
              placeholder="name..."
              name="name"
              onChange={handleUserInput}
              required
            />
          </div>
          <div className="form-group mt-3">
            Pickup Email
            <input
              type="email"
              value={userInput.email}
              className="form-control"
              placeholder="email..."
              name="email"
              onChange={handleUserInput}
              required
            />
          </div>
  
          <div className="form-group mt-3">
            Pickup Phone Number
            <input
              type="number"
              value={userInput.phoneNumber}
              className="form-control"
              placeholder="phone number..."
              name="phoneNumber"
              onChange={handleUserInput}
              required
            />
          </div>
          <div className="form-group mt-3">
            <div className="card p-3" style={{ background: "ghostwhite" }}>
              <h5>Grand Total : Rs {grandTotal.toFixed(2)}</h5>
              <h5>No of items : {totalItems}</h5>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-lg btn-success form-control mt-3" disabled={loading}  
            // if it is loading button will disabled
          >
            {loading ? <MiniLoader></MiniLoader> : "Looks Good? Place Order!"}
          </button>
        </form>
      </div>
    )
}
export default CartPickupDetails;