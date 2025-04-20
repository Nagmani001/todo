import { useState } from "react";
import Heading from "../components/heading";
import InputBox from "../components/inputBox";
import ButtonWarning from "../components/buttonWarning";
import SubHeading from "../components/subHeading";
import Button from "../components/button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Signin() {
  const [userDetails, setUserDetails] = useState({
    username: "",
    password: "",
  });
  const [warning, setWarning] = useState({
    dataCorrect: true,
    validCredentials: true,
  })
  const navigate = useNavigate();
  async function handleClick() {
    try {
      const res = await axios.post("https://todoserverlessbackend.nagmanipd3.workers.dev/api/v1/signin", {
        username: userDetails.username,
        password: userDetails.password
      });
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        navigate("/todos");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 403) {
          setWarning({
            dataCorrect: false,
            validCredentials: true
          })
        }
        if (err.response?.status === 401) {
          setWarning({
            dataCorrect: true,
            validCredentials: false
          })
        }
      }
    }

  }
  return <div className="bg-slate-300 h-screen flex justify-center">
    <div className="flex flex-col justify-center h-full">
      <div className="bg-white w-80 rounded-xl shadow-lg text-center">
        <div className="py-4">
          <Heading label="Signin" />
        </div>
        <div className="py-4 px-3">
          <SubHeading label="Enter your credentials to access your account" />
        </div>
        <div className="space-y-3 px-3">
          <InputBox
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setUserDetails((prevDetails) => {
                return {
                  ...prevDetails,
                  username: e.target.value
                }
              })
            }}
            label="Username" placeholder="nagmani@gmail.com" />
          <InputBox
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setUserDetails((prevDetails) => {
                return {
                  ...prevDetails,
                  password: e.target.value
                }
              })
            }}
            label="Password" placeholder="12345678" />
        </div>
        <div className="pt-4">
          <Button onClick={handleClick} label="Signin" />
        </div>
        <div className="text-red-900">
          <SubHeading label={warning.dataCorrect ? "" : "your is input is invalid"} />
          <SubHeading label={warning.validCredentials ? "" : "your credentials are incorrect"} />
        </div>
        <ButtonWarning to="/signup" label="Don't have an account yet ?" buttonText="Sign Up" />
      </div>
    </div>
  </div>
}
