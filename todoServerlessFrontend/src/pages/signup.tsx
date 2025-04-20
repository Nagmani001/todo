import { useState } from "react";
import Button from "../components/button";
import ButtonWarning from "../components/buttonWarning";
import Heading from "../components/heading";
import InputBox from "../components/inputBox";
import SubHeading from "../components/subHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [warning, setWarning] = useState({
    userExists: false,
    dataCorrect: true,
  })
  async function handleClick() {
    try {
      const res = await axios.post("https://todoserverlessbackend.nagmanipd3.workers.dev/api/v1/signup", {
        username: userDetails.username,
        password: userDetails.password,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
      });
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        navigate("/todos");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 403) {
          setWarning({
            userExists: false,
            dataCorrect: false,
          })
        }
        if (err.response?.status === 409) {
          setWarning({
            userExists: true,
            dataCorrect: true,
          })
        }
      }
    }
  }
  return <div className="bg-slate-300 flex justify-center h-screen">
    <div className="flex flex-col justify-center h-full">
      <div className="bg-white w-80 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="py-4">
            <Heading label="Signup" />
          </div>
          <div className="py-1 px-3 ">
            <SubHeading label="Enter your information to create an account" />
          </div>
        </div>
        <div className="space-y-3 px-4 mt-4">
          <InputBox
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setUserDetails((prevDetails) => {
                return {
                  ...prevDetails,
                  username: e.target.value
                }
              })
            }}
            label="Username: " placeholder="nagmani@gmail.com" />
          <InputBox
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setUserDetails((prevDetails) => {
                return {
                  ...prevDetails,
                  password: e.target.value
                }
              })
            }}
            label="Password: " placeholder="12345678" />
          <InputBox
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setUserDetails((prevDetails) => {
                return {
                  ...prevDetails,
                  firstName: e.target.value
                }
              })
            }}
            label="First Name: " placeholder="John" />
          <InputBox
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setUserDetails((prevDetails) => {
                return {
                  ...prevDetails,
                  lastName: e.target.value
                }
              })
            }}
            label="username" placeholder="Doe" />
        </div>
        <div className="pt-4 flex justify-center">
          <Button onClick={handleClick} label="Sign Up" />
        </div>
        <div className="text-red-900 text-sm text-center">
          <SubHeading label={warning.dataCorrect ? "" : "your data in invalid"} />
          <SubHeading label={warning.userExists ? "User already exists with this username" : ""} />
        </div>
        <div>
          <ButtonWarning label="Already have an account? " to="/signin" buttonText="Signin" />
        </div>
      </div>
    </div>
  </div>
}
