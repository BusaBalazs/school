import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

const Reader = ({ scanId }) => {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const [cameraError, setCameraError] = useState(null);

  useEffect(() => {
    let stopped = false;

    const startScanner = async () => {
      if (!videoRef.current) return;

      try {
        // Check for camera devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some((d) => d.kind === "videoinput");
        if (!hasCamera) {
          setCameraError("no camera");
          return;
        }

        scannerRef.current = new QrScanner(
          videoRef.current,
          (result) => {
            scanId(result.data);
            scannerRef.current.stop();
          },
          {
            preferredCamera: "environment",
            onDecodeError: (err) => {
              // Optionally handle decode errors here
            },
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        );

        await scannerRef.current.start();
      } catch (err) {
        setCameraError("can't access camera");
      }
    };

    startScanner();

    return () => {
      stopped = true;
      scannerRef.current?.stop();
    };
  }, [scanId]);

  // Browser-specific instructions
  const getInstructions = () => {
    const ua = navigator.userAgent;
    if (ua.includes("Chrome")) {
      return (
        <ul>
          <li>
            Kattints a böngésző címsorában a kamera ikonjára vagy a lakat
            ikonra.
          </li>
          <li>Állítsd vissza a kamera engedélyt "Engedélyezés"-re.</li>
          <li>Töltsd újra az oldalt.</li>
        </ul>
      );
    } else if (ua.includes("Firefox")) {
      return (
        <ul>
          <li>Kattints a lakat ikonra a címsorban.</li>
          <li>Állítsd vissza a kamera engedélyt "Engedélyezés"-re.</li>
          <li>Töltsd újra az oldalt.</li>
        </ul>
      );
    } else if (ua.includes("Safari")) {
      return (
        <ul>
          <li>
            Nyisd meg a Safari beállításokat (Safari &gt; Beállítások &gt;
            Webhelyek &gt; Kamera).
          </li>
          <li>Állítsd vissza az engedélyt az oldalhoz.</li>
          <li>Töltsd újra az oldalt.</li>
        </ul>
      );
    } else {
      return (
        <ul>
          <li>Keresd meg a böngésző beállításaiban a kamera engedélyeket.</li>
          <li>Állítsd vissza az engedélyt az oldalhoz.</li>
          <li>Töltsd újra az oldalt.</li>
        </ul>
      );
    }
  };
  console.log(cameraError);
  //------------------------------------------------------------------
  return (
    <div>
      {cameraError && cameraError === "can't access camera" ? (
        <div
          style={{
            width: "88%",
            color: "red",
            padding: 16,
            margin: "0 auto",
            background: "#fffbe6",
            border: "1px solid #ffe58f",
            borderRadius: 8,
          }}
        >
          <b>Nem sikerült elérni a kamerát.</b>
          <p>
            Lehet, hogy korábban megtagadtad a kamera engedélyt. Kérlek, állítsd
            vissza az engedélyt a böngésző beállításaiban, majd töltsd újra az
            oldalt.
          </p>
          {getInstructions()}
        </div>
      ) : cameraError && cameraError === "no camera" ? (
        <div
          style={{
            width: "88%",
            color: "red",
            padding: 16,
            margin: "0 auto",
            background: "#fffbe6",
            border: "1px solid #ffe58f",
            borderRadius: 8,
          }}
        >
          <b>Nem sikerült elérni a kamerát.</b>
          <p>
            Úgy tűnik, hogy az eszközödön nincs kamera. Kérlek, próbáld meg egy
            másik eszközön.
          </p>
        </div>
      ) : (
        <>
          <video ref={videoRef} style={{ width: "100%", maxWidth: 500 }} />
        </>
      )}
    </div>
  );
};

export default Reader;
