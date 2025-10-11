// src/context/PlayerContext.jsx
import React, { createContext, useState, useRef, useEffect } from 'react';
import { likeTrack } from '../services/api';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const audioRef = useRef(new Audio());
  const PREVIEW_DURATION = 30; // 30 seconds preview for non-authenticated users

  useEffect(() => {
    // Set up audio event listeners
    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      const currentTime = audio.currentTime;
      setCurrentTime(currentTime);

      // Stop playback at 30 seconds in preview mode
      if (isPreviewMode && currentTime >= PREVIEW_DURATION) {
        audio.pause();
        setIsPlaying(false);
        audio.currentTime = 0;
        setCurrentTime(0);
      }
    };

    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => playNextTrack();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    // Clean up event listeners
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [queue, queueIndex, isPreviewMode]);

  // Update audio source when current track changes
  useEffect(() => {
    if (currentTrack) {
      const audio = audioRef.current;

      // Check if track has a valid audio URL
      if (!currentTrack.audioUrl) {
        console.error('Track has no audio URL:', currentTrack);
        alert('This track has no audio file. The seeded tracks are sample data only. Please upload a real track to play music.');
        setIsPlaying(false);
        return;
      }

      audio.src = currentTrack.audioUrl;
      audio.volume = volume;

      // Add error handler for audio loading
      const handleError = () => {
        console.error('Error loading audio file:', currentTrack.audioUrl);
        alert('Cannot play this track. The audio file does not exist. Seeded tracks are sample data only - please upload a real track with an audio file.');
        setIsPlaying(false);
      };

      audio.addEventListener('error', handleError);

      if (isPlaying) {
        audio.play().catch(error => {
          console.error('Error playing audio:', error);
          alert('Cannot play this track. Please upload a track with a valid audio file.');
          setIsPlaying(false);
        });
      }

      return () => {
        audio.removeEventListener('error', handleError);
      };
    }
  }, [currentTrack]);

  // Update volume when it changes
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const playTrack = (track, previewMode = false) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setIsPreviewMode(previewMode);

    // If track doesn't exist in queue, add it
    if (!queue.some(t => t.id === track.id)) {
      setQueue(prev => [...prev, track]);
      setQueueIndex(queue.length);
    } else {
      // Find index of track in queue
      const index = queue.findIndex(t => t.id === track.id);
      setQueueIndex(index);
    }
  };

  const stopPlayback = () => {
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    setCurrentTrack(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setQueue([]);
    setQueueIndex(0);
    setIsPreviewMode(false);
  };

  const playQueue = (tracks, startIndex = 0) => {
    if (tracks && tracks.length > 0) {
      setQueue(tracks);
      setQueueIndex(startIndex);
      setCurrentTrack(tracks[startIndex]);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (!currentTrack) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => console.error('Error playing audio:', error));
    }
    setIsPlaying(!isPlaying);
  };

  const playNextTrack = () => {
    if (queue.length === 0) return;
    
    const nextIndex = (queueIndex + 1) % queue.length;
    setQueueIndex(nextIndex);
    setCurrentTrack(queue[nextIndex]);
    setIsPlaying(true);
  };

  const playPreviousTrack = () => {
    if (queue.length === 0) return;
    
    // If we're past 3 seconds in the song, restart it instead of going to previous
    if (currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    
    const prevIndex = (queueIndex - 1 + queue.length) % queue.length;
    setQueueIndex(prevIndex);
    setCurrentTrack(queue[prevIndex]);
    setIsPlaying(true);
  };

  const seekTo = (time) => {
    if (!currentTrack) return;
    
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleLike = async (trackId) => {
    try {
      await likeTrack(trackId);
      
      // Update the like status in the queue and current track
      const updatedQueue = queue.map(track => 
        track.id === trackId 
          ? { ...track, isLiked: !track.isLiked } 
          : track
      );
      
      setQueue(updatedQueue);
      
      if (currentTrack && currentTrack.id === trackId) {
        setCurrentTrack({
          ...currentTrack,
          isLiked: !currentTrack.isLiked
        });
      }
      
      return true;
    } catch (error) {
      console.error('Error liking track:', error);
      return false;
    }
  };

  const value = {
    currentTrack,
    isPlaying,
    duration,
    currentTime,
    volume,
    queue,
    queueIndex,
    isPreviewMode,
    playTrack,
    playQueue,
    togglePlay,
    playNextTrack,
    playPreviousTrack,
    seekTo,
    setVolume,
    handleLike,
    stopPlayback
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
};