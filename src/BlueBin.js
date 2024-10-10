import useImageStore from "./useImageStore";
import { useNavigate } from "react-router-dom";

function BlueBin() {
  const { imageData } = useImageStore(); // ดึง imageData และ setImageData จาก zustand store
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/");
  };
  return (
    <div style={{ position: "relative" }}>
        <button onClick={handleBackClick}>กลับ</button>
        <h3>ขยะทั่วไป</h3>
      <div>
        {imageData && (
          <img
            src={imageData}
            style={{ width: 200, aspectRatio: "1/1" }}
            alt="ถ่ายภาพแล้ว"
          />
        )}
      </div>
    </div>
  );
}
export default BlueBin;
