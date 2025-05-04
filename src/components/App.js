import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [time, setTime] = useState({ minutes: 0, seconds: 0, centiseconds: 0 });
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const timerRef = useRef(null);

  // Format time as MM:SS:CC
  const pad = (num) => (num < 10 ? "0" + num : num);
  const formatTime = ({ minutes, seconds, centiseconds }) =>
    `${pad(minutes)}:${pad(seconds)}:${pad(centiseconds)}`;

  const start = () => {
    if (!running) setRunning(true);
  };

  const stop = () => {
    setRunning(false);
  };

  const lap = () => {
    if (running) {
      setLaps((prev) => [...prev, formatTime(time)]);
    }
  };

  const reset = () => {
    setRunning(false);
    setTime({ minutes: 0, seconds: 0, centiseconds: 0 });
    setLaps([]);
  };

  // Start the interval when running is true
  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setTime((prev) => {
          let { minutes, seconds, centiseconds } = prev;
          centiseconds++;
          if (centiseconds === 100) {
            centiseconds = 0;
            seconds++;
          }
          if (seconds === 60) {
            seconds = 0;
            minutes++;
          }
          return { minutes, seconds, centiseconds };
        });
      }, 10); // Every 10ms
    }

    // Clear interval when stopped or unmounted
    return () => clearInterval(timerRef.current);
  }, [running]);

  return (
    <div className="lap-timer">
      <div className="display">{formatTime(time)}</div>
      <div className="controls">
        <button onClick={start}>Start</button>
        <button onClick={stop}>Stop</button>
        <button onClick={lap}>Lap</button>
        <button onClick={reset}>Reset</button>
      </div>
      <ul className="laps">
        {laps.map((lapTime, index) => (
          <li key={index}>Lap {index + 1}: {lapTime}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;


