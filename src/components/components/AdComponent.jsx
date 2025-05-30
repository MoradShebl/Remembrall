import { useEffect } from "react";

const AdComponent = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <ins className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-pub-1403339508001526"
      data-ad-slot="4378125442"
      data-ad-format="auto"
      data-full-width-responsive="true">
    </ins>
  );
};

export default AdComponent;
