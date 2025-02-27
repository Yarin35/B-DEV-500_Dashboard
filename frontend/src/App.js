import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome.js"; // AKA the login page
import Home from "./pages/Home.js";
import Register from "./components/Register.js";
import PrivateRoute from "./components/PrivateRoute.js";
import Dashboard from "./pages/Dashboard.js";
import OAuthCallback from "./components/OAuthCallback";
import PrivacyPolicy from "./pages/PrivacyPolicy.js";


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
            <Route path="/oauth-callback" element={<OAuthCallback />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
