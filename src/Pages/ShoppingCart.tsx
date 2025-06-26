import React from "react";
import CartSummary from "../Components/Page/Cart/CartSummary";
import CartPickupDetails from "../Components/Page/Cart/CartPickupDetails";
import { withAuth } from "../HOC";
import cartItemModel from "../Interfaces/cartItemModel";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../Storage/Redux/store";


function ShoppingCart() {

  const shoppingCartFromStore: cartItemModel[] = useSelector(
    (state: RootState) => state.shoppingCartStore.cartItems ?? []
  );
  return (
    <div className="row w-100" style={{ marginTop: "10px" }}>
      <div className="col-lg-6 col-12" style={{ fontWeight: 300 }}>
        <CartSummary />
      </div>

      {/* <div className="col-lg-6 col-12 p-4 ">
          <CartPickupDetails></CartPickupDetails>
        </div> */}


      {shoppingCartFromStore.length > 0 ? (
        <div className="col-lg-6 col-12 p-4 ">
          <CartPickupDetails></CartPickupDetails>
        </div>
      ) : (
        <div className="p-5 text-center text-muted">
          There are no items in your cart. Please add items to continue.
        </div>
      )}

    </div>
  );
}

export default withAuth(ShoppingCart);
