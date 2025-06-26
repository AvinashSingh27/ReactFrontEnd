import React, {useState} from 'react';
import { Footer, Header } from '../Components/Layout';
import { AccessDenied, AllOrders, AuthenticationTest, AuthenticationTestAdmin, Home, Login, MenuItemDetails, MenuItemList, MenuItemUpsert, MyOrders, NotFound, OrderConfirmed, OrderDetails, Payment, Register, ShoppingCart } from '../Pages';
import {Routes, Route} from "react-router-dom";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetshoppingCartQuery } from '../Apis/shoppingCartApi';
import { setShoppingCart } from '../Storage/Redux/shoppingCartSlice';
import { userModel } from '../Interfaces';
import jwtDecode from 'jwt-decode';
import { setLoggedInUser } from '../Storage/Redux/userAuthSlice';
import { RootState } from '../Storage/Redux/store';





function App() {

  const dispatch = useDispatch();
  const userData = useSelector((state : RootState) => state.userAuthStore);
  const [skip, setSkip] = useState(true);
  const{data, isLoading} = useGetshoppingCartQuery(
    userData.id, {
    // skip:skip,
  });


  useEffect(()=>{
    const localToken = localStorage.getItem("token");
    if(localToken){
    const {fullName,id,email,role} : userModel=jwtDecode(localToken);
    dispatch(setLoggedInUser({fullName,id,email,role}));
    }
  },[])

  useEffect(()=>{
    if(!isLoading)
    {
      //console.log(data.result);
      dispatch(setShoppingCart(data.result?.cartItems));
    }
  },[data]);

  // useEffect(()=>{
  //   if(userData.id) setSkip(false);
  // }, [userData]);    //in network TAB, shoopping cart call two times

  return (
    <div className="pb-5">
      <Header></Header>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="*" element={<NotFound></NotFound>}></Route>  
        {/* when the path is * means NotFound */}
        <Route path="/menuItemDetails/:menuItemId" element={<MenuItemDetails/>}></Route>
        <Route path="/shoppingCart" element={<ShoppingCart></ShoppingCart>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="/authentication" element={<AuthenticationTest></AuthenticationTest>}></Route>
        <Route path="/authorization" element={<AuthenticationTestAdmin></AuthenticationTestAdmin>}></Route>
        <Route path="/accessDenied" element={<AccessDenied></AccessDenied>}></Route>
        <Route path="/payment" element={<Payment></Payment>}></Route>
        <Route path="order/orderconfirmed/:id" element={<OrderConfirmed></OrderConfirmed>}></Route>
        <Route path="/order/myorders" element={<MyOrders></MyOrders>}></Route>
        <Route path="/order/orderDetails/:id" element={<OrderDetails></OrderDetails>}></Route>
        <Route path="/order/allOrders" element={<AllOrders></AllOrders>}></Route>
        <Route path="/menuItem/menuitemlist" element={<MenuItemList></MenuItemList>}></Route>
        <Route path="/menuItem/menuitemupsert/:id" element={<MenuItemUpsert></MenuItemUpsert>}></Route>
        <Route path="/menuItem/menuitemupsert/" element={<MenuItemUpsert></MenuItemUpsert>}></Route>
      </Routes>
      <Footer></Footer>
    </div>
  );
}

export default App;
