import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  // State for minutes, seconds, centiseconds
  const [time, setTime] = useState({ minutes: 0, seconds: 0, centiseconds: 0 });
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const timerRef = useRef(null); // Mutable ref for interval ID

  // useEffect for setting/clearing interval
  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setTime((prev) => {
          let { minutes, seconds, centiseconds } = prev;
          centiseconds += 1;
          if (centiseconds === 100) {
            centiseconds = 0;
            seconds += 1;
          }
          if (seconds === 60) {
            seconds = 0;
            minutes += 1;
          }
          return { minutes, seconds, centiseconds };
        });
      }, 10); // 10ms = 1 centisecond
    }

    return () => clearInterval(timerRef.current); // Cleanup on unmount
  }, [running]);

  const handleStart = () => setRunning(true);
  const handleStop = () => {
    setRunning(false);
    clearInterval(timerRef.current);
  };
  const handleReset = () => {
    setRunning(false);
    clearInterval(timerRef.current);
    setTime({ minutes: 0, seconds: 0, centiseconds: 0 });
    setLaps([]);
  };
  const handleLap = () => {
    const formatted = formatTime(time);
    setLaps((prevLaps) => [...prevLaps, formatted]);
  };

  const pad = (num) => (num < 10 ? "0" + num : num);
  const formatTime = ({ minutes, seconds, centiseconds }) =>
    `${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;

  return (
    <div className="lap-timer">
      <h1>Lap Timer</h1>
      <div className="display">{formatTime(time)}</div>
      <div className="controls">
        {!running ? (
          <button onClick={handleStart}>Start</button>
        ) : (
          <button onClick={handleStop}>Stop</button>
        )}
        <button onClick={handleLap} disabled={!running}>
          Lap
        </button>
        <button onClick={handleReset}>Reset</button>
      </div>
      <ul className="laps">
        {laps.map((lap, index) => (
          <li key={index}>Lap {index + 1}: {lap}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

