import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { sfx } from '../utils/sfx';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (roomCode: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  isOpen,
  onClose,
  onScanSuccess
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const startCamera = async () => {
    setErrorMsg('');
    setHasPermission(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('इस डिवाइस पर कैमरा सपोर्ट उपलब्ध नहीं है।');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });

      streamRef.current = stream;
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true'); // Required for iOS/Android WebView
        await videoRef.current.play();
        setIsScanning(true);
        requestAnimationFrame(tickScan);
      }
    } catch (err: any) {
      console.error('[QRScanner Error]', err);
      setHasPermission(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMsg('कैमरा की अनुमति अस्वीकृत कर दी गई है। कृपया सेटिंग्स में कैमरा की अनुमति दें।');
      } else if (err.name === 'NotFoundError') {
        setErrorMsg('कोई कैमरा नहीं मिला। कृपया कोड हाथ से टाइप करें।');
      } else {
        setErrorMsg(err.message || 'कैमरा शुरू करने में समस्या आई।');
      }
    }
  };

  const parseRoomCode = (raw: string): string | null => {
    if (!raw) return null;
    const clean = raw.trim();

    // 1. If it's a full URL e.g. https://.../?room=4819
    try {
      if (clean.includes('room=')) {
        const url = new URL(clean.startsWith('http') ? clean : `https://${clean}`);
        const code = url.searchParams.get('room');
        if (code && code.length >= 4) return code.trim().toUpperCase();
      }
    } catch (_) {}

    // 2. Direct format PALASH:4819
    if (clean.startsWith('PALASH:')) {
      const part = clean.split(':')[1]?.trim();
      if (part) return part.toUpperCase();
    }

    // 3. 4-digit numeric code
    const match = clean.match(/\b\d{4}\b/);
    if (match) return match[0];

    // Fallback: return raw if 4-6 chars
    if (clean.length >= 4 && clean.length <= 8) {
      return clean.toUpperCase();
    }

    return null;
  };

  const tickScan = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code && code.data) {
        const parsedCode = parseRoomCode(code.data);
        if (parsedCode) {
          sfx.playSuccess();
          stopCamera();
          onScanSuccess(parsedCode);
          onClose();
          return;
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(tickScan);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.88)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#0f172a',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(to right, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8))'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.4rem' }}>📷</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                QR कोड स्कैन करें
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                शिक्षक का रूम कोड तुरंत स्कैन करें
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              color: '#f8fafc',
              fontSize: '1.1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        {/* Camera Viewport Area */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '320px',
            background: '#000',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {/* Video Stream */}
          <video
            ref={videoRef}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
          {/* Hidden Canvas for Decoding */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />

          {/* Scanner Overlay Frame */}
          {hasPermission && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none'
              }}
            >
              {/* Viewfinder Box */}
              <div
                style={{
                  width: '210px',
                  height: '210px',
                  position: 'relative',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '16px',
                  boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.45)'
                }}
              >
                {/* 4 Neon Corners */}
                <div style={{ position: 'absolute', top: -2, left: -2, width: 22, height: 22, borderTop: '4px solid #10b981', borderLeft: '4px solid #10b981', borderTopLeftRadius: '14px' }} />
                <div style={{ position: 'absolute', top: -2, right: -2, width: 22, height: 22, borderTop: '4px solid #10b981', borderRight: '4px solid #10b981', borderTopRightRadius: '14px' }} />
                <div style={{ position: 'absolute', bottom: -2, left: -2, width: 22, height: 22, borderBottom: '4px solid #10b981', borderLeft: '4px solid #10b981', borderBottomLeftRadius: '14px' }} />
                <div style={{ position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderBottom: '4px solid #10b981', borderRight: '4px solid #10b981', borderBottomRightRadius: '14px' }} />

                {/* Laser animation line */}
                {isScanning && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '8px',
                      right: '8px',
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent, #10b981, #34d399, transparent)',
                      boxShadow: '0 0 8px #10b981',
                      animation: 'scanLaser 2s ease-in-out infinite'
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {/* Loading / Error Fallbacks */}
          {hasPermission === null && (
            <div style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔄</div>
              कैमरा शुरू हो रहा है...
            </div>
          )}

          {hasPermission === false && (
            <div
              style={{
                position: 'absolute',
                inset: '20px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '16px',
                padding: '20px',
                color: '#fca5a5',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div style={{ fontSize: '2.5rem' }}>📷🚫</div>
              <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.4' }}>
                {errorMsg || 'कैमरा की अनुमति नहीं मिली।'}
              </p>
              <button
                onClick={startCamera}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                पुनः प्रयास करें
              </button>
            </div>
          )}
        </div>

        {/* Footer Instruction */}
        <div
          style={{
            padding: '16px 20px',
            background: '#090d16',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            textAlign: 'center'
          }}
        >
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1' }}>
            शिक्षक के फोन पर दिख रहा <strong>QR कोड</strong> इस फ्रेम के अंदर रखें।
          </p>
          <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b' }}>
            कोड मिलते ही आप स्वतः कक्षा में जुड़ जाएंगे।
          </p>
        </div>
      </div>

      <style>{`
        @keyframes scanLaser {
          0% { top: 10%; opacity: 0.8; }
          50% { top: 90%; opacity: 1; }
          100% { top: 10%; opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};
