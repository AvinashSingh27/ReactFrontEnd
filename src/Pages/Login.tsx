import React, { useState } from "react";
import { inputHelper } from "../Helper";
import { useLoginUserMutation } from "../Apis/authApi";
import { apiResponse, userModel } from "../Interfaces";
import jwtDecode from "jwt-decode";
import { useDispatch } from "react-redux";
import { setLoggedInUser } from "../Storage/Redux/userAuthSlice";
import { useNavigate } from "react-router-dom";
import MainLoader from "../Components/Page/Common/MainLoader";
function Login(){
    const [error, setError] = useState("");
    const[loginUser] = useLoginUserMutation();
    const[loading, setloading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [userInput, setUserInput]=useState({
      userName:"",
      password:"",
    });
  
    // when we use inputhelper we have use name property that matched what we have in local state.
    const handleUserInput =(e: React.ChangeEvent<HTMLInputElement>) =>{
      const tempDate = inputHelper(e,userInput);
      setUserInput(tempDate);
    };

     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setloading(true);
        const response:apiResponse = await loginUser({
        userName:userInput.userName,
        password:userInput.password,
        });
        if(response.data){
          //console.log(response.data);
          const{token}=response.data.result;
          const {fullName,id,email,role} : userModel=jwtDecode(token);
          localStorage.setItem("token",token);
          //localStorage.setItem("token", response.data.result.token);
          dispatch(setLoggedInUser({fullName,id,email,role}));
          navigate("/");
        }else if(response.error)
        {
          console.log(response.error.data.errorMessages[0]);
          setError(response.error.data.errorMessages[0]);
        }
        
        setloading(false);
      }

    return(
        <div className="container text-center">
          {loading && <MainLoader></MainLoader>}
        <form method="post" onSubmit={handleSubmit}>
          <h1 className="mt-5">Login</h1>
          <div className="mt-5">
            <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Username"
                required
                name="userName"
                value={userInput.userName}
                onChange={handleUserInput}
              />
            </div>
  
            <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
              <input
                type="password"
                className="form-control"
                placeholder="Enter Password"
                required
                name="password"
                value={userInput.password}
                onChange={handleUserInput}
              />
            </div>
          </div>
  
          <div className="mt-2">
            {error && <p className="text-danger">{error}</p>}
            <button
              type="submit"
              className="btn btn-success"
              style={{ width: "200px" }}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    )
}

export default Login