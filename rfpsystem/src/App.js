import './App.css';
import HomePage from './Frontend/Components/HomePage/HomePage';
import Navbar from './Frontend/Components/Navbar/Navbar';
import VendorForm from './Frontend/Components/VendorForm/VendorForm';
import Email from './Frontend/Components/Email/Email';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/addVendor" element={<VendorForm />} />
          <Route path="/email" element={<Email />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
