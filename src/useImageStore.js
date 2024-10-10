import { create } from 'zustand';

// สร้าง store สำหรับจัดการ imageData
const useImageStore = create((set) => ({
  imageData: null,
  setImageData: (newImageData) => set({ imageData: newImageData }),
}));

export default useImageStore;