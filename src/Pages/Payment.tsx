import React from "react";
import { useLocation } from "react-router";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentForm } from "../Components/Page/Payment";
import { OrderSummary } from "../Components/Page/Order";

function Payment() {
  const {
    state: { apiResult, userInput }, 
  } = useLocation();

  //console.log(apiResult);
  // const location = useLocation();
  // const { apiResult, userInput } = location.state || {};

  const stripePromise = loadStripe(
    "pk_test_51RdE7rDEiHNJGFNIgiKCnaqPL3boRJZvkkHY9pvoQ7MmjU4Ih5cvHhehgOh3F0iF6W9hRf2C7pdawXAv8NqR31R900N2iqMh6P"
  );
  const options = {
    // passing the client secret obtained from the server
    clientSecret: apiResult.clientSecret,
  };
  return (
    <Elements stripe={stripePromise} options={options}>
        <div className="container m-5 p-5">
            <div className="row">
                <div className="col-md-7">
                  <OrderSummary data={apiResult} userInput={userInput}></OrderSummary>
                </div>
                <div className="col-md-4 offset-md-1">
                <h3 className="text-success">Payment</h3>
                <div className="mt-5"></div>
                    <PaymentForm data={apiResult} userInput={userInput}/>
                </div> 
            </div>
        </div>
    </Elements>
  );
}

export default Payment;