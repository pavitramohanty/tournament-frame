import { useState } from "react";
import { MdReplay, MdFileDownload, MdCheckCircle } from "react-icons/md";

export default function PreviewView({ image, onRetake }) {
  const [downloaded, setDownloaded] = useState(false);

  const download = () => {
    const a = document.createElement("a");
    a.href = image;
    a.download = "hariprabodham-volleyball-2026.jpg";
    a.click();
    setDownloaded(true);
  };

  return (
    <div className="preview-container">
      <img src={image} alt="Your tournament photo" className="preview-image" />

      <div className="controls">
        <button className="btn-retake" onClick={onRetake}>
          <span className="btn-retake-inner">
            <MdReplay size={22} />
            RETAKE PHOTO
          </span>
        </button>
        <button className="btn-download" onClick={download} disabled={downloaded}>
          <span className="btn-download-inner">
            {downloaded ? (
              <><MdCheckCircle size={22} /> DOWNLOADED!</>
            ) : (
              <><MdFileDownload size={22} /> SAVE PHOTO</>
            )}
          </span>
        </button>
      </div>

      <p className="share-hint">iOS users: Long press the image and tap Save</p>

      {downloaded && (
        <div className="thankyou-card">
          <div className="thankyou-emoji">🏐🏆🎉</div>
          <h2>Thank You!</h2>
          <p>
            Thank you for participating in the<br />
            <strong>Hariprabodham Volleyball Tournament 2026!</strong>
          </p>
          <p className="thankyou-sub">Wishing you great memories from today 🌟</p>
        </div>
      )}
    </div>
  );
}
