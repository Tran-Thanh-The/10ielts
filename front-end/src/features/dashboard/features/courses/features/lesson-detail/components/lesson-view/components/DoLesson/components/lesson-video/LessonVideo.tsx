import React from 'react';
import ReactPlayer from 'react-player';
import { Box } from '@mui/material';

interface Props {
  url: string;
}

const LessonVideo: React.FC<Props> = ({ url }) => {
  return (
    <ReactPlayer
      url={url}
      width="100%"
      height="100%"
      controls
      onPlay={() => console.log('Video is playing')}
      onPause={() => console.log('Video is paused')}
    />
  );
};

export default LessonVideo;
