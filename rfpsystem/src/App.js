import './App.css';
import HomePage from './Frontend/Components/HomePage/HomePage';
import Navbar from './Frontend/Components/Navbar/Navbar';
import VendorForm from './Frontend/Components/VendorForm/VendorForm';
import Email from './Frontend/Components/Email/Email';
import ProposalComparison from './Frontend/Components/ProposalComparison/ProposalComparison';
import VendorResponse from './Frontend/Components/VendorResponse/VendorResponse';
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
          <Route path="/compare" element={<ProposalComparison />} />
          <Route path="/vendor-response" element={<VendorResponse />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
