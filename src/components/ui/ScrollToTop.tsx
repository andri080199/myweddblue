import { useEffect } from "react";
import { useRouter } from "next/router";

const ScrollToTop = () => {
  const router = useRouter();

  useEffect(() => {
    // Gulir ke atas ketika halaman dimuat
    window.scrollTo(0, 0);
  }, [router.asPath]); // Jalan setiap kali URL berubah

  return null;
};

export default ScrollToTop;
