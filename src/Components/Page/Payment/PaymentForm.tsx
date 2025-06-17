import { useStripe,PaymentElement,useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import { toastNotify } from "../../../Helper";
import { orderSummaryProps } from "../Order/orderSummaryProps";
import { apiResponse, cartItemModel } from "../../../Interfaces";
import { useCreateOrderMutation } from "../../../Apis/orderApi";
import { SD_Status } from "../../../Utility/SD";
import { useNavigate } from "react-router-dom";
const PaymentForm = ({data,userInput}:orderSummaryProps) =>{
    const stripe = useStripe();
    const elements = useElements();
    const [createOrder] = useCreateOrderMutation();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const handleSubmit = async (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    

    if(!stripe || !elements){
        return;
    }
    setIsProcessing(true);
    const result = await stripe.confirmPayment({
        elements,
        confirmParams:{
            return_url: "https://example.com/order/123/complete",
        },
        redirect:"if_required",
    });

    if(result.error){
        toastNotify("An unexpected error occured.", "error");
        setIsProcessing(false);
    }
    else{
        //console.log(result);


        let grandTotal = 0;
        let totalItems = 0;
        const orderDetailsDTO: any =[];
        data.cartItems?.forEach((item:cartItemModel)=>{
            const tempOrderDetail: any ={};
            tempOrderDetail["menuItemId"]=item.menuItem?.id;
            tempOrderDetail["quantity"]=item.quantity
            tempOrderDetail["itemName"]=item.menuItem?.name
            tempOrderDetail["price"]=item.menuItem?.price
            orderDetailsDTO.push(tempOrderDetail);
            grandTotal += (item.quantity! * item.menuItem?.price!);
            totalItems += item.quantity!;
        });

        const response: apiResponse = await createOrder({
            pickupName: userInput.name,
            pickupPhoneNumber:userInput.phoneNumber,
            pickupEmail: userInput.email,
            totalItems: totalItems,
            orderTotal: grandTotal,
            orderDetailsDTO: orderDetailsDTO,
            stripePaymentIntentID : data.stripePaymentIntentId,
            applicationUserId: data.userId,
            status: result.paymentIntent.status === "succeeded"? SD_Status.CONFIRMED: SD_Status.PENDING
        });
        //console.log(response);

        if(response){
            if(response.data?.result.status===SD_Status.CONFIRMED){
                navigate(
                    `/order/orderConfirmed/${response.data.result.orderHeaderId}`
                );
            }
            else{
                navigate("/failed");
            }
        }
    }
    setIsProcessing(false);
};


    return(
        <form onSubmit={handleSubmit}> 
            <PaymentElement></PaymentElement>
            <button disabled={!stripe || isProcessing} 
            className="btn btn-success mt-5 w-100">
                <span id="button-text">
                    {isProcessing ? "Processing..." : "Submit Order"}
                </span>
            </button>
        </form>
    );
};

export default PaymentForm;