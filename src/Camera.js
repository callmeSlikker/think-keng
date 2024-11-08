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
      description: ["ขยะทั่วไป", "คือ ขยะที่ย่อยสลายยากและ ไม่คุ้มค่าในการนำไปรีไซเคิล ยกตัวอย่างเช่น ถุงพลาสติกบางประเภท เปลือกลูกอม ถุงขนม เป็นต้น"],
    },
    foodwaste: {
      imageUrl: "/bin/2.1.png",
      title: "foodwaste",
      description: ["ขยะเปียก", "คือ ขยะที่ย่อยสลายได้ง่าย สามารถนำมาทำเป็นปุ๋ยได้ ตัวอย่างเช่น เศษอาหาร เศษไม้ มูลสัตว์ และซากสัตว์ เป็นต้น"],
    },
    recycle: {
      imageUrl: "/bin/3.1.png",
      title: "recycle",
      description: ["ขยะรีไซเคิล", "คือ ขยะที่สามมารถนำมาผ่านกระบวนการรีไซเคิล ทำให้สามารถนำมาใช้ใหม่ได้โดยมีคุณภาพเท่าเทียม หรือใกล้เคียงของเดิมที่สุด"],
    },
    hazardous: {
      imageUrl: "/bin/4.1.png",
      title: "hazardous",
      description: ["ขยะอันตราย", "คือ ขยะที่ปนเปื้อนสารกำมันตรังสียกตัวอย่างเช่น อาจจะเป็นภาชนะบรรจุสารเคมี ยาที่หมดอายุแล้ว ขยะติดเชื้อจากโรงบาล วัตถุไวไฟ แบตเตอรี่"],
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
      <div style={{ transform: "scaleX(-1)" }}>
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
              ? "หรือเลือกรูปภาพจากคลังรูปภาพ"
              : "Select an image"}
          </p>
        </div>
      </div>

      {predictResult && (
        <>
          {imageSelected && (
            // Show the selected image if available
            <img
              src={imageSelected}
              alt="Selected"
              style={{
                width: "85%",
                aspectRatio: 16 / 9,
                objectFit: "contain",
              }}
            />
          )}
          <h3>ประเภทของขยะ</h3>
          <img src={predictResult.imageUrl} />
          <h3>{predictResult.title}</h3>
          <div style={{padding: "5%", wordBreak: "break-word"}}>
          {predictResult.description.map(description => <p>{description}</p>)}
          </div>
        </>
      )}
    </>
  );
};

export default CameraAndFilePicker;
