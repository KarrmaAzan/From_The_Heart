import React, { createContext, useState } from 'react';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);
  const [queueSource, setQueueSource] = useState(null);

  const playTrack = (track, tracks = [], source = null) => {
    setCurrentTrack(track);
    setQueue(tracks);
    setQueueSource(source);
  };

  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        setCurrentTrack,
        queue,
        setQueue,
        queueSource,
        setQueueSource,
        playTrack,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};