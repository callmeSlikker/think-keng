import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import FirstPage from './FirstPage';
import BlueBin from './BlueBin';
import useAiModel from './useAiModel';
import { useEffect } from 'react';
import * as tmImage from "@teachablemachine/image";

function App() {
  const { setModel } = useAiModel();

  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await tmImage.load('/model/model.json', '/model/metadata.json');
      setModel(loadedModel);
    };
    loadModel();
  }, [setModel]);

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
