// src/components/PlayerAuthBridge.jsx
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePlayer } from '../hooks/usePlayer';

/**
 * This component bridges the Auth and Player contexts
 * It registers the stopPlayback function with AuthContext
 * so that logout can stop any playing music
 */
const PlayerAuthBridge = () => {
  const { setStopPlaybackCallback } = useAuth();
  const { stopPlayback } = usePlayer();

  useEffect(() => {
    // Register the stopPlayback function with AuthContext
    if (setStopPlaybackCallback && stopPlayback) {
      setStopPlaybackCallback(stopPlayback);
    }
  }, [setStopPlaybackCallback, stopPlayback]);

  // This component doesn't render anything
  return null;
};

export default PlayerAuthBridge;
