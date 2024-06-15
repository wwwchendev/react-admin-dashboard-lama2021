// 載入firebase核心
import { initializeApp } from 'firebase/app';
// 載入firebase各項服務
import { getStorage } from 'firebase/storage';
//用於存儲和管理應用程序文件（例如圖像、音頻、視頻等）的雲端存儲服務。

// 您的網路應用程式的 Firebase 配置
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// 初始化Firebase應用
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
