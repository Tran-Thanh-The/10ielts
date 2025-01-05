import { Button, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';

const ExportMenu = ({ onExportPDF, onExportCSV }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExportPDF = () => {
    onExportPDF();
    handleClose();
  };

  const handleExportCSV = () => {
    onExportCSV();
    handleClose();
  };

  return (
    <div>
      <Button
        variant="contained"
        startIcon={<DownloadIcon />}
        onClick={handleClick}
      >
        Xuất báo cáo
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleExportPDF}>Xuất PDF</MenuItem>
        <MenuItem onClick={handleExportCSV}>Xuất CSV</MenuItem>
      </Menu>
    </div>
  );
};

export default ExportMenu;
