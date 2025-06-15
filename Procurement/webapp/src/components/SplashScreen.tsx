import React, { useEffect } from "react";

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    // Duration for splash screen (in ms)
    const duration = 3000;
    const timer = setTimeout(onFinish, duration);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-50">
      <img src="/icon1.gif" alt="Splash" className="max-w-full max-h-full" />
    </div>
  );
};

export default SplashScreen;