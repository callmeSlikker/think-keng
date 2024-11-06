import React, { useState } from "react";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import { registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import { CiImageOn } from "react-icons/ci";
import useAiModel from "./useAiModel";
import LoadingScreen from "./component/LoadingScreen";

// Register the FilePond plugins (optional)
registerPlugin(FilePondPluginImagePreview);

const CameraAndFilePicker = () => {
  const { model } = useAiModel();
  const [predictResult, setPredictResult] = useState(null);
  const [imageSelected, setImageSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const details = {
    general: {
      imageUrl: "/bin/1.1.png",
      title: "general",
      description: "description general",
    },
    foodwaste: {
      imageUrl: "/bin/2.1.png",
      title: "foodwaste",
      description: "description foodwaste",
    },
    recycle: {
      imageUrl: "/bin/3.1.png",
      title: "recycle",
      description: "description recycle",
    },
    hazardous: {
      imageUrl: "/bin/4.1.png",
      title: "hazardous",
      description: "description hazardous",
    },
  };

  const predictImage = (dataUri) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = dataUri;

      // Wait for the image to load before passing it to the model
      img.onload = async () => {
        try {
          const prediction = await model.predict(img);

          // Get the highest probability prediction
          const highestPrediction = prediction.reduce((prev, current) => {
            return current.probability > prev.probability ? current : prev;
          });
          resolve(highestPrediction); // Resolve with the prediction
        } catch (error) {
          reject(error); // Reject the promise on error
        }
      };

      img.onerror = (error) => {
        console.error("Error loading image", error);
        setLoading(false); // Hide loading screen on error
        reject(error); // Reject the promise if image loading fails
      };
    });
  };

  const handleTakePhoto = async (dataUri) => {
    setLoading(true);
    try {
      const prediction = await predictImage(dataUri);
      setPredictResult(details[prediction.className]);
      setImageSelected(dataUri);
    } catch (error) {
      console.error("Prediction failed:", error);
    } finally {
      setLoading(false)
    }
  };

  const handleFileChange = (event) => {
    setLoading(true)
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const imageUri = e.target.result; // นี่คือ Data URI ของรูปภาพ
          const prediction = await predictImage(imageUri);
          setPredictResult(details[prediction.className]);
          setImageSelected(imageUri);
        } catch (error) {
          console.error("Prediction failed:", error);
        } finally {
          setLoading(false)
        }
      };
      reader.readAsDataURL(file); // อ่านไฟล์เป็น Data URI
    }
  };

  return (
    <>
      {loading && <LoadingScreen text="AI is processing . . ." />}
      <div>
        <Camera
          onTakePhoto={(dataUri) => handleTakePhoto(dataUri)} // เมื่อถ่ายภาพจะส่ง URI
        />
      </div>
      <p>ถ่ายรูปเพื่อนจำแนกประเภทของขยะ</p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
            <CiImageOn style={{ fontSize: "64px" }} />
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <p>
            {imageSelected
              ? "Click on the image to change it"
              : "Select an image"}
          </p>
        </div>
      </div>
      <p>หรือเลือกรูปภาพจากคลังรูปภาพ</p>

      {predictResult && (
        <>
          {imageSelected && (
            // Show the selected image if available
            <img
              src={imageSelected}
              alt="Selected"
              style={{
                width: "50%",
                aspectRatio: 16 / 9,
                objectFit: "contain",
              }}
            />
          )}
          <h1>ประเภทของขยะ</h1>
          <img src={predictResult.imageUrl} />
          <h3>{predictResult.title}</h3>
          <p>{predictResult.description}</p>
        </>
      )}
    </>
  );
};

export default CameraAndFilePicker;
