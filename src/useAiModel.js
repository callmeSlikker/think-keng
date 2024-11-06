import { create } from 'zustand';

// สร้าง store สำหรับจัดการ AI model
const useAiModel = create((set) => ({
  model: null,
  setModel: (loadedAiModel) => set({ model: loadedAiModel }),
}));

export default useAiModel;