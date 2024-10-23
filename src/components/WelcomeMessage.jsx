// WelcomeMessage.js
import React, { useEffect, useState } from 'react';

const WelcomeMessage = ({ displayname }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    // Show the text on component mount
    setIsVisible(true);

    // Set a timeout to hide the text after 3 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Set another timeout to remove from the DOM after fade out
      const removeTimer = setTimeout(() => {
        setShouldRender(false); //remove the component from the DOM
      }, 1000); //fade in 1 second

      return () => clearTimeout(removeTimer); // 3 seconds of text time
    }, 3000);

    // Cleanup the timer
    return () => clearTimeout(timer);
  }, []);

  if (!shouldRender) return null; // Prevent rendering when shouldRender is false

  return (
    <div className="flex flex-col items-center">
      <h1 className={`bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-sky-600 to-cyan-600 font-bold text-7xl sm:text-8xl md:text-9xl pb-5 tracking-tight transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        Welcome back,
      </h1>
      <h1 className={`bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-sky-600 to-cyan-600 font-bold text-7xl sm:text-8xl md:text-9xl pb-5 tracking-tight transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {displayname}
      </h1>
    </div>
  );
};

export default WelcomeMessage;
