
import { Link } from "react-router-dom";
interface ButtonWarning {
  label: string,
  buttonText: string,
  to: string
}
export default function ButtonWarning({ label, buttonText, to }: ButtonWarning) {
  return <div className="py-2 text-sm flex justify-center">
    <div className="py-2 text-sm flex justify-center">{label}</div>
    <Link className="pointer underline pl-1 pt-2 cursor-pointer" to={to}>{buttonText}</Link>
  </div>
}
