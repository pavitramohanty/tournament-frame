import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { MdCameraAlt, MdFlipCameraAndroid } from "react-icons/md";

const FRAME_WIDTH = 810;
const FRAME_HEIGHT = 1080;

const PHOTO_X = 175;
const PHOTO_Y = 200;
const PHOTO_W = 460;
const PHOTO_H = 580;

export default function CameraView({ onCapture }) {
  const webcamRef = useRef(null);
  const [facingMode, setFacingMode] = useState("environment");
  const [cameraReady, setCameraReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const videoConstraints = {
    facingMode: { ideal: facingMode },
    width: { ideal: 810 },
    height: { ideal: 1080 },
  };

  const handleUserMedia = () => {
    setLoading(false);
    setCameraReady(true);
    setError(false);
  };

  const handleUserMediaError = () => {
    setLoading(false);
    setError(true);
  };

  const toggleCamera = () => {
    setLoading(true);
    setCameraReady(false);
    setError(false);
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  const capture = useCallback(() => {
    if (!webcamRef.current) return;

    const screenshot = webcamRef.current.getScreenshot({
      width: FRAME_WIDTH,
      height: FRAME_HEIGHT,
    });

    if (!screenshot) {
      alert("Could not capture photo. Please try again.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = FRAME_WIDTH;
    canvas.height = FRAME_HEIGHT;
    const ctx = canvas.getContext("2d");

    const userImg = new Image();
    userImg.src = screenshot;

    userImg.onload = () => {
      ctx.drawImage(userImg, PHOTO_X, PHOTO_Y, PHOTO_W, PHOTO_H);

      const frameImg = new Image();
      frameImg.crossOrigin = "anonymous";
      frameImg.src = "./frame.png";

      frameImg.onload = () => {
        ctx.drawImage(frameImg, 0, 0, FRAME_WIDTH, FRAME_HEIGHT);
        const composited = canvas.toDataURL("image/jpeg", 0.92);
        onCapture(composited);
      };

      frameImg.onerror = () => {
        const composited = canvas.toDataURL("image/jpeg", 0.92);
        onCapture(composited);
      };
    };

    userImg.onerror = () => {
      alert("Failed to process photo. Please try again.");
    };

  }, [webcamRef, onCapture]);

  return (
    <div className="camera-container">

      {loading && !error && (
        <div className="spinner-overlay">
          <div className="spinner" />
          <p>Starting camera...</p>
        </div>
      )}

      {error && (
        <div className="spinner-overlay">
          <p className="error-text">
            ⚠️ Camera access denied.<br />
            Please allow camera permission and refresh.
          </p>
        </div>
      )}

      <div className="webcam-wrapper" style={{ opacity: cameraReady ? 1 : 0 }}>
        <Webcam
          ref={webcamRef}
          videoConstraints={videoConstraints}
          onUserMedia={handleUserMedia}
          onUserMediaError={handleUserMediaError}
          screenshotFormat="image/jpeg"
          className="webcam"
          mirrored={facingMode === "user"}
        />
        <img src="./frame.png" className="frame-overlay" alt="frame" />
      </div>

      {cameraReady && (
        <div className="controls">
          <button className="btn-secondary" onClick={toggleCamera}>
            <MdFlipCameraAndroid size={20} />
            Switch Camera ({facingMode === "environment" ? "Back" : "Front"})
          </button>
          <button className="btn-capture" onClick={capture}>
            <span className="btn-capture-inner">
              <MdCameraAlt size={22} />
              TAKE PHOTO
            </span>
          </button>
        </div>
      )}

    </div>
  );
}
