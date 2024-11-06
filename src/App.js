import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import FirstPage from "./FirstPage";
import BlueBin from "./BlueBin";
import useAiModel from "./useAiModel";
import { useEffect, useState } from "react";
import * as tmImage from "@teachablemachine/image";
import LoadingScreen from "./component/LoadingScreen";

function App() {
  const { setModel } = useAiModel();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await tmImage.load(
        "/model/model.json",
        "/model/metadata.json"
      );
      setModel(loadedModel);
      setLoading(false);
    };
    loadModel();
  }, [setModel]);

  return (
    <>
      {loading && <LoadingScreen text="Loading AI model . . ." />}
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<FirstPage />} />{" "}
            {/* เส้นทางสำหรับหน้าแรก */}
            <Route path="/blueBin" element={<BlueBin />} />{" "}
            {/* เส้นทางสำหรับหน้า SecondPage */}
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
