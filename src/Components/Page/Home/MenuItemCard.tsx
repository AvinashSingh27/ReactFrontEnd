import React from "react";
import { apiResponse, menuItemModel } from "../../../Interfaces";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useUpdateShoppingCartMutation } from "../../../Apis/shoppingCartApi";
import MiniLoader from "../Common/MiniLoader";
import { toastNotify } from "../../../Helper";
import { useSelector } from "react-redux";
import { RootState } from "../../../Storage/Redux/store";
import { useNavigate } from "react-router-dom";
// import { MiniLoader } from "../Common";

interface Props{
    menuItem:menuItemModel;
}

function MenuItemCard(props: Props){

  //console.log("Image path:", props.menuItem.imagePath);

  const navigate = useNavigate();
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [updateShoppingCart] = useUpdateShoppingCartMutation();
  const userData = useSelector((state : RootState) => state.userAuthStore);

  const handleAddToCart = async (menuItemId: number) => {
    if(!userData.id)
    {
      navigate("/login");
      return;
    }
    setIsAddingToCart(true);

    const response : apiResponse = await updateShoppingCart({
      menuItemId:menuItemId,
      updateQuantityBy:1,
      userId:userData.id,
    });
    if(response.data && response.data.isSuccess){
      toastNotify("Item addded to cart successfully!");
    }
    //console.log(response);
    setIsAddingToCart(false);
  };


    return(
        <div className="col-md-4 col-12 p-4">
      <div
        className="card"
        style={{ boxShadow: "0 1px 7px 0 rgb(0 0 0 / 50%)" }}
      >
        <div className="card-body pt-2">
          <div className="row col-10 offset-1 p-4">
            <Link to={`/menuItemDetails/${props.menuItem.id}`}>
            {/* ABOVE ONE */}
            <img
              src={props.menuItem.imagePath}
              style={{ borderRadius: "50%" }}
              alt="Hi"
              className="w-100 mt-5 image-box"
            />
            </Link>   
          </div>
        {props.menuItem.specialTag && props.menuItem.specialTag.length>0 && (
            <i
            className="bi bi-star btn btn-success"
            style={{
              position: "absolute",
              top: "15px",
              left: "15px",
              padding: "5px 10px",
              borderRadius: "3px",
              outline: "none !important",
              cursor: "pointer",
            }}
          >
            &nbsp; {props.menuItem.specialTag}
          </i>
        )}
          

        {isAddingToCart?(
          <div style={{
            position:"absolute",
            top:"15px",
            right:"15px",
          }}
          >
            <MiniLoader></MiniLoader>
          </div>
        ): (
          <i
            className="bi bi-cart-plus btn btn-outline-danger"
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
              padding: "5px 10px",
              borderRadius: "3px",
              outline: "none !important",
              cursor: "pointer",
            }}
            onClick={()=> handleAddToCart(props.menuItem.id)}
          ></i>)}

          <div className="text-center">

            <p className="card-title m-0 text-success fs-3">
            <Link to={`/menuItemDetails/${props.menuItem.id}`}
            style={{textDecoration:"none", color:"green"}}>
              {props.menuItem.name}
            </Link>
            {/* HERE ABOVE ONE */}
            </p>
            <p className="badge bg-secondary" style={{ fontSize: "12px" }}>
              {props.menuItem.category}
            </p>
          </div>
          <p className="card-text" style={{ textAlign: "center" }}>
            {props.menuItem.description}
          </p>
          <div className="row text-center">
            <h4>${props.menuItem.price}</h4>
          </div>
        </div>
      </div>
    </div>
    );
}

export default MenuItemCard;