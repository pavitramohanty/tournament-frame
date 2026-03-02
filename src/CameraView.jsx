import { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { MdCameraAlt, MdFlipCameraAndroid } from "react-icons/md";

const FRAME_WIDTH = 810;
const FRAME_HEIGHT = 1080;

// ✅ Draw user photo to fill the FULL canvas, not just the hole
const PHOTO_X = 0;
const PHOTO_Y = 0;
const PHOTO_W = FRAME_WIDTH;
const PHOTO_H = FRAME_HEIGHT;

export default function CameraView({ onCapture }) {
  const webcamRef = useRef(null);
  const [facingMode, setFacingMode] = useState("user");
  const [cameraReady, setCameraReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // ✅ No aspectRatio constraint — let browser handle it naturally
  const videoConstraints = {
    facingMode: { ideal: facingMode },
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

    const screenshot = webcamRef.current.getScreenshot();

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
      // ✅ Scale and center-crop user photo to fill full canvas
      const srcW = userImg.width;
      const srcH = userImg.height;
      const srcRatio = srcW / srcH;
      const dstRatio = FRAME_WIDTH / FRAME_HEIGHT;

      let sx, sy, sw, sh;

      if (srcRatio > dstRatio) {
        // wider than needed — crop sides
        sh = srcH;
        sw = srcH * dstRatio;
        sx = (srcW - sw) / 2;
        sy = 0;
      } else {
        // taller than needed — crop top/bottom
        sw = srcW;
        sh = srcW / dstRatio;
        sx = 0;
        sy = (srcH - sh) / 2;
      }

      // Draw user photo center-cropped to fill full canvas
      ctx.drawImage(userImg, sx, sy, sw, sh, 0, 0, FRAME_WIDTH, FRAME_HEIGHT);

      const frameImg = new Image();
      frameImg.crossOrigin = "anonymous";
      frameImg.src = "/tournament-frame/frame.png";

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
          screenshotQuality={0.92}
          className="webcam"
          mirrored={facingMode === "user"}
        />
        <img src="/tournament-frame/frame.png" className="frame-overlay" alt="frame" />
      </div>

      {cameraReady && (
        <div className="controls">
          <button className="btn-secondary" onClick={toggleCamera}>
            <MdFlipCameraAndroid size={20} />
            Switch Camera ({facingMode === "user" ? "Front" : "Back"})
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
