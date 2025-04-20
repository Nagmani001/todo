import { useNavigate } from "react-router-dom";
import Button from "../components/button";
import Heading from "../components/heading";
import SubHeading from "../components/subHeading";

export default function Landing() {
  const navigate = useNavigate();
  return <div className="bg-slate-300 h-screen flex justify-center ">
    <div className="flex flex-col justify-center h-full">
      <div className="bg-white shadow-gray-500 rounded-xl space-y-3">
        <div className="text-center pt-4">
          <Heading label="Stay Organized, Stay Productive" />
        </div>
        <div className="text-center p-4">
          <SubHeading label="Manage your tasks effortlessly with our simple and intuitive to-do app. Keep track of what matters most, anytime, anywhere." />
        </div>
        <div className="flex justify-center p-3">
          <Button label="Signin" onClick={() => {
            navigate("/signin")
          }} />

          <Button onClick={() => {
            navigate("/signup")
          }} label="Signup" />
        </div>
      </div>
    </div>

  </div>
}
