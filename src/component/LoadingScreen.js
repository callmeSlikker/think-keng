import React from "react";
import './LoadingScreen.css'; // Make sure to import the CSS file

const LoadingScreen = () => {
  return (
    <div className="loading-overlay">
      <div style={{ textAlign: "center", justifyContent: "center", alignItems: "center", display: "flex", flexDirection: "column" }}>
        <div className="spinner"></div>
        <div className="loading-text">AI is processing . . .</div>
      </div>
    </div>
  );
};

export default LoadingScreen;