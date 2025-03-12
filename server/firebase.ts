
import { initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// Use environment variables for sensitive credentials
const serviceAccount = {
  type: "service_account",
  project_id: "sakany10",
  private_key_id: "3c1e3f94e45842252235ceda27ec232d6c5e1c52",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCvqMZTTrfO9a2k\n5oOcwdFviRKYfT8UiLvHWy5jVaIYY9xbGYJiK8XCQNIHVapPdQBn6CIa658rGbG/\nW4PB4fcVBg/6o93IJGG1yWBcDr0pHmdG1+EAcZHrCXAqjhxwGP7tKu7nUXh3d3rg\nvLEyg0MkNJ0aE95kJgdNkNTvq0+rW8YmQcwYp2hHhHvzNSMJbM5i3kR6dBdF0oDs\nNDjXP0PHUQ1kFUzJdFZwXDlXKnuuMKT2G6QZBo5nW2wXxgFzbQrQUXWfgjDpKk3T\nBvNtQ1C+D0Xq2sbj5Jl7dXFTrMPCBBn25KYG10+fRG9JaQYnMDPpYA9pKBXI2G4c\n35PgVJM1AgMBAAECggEACLgJcLF5YC0VNpAbjKMJZvYyvf9D8CyTWwMw/uLXZYGr\nR8Ku42eFODDDHuYvXZbCtxObHn2ahWTMc58G5jCpICHHU8mLQtf2lxlkBGFCB5/f\nLqE9Lz9qwqzV3lmVc3vfbSK2nwkLHAQsWGdZcsjADH12Bm2m9tA7lsI6UcVaOSW5\ng7J+zvPv2GnBfwjGEU9VXmr0t7xgx4Qrg7KAmMXR0EXzQ9iWFKmA3n7W2YVo+vn0\nxdC5OPXsn6HI2A5qbKo/vG6RMXlDRwf4TBqx49vQBW2SCFEwKPWFmHCCPJfXEXtI\n2jIQUOAKOlQMUPDCzS5c7zyfOYO+lCppL3Yt7AZXnQKBgQDvLN4xVqNE9j78Ek1+\n0JefL+OMVlcT39/wWJGwWZGGxj4m0jfT1X2t6e+CwGIyoF4y3kDtcJVrfk8a8+Zs\n+2QMQB3ky3bIZGn8YsaGKs2bsYPEUdKcMZXqFfbKmyTW40EeiBB1JrhBaLPNwW2v\n4xDhiVCqoOvC/NNSoX4V3aL2+wKBgQC8KS8tIK8NfvEg0r1Vp7Vtz6p7CEDrm7/C\n4Zg87+w1cCCcCR0eeOGCQMgnURUZgP+u8CnkMlBgDQp8yW4NHvqAc+iKwP8D6G/r\nwlVGEaUWJwwBZZ3Jy9pjZ6y/hDrgEk73lSqnFQ9iIzSWg5fQZgvtIPGFnkBpZ75x\n0OcTVFMBPwKBgGqLzEyGnHbjpdezuAiuBDzPM0mWjP1eGbM/MprAGY0Nw24ZXDnP\nYr6W2lFEoP0lw+HQBaVIV+CtEhv6oMcW3A1Vdi+iRHv8NhPuW2yww0RysTD2o8Cj\nLQPJB0QXUiGWJXcj/EBP+rJkzgP9p1Bq1KbNYQZjVyF0k5qUDu4Qcca1AoGBAJnT\nP/Tf9+O/WIKoTsxHPVRy3JmJ723SxZ6J2HlUi2Y2K/lqfFu0jZiBXeqSWlg1YTEH\n94mEPb6YP1WjyFkrvLFhiYbzQTFRnG31VHUcEPgD4LN5hzUxJBCfMz2E5nxglwAq\nBTVWZlv2y7fWDxo7cQCvn7YaIW/rp21KXOCcOYS5AoGBAO4JBQHxhiIfVDnlZPtN\n9aOYQD5GQTVTUHQdCOE8aNMwGD3dxGsLYk5+HS85WMFVAMPh1o0TlIQLJgC2BnHO\nZJMM0TKTL2cfIHSrU/XHlQiIm6+nJdZxmDjMbefh1AyYjbihFTjl+Jx70Wf5QSvn\nWdPdpKfsFxn42ZKE5MzWN4uj\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@sakany10.iam.gserviceaccount.com",
  client_id: "115982023406421571796",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40sakany10.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

// Initialize the app with admin credentials
const app = initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "sakany10.appspot.com",
  databaseURL: "https://sakany10-default-rtdb.firebaseio.com"
});

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const firebaseStorage = getStorage(app); // Renamed from 'storage' to avoid duplicate declarations

console.log("Firebase Admin SDK initialized successfully");
