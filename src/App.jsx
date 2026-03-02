import { useState } from "react";
import CameraView from "./CameraView";
import PreviewView from "./PreviewView";
import "./App.css";

export default function App() {
  const [capturedImage, setCapturedImage] = useState(null);

  return (
    <div className="app">
      <div className="header">
        <h1>🏐 Hariprabodham Volleyball 2026</h1>
        <p>Take your tournament photo!</p>
      </div>

      {capturedImage ? (
        <PreviewView
          image={capturedImage}
          onRetake={() => setCapturedImage(null)}
        />
      ) : (
        <CameraView onCapture={setCapturedImage} />
      )}
    </div>
  );
}
