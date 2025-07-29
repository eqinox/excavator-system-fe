import { Platform } from "react-native";

// Base API configuration
const getApiBaseUrl = () => {
  if (Platform.OS === "web") {
    // return "http://[::1]:5000";
    return "http://localhost:5000";
  } else if (Platform.OS === "ios") {
    // For iOS, use ngrok tunnel for HTTPS access
    return "https://276f1a4d70d1.ngrok-free.app";
  } else {
    // For Android, use your computer's IP address
    return "http://151.251.82.193:5000";
  }
};

export const BASE_URL = getApiBaseUrl();
