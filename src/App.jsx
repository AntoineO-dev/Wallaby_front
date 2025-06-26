import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <BrowserRouter>
     {/* Navbar */}
          <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;