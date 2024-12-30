import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import MicNoneIcon from '@mui/icons-material/MicNone';
import MicOffIcon from '@mui/icons-material/MicOff';
import Countdown from 'react-countdown';
import RoleBasedComponent from '@/components/RoleBasedComponent';
import { ROLE } from '@/utils/constants/constants';
import { useDispatch } from 'react-redux';
import { setDoExerciseForm } from '@/stores/slices/appSlice';

export default function PracticeSpeaking({ data }) {
  const dispatch = useDispatch();
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [countDown, setCountDown] = React.useState(0);

  const startRecording = async () => {
    setCountDown(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // mp3
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/mp3',
        });
        setAudioURL(URL.createObjectURL(audioBlob));
        audioChunksRef.current = [];
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    // convert Blob 
    const audioBlob = new Blob(audioChunksRef.current, {
      type: 'audio/mp3',
    });
    dispatch(setDoExerciseForm({ audioAnswer: audioBlob }));
    setIsRecording(false);
  };

  useEffect(() => {
      const interval = setInterval(() => {
        if (countDown >= 15*60) {
          clearInterval(interval);
          return;
        }
        setCountDown((prev) => prev + 1);
      }, 1000);
  
      return () => {
        clearInterval(interval);
      };
    }, [countDown]);

  return (
    <Box sx={{ paddingTop: '20px' }}>
      <Typography variant="h6">Chủ đề: {data?.content}</Typography>

      <RoleBasedComponent allowedRoles={[ROLE.USER]}>
        <Box
          sx={{
            display: 'flex',
            gap: '20px',
            marginTop: '20px',
            flexDirection: 'column',
            border: '1px solid #ccc',
            padding: '20px',
            borderRadius: '12px',
          }}
        >
          <Typography variant="body1">Nhấn để bắt đầu ghi âm</Typography>
          <Box
            sx={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
            }}
          >
            {isRecording ? (
              <Button variant="text" sx={{ color: 'black' }}>
                00:{Math.floor(countDown / 60) ?? "00"}:{countDown % 60}
              </Button>
            ) : null}

            <Button
              sx={{
                borderRadius: '50%',
              }}
              variant="contained"
              onClick={startRecording}
              disabled={isRecording}
            >
              <MicNoneIcon />
            </Button>
            <Button
              sx={{
                borderRadius: '50%',
                backgroundColor: 'white',
                color: 'white',
              }}
              onClick={stopRecording}
              variant="contained"
              disabled={!isRecording}
            >
              <MicOffIcon color="error" />
            </Button>
          </Box>

          {audioURL && (
            <Box
              sx={{
                display: 'flex',
                gap: '12px',
                flexDirection: 'column',
                marginTop: '20px',
              }}
            >
              <Typography variant="h6">Bản ghi của bạn</Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                }}
              >
                <audio controls src={audioURL}></audio>
                <a href={audioURL} download="recording.wav">
                  Download
                </a>
              </Box>
            </Box>
          )}
        </Box>
      </RoleBasedComponent>
    </Box>
  );
}
