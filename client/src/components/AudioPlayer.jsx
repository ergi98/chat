import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './audio.module.css';

// Antd
import { Button, Slider } from 'antd';

// Icons
import { PauseOutlined, CaretRightOutlined } from '@ant-design/icons';

function AudioPlayer(props) {
  const [duration, setDuration] = useState('00:00');
  const [playing, setPlaying] = useState(false);
  const [timelinePosition, setTimelinePosition] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    function setAudioDuration() {
      let duration = currentAudio.duration;
      setDuration(duration);
    }

    function setAudioEventListeners(currentAudio) {
      currentAudio.load();
      currentAudio.onloadedmetadata = () => {
        if (currentAudio.duration == Infinity) {
          currentAudio.currentTime = 1e101;
          currentAudio.ontimeupdate = () => {
            currentAudio.ontimeupdate = updateTimelinePosition;
            currentAudio.currentTime = 0;
          };
        }
      };
      currentAudio.ondurationchange = setAudioDuration;
    }

    let currentAudio = audioRef.current;
    props.src && setAudioEventListeners(currentAudio);
  }, [props.src]);

  function updateTimelinePosition() {
    const percentagePosition = (100 * audioRef.current.currentTime) / audioRef.current.duration;
    setTimelinePosition(percentagePosition);
  }

  function toggleAudio(finished = false) {
    if (!finished) {
      if (audioRef.current.paused) {
        audioRef.current
          .play()
          .then(() => {
            setPlaying((prev) => !prev);
          })
          .catch((err) => {
            console.log('Error', err);
          });
      } else {
        audioRef.current.pause();
        setPlaying((prev) => !prev);
      }
    } else {
      audioRef.current.currentTime = 0;
      setPlaying((prev) => !prev);
    }
  }

  function seekAudio(value) {
    const position = (value * duration) / 100;
    setTimelinePosition(value);
    audioRef.current.currentTime = position;
  }

  const formattedDuration = useMemo(() => {
    let localDuration = duration;
    if (localDuration == Infinity || isNaN(localDuration) || !localDuration) return '00:00';
    let min = 0,
      sec = 0;

    while (localDuration > 0) {
      if (localDuration > 60) {
        min++;
        localDuration -= 60;
      } else {
        sec += Math.round(localDuration);
        localDuration = 0;
      }
    }

    let paddedMin = min.toString().padStart(2, '0');
    let paddedSec = sec.toString().padStart(2, '0');

    return `${paddedMin}:${paddedSec}`;
  }, [duration]);

  return (
    <div className={styles['audio-player']}>
      <audio ref={audioRef} onEnded={() => toggleAudio(true)}>
        <source src={props.src} />
      </audio>
      <div className={styles.controls}>
        <Button
          onClick={() => toggleAudio()}
          className={styles['player-button']}
          icon={playing ? <PauseOutlined /> : <CaretRightOutlined />}
          shape="circle"
        />
        <Slider
          value={timelinePosition}
          className={styles.timeline}
          tooltipVisible={false}
          onChange={seekAudio}
          defaultValue={0}
          step={0.1}
          max={100}
          min={0}
        />
        <div className={styles['audio-duration']}>{formattedDuration}</div>
      </div>
    </div>
  );
}

export default AudioPlayer;
