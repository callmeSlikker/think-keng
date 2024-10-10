import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import FirstPage from './FirstPage';
import BlueBin from './BlueBin';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<FirstPage />} /> {/* เส้นทางสำหรับหน้าแรก */}
          <Route path="/blueBin" element={<BlueBin />} /> {/* เส้นทางสำหรับหน้า SecondPage */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
