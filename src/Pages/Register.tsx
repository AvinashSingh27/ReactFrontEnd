import React, {useState} from "react";
import { SD_Roles } from "../Utility/SD";
import { inputHelper, toastNotify } from "../Helper";
import { useRegisterUserMutation } from "../Apis/authApi";
import { apiResponse } from "../Interfaces";
import { useNavigate } from "react-router-dom";
import MainLoader from "../Components/Page/Common/MainLoader";
function Register(){

  // WORK ON THIS
  const navigate = useNavigate();
  const[registerUser] = useRegisterUserMutation();
  const[loading, setloading] = useState(false);
  const [userInput, setUserInput]=useState({
    userName:"",
    password:"",
    role:"",
    name:"",
  });

  // when we use inputhelper we have use name property that matched what we have in local state.
  const handleUserInput =(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>{
    const tempDate = inputHelper(e,userInput);
    setUserInput(tempDate);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    setloading(true);
    const response:apiResponse = await registerUser({
    userName:userInput.userName,
    password:userInput.password,
    role:userInput.role,
    name:userInput.name,
    });
    if(response.data){
      toastNotify("Registration successfull! Please login to continue.")
      navigate("/login");
      //console.log(response.data);
    }else if(response.error)
    {
      toastNotify(response.error.data.errorMessages[0],"error");
      //console.log(response.error.data.errorMessages[0]);
    }
    
    setloading(false);
  }

    return( 
    <div className="container text-center">
      {loading && <MainLoader></MainLoader>}
        <form method="post" onSubmit={handleSubmit}>
          <h1 className="mt-5">Register</h1>
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
                type="text"
                className="form-control"
                placeholder="Enter Name"
                required
                name="name"
                value={userInput.name}
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
            <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
              <select className="form-control form-select" required 
                value={userInput.role}
                name="role"
                onChange={handleUserInput}>
                <option value="">--Select Role--</option>
                <option value={`${SD_Roles.CUSTOMER}`}>Customer</option>
                <option value={`${SD_Roles.ADMIN}`}>Admin</option>
              </select>
            </div>
          </div>
          <div className="mt-5">
            <button type="submit" className="btn btn-success" disabled={loading}>
              Register
            </button>
          </div>
        </form>
      </div>
      )
}

export default Register