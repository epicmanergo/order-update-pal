
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface TransitionWrapperProps {
  children: React.ReactNode;
}

const TransitionWrapper: React.FC<TransitionWrapperProps> = ({ children }) => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('page-enter');

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('page-exit');
      
      const timeout = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('page-enter');
      }, 300);
      
      return () => clearTimeout(timeout);
    }
  }, [location, displayLocation]);

  return (
    <div className={`${transitionStage} min-h-screen`}>
      {children}
    </div>
  );
};

export default TransitionWrapper;
