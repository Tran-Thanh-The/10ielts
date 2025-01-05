import { EPracticeFilter } from '@/types/enum/practice.enum';
import { PRACTICE_FILTER } from '@/utils/constants/constants';
import { Box, Typography } from '@mui/material';
import React from 'react';

type Props = {
  value: EPracticeFilter;
  onChange: (value: EPracticeFilter) => void;
};

export default function PracticeFilter({ value, onChange }: Props) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '16px',
        borderRadius: '24px',
        border: '1px solid #e0e0e0',
        '& .filter-item:last-child': {
          borderRight: 'none',
        },
        '& .filter-item:first-of-type img': {
          width: 27,
          height: 27,
        },
      }}
    >
      {PRACTICE_FILTER.map((filter, index) => (
        <Box
          key={filter.value || index} 
          sx={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            cursor: filter.disabled ? 'default' : 'pointer',
            borderRight: '1px solid #e0e0e0',
            justifyContent: 'center',
          }}
          className="filter-item"
          onClick={() => !filter.disabled && onChange(filter.value)}
        >
          <Box>
            <img
              width={40}
              height={40}
              src={filter.icon}
              alt={filter.title}
              style={{
                filter: value === filter.value ? 'unset' : 'brightness(0)',
              }}
            />
          </Box>
          <Typography
            variant="h6"
            sx={{ marginTop: '-6px' }}
            color={value === filter.value ? 'primary' : 'textPrimary'}
          >
            {filter.title}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
