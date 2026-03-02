import { useState } from "react";
import { MdReplay, MdFileDownload, MdCheckCircle } from "react-icons/md";

export default function PreviewView({ image, onRetake }) {
  const [downloaded, setDownloaded] = useState(false);

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const download = () => {
    if (isIOS || isSafari) {
      // ✅ On iOS/Safari — open image in new tab, user saves manually
      const newTab = window.open();
      newTab.document.write(`
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Save Your Photo</title>
            <style>
              body { margin: 0; background: #000; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: sans-serif; color: white; gap: 16px; padding: 16px; box-sizing: border-box; }
              img { max-width: 100%; border-radius: 12px; }
              p { font-size: 1rem; text-align: center; color: #aaa; }
              strong { color: #ffd700; }
            </style>
          </head>
          <body>
            <p><strong>Hold down the image and tap "Save to Photos"</strong></p>
            <img src="${image}" alt="Your tournament photo" />
            <p>Then go back to the app</p>
          </body>
        </html>
      `);
      newTab.document.close();
      setDownloaded(true);
    } else {
      // ✅ Android/Desktop — normal download
      const a = document.createElement("a");
      a.href = image;
      a.download = "hariprabodham-volleyball-2026.jpg";
      a.click();
      setDownloaded(true);
    }
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
              <><MdCheckCircle size={22} /> SAVED!</>
            ) : (
              <><MdFileDownload size={22} /> SAVE PHOTO</>
            )}
          </span>
        </button>
      </div>

      {/* ✅ Different hint based on device */}
      {isIOS || isSafari ? (
        <p className="share-hint">📱 Tap SAVE PHOTO → hold the image → tap "Save to Photos"</p>
      ) : (
        <p className="share-hint">📱 Photo will be saved to your Downloads folder</p>
      )}

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
