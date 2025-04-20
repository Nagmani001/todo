import { BrowserRouter, Route, Routes } from "react-router-dom"
import Landing from "./pages/landing"
import Signin from "./pages/signin"
import Signup from "./pages/signup"
import Todos from "./pages/todos"

function App() {
  return <div>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/todos" element={<Todos />} />
      </Routes>
    </BrowserRouter>
  </div>
}

export default App
