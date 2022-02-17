import React, { useState, useEffect, useRef } from 'react';
import styles from './audio.module.css';

// Antd
import { Button, Slider } from 'antd';

// Icons
import { PauseOutlined, CaretRightOutlined } from '@ant-design/icons';

function AudioPlayer(props) {
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [timelinePosition, setTimelinePosition] = useState('00:00');
  const audioRef = useRef(null);

  useEffect(() => {
    function setAudioDuration() {
      let duration = currentAudio.duration;
      if (duration == Infinity || isNaN(duration)) return '00:00';
      let min = 0,
        sec = 0;

      while (duration > 0) {
        if (duration > 60) {
          min++;
          duration -= 60;
        } else {
          sec += Math.round(duration);
          duration = 0;
        }
      }

      let paddedMin = min.toString().padStart(2, '0');
      let paddedSec = sec.toString().padStart(2, '0');

      setDuration(`${paddedMin}:${paddedSec}`);
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

  return (
    <>
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
            tipFormatter={null}
            defaultValue={0}
            step={0.1}
            max={100}
            min={0}
          />
          <div className={styles['audio-duration']}>{duration}</div>
        </div>
      </div>
    </>
  );
}

export default AudioPlayer;
