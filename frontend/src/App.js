import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome.js"; // AKA the login page
import Home from "./pages/Home.js";
import Register from "./components/Register.js";
import PrivateRoute from "./components/PrivateRoute.js";
import Dashboard from "./pages/Dashboard.js";


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<PrivateRoute><Home /> </PrivateRoute>} />
            <Route path="/dashboard/:id" element={<PrivateRoute><Dashboard /> </PrivateRoute>} />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
