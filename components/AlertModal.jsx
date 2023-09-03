import React from 'react';
import { Modal, Box, Typography, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AlertModal = (props) => {
  const { modalOpen, closeModal, text } = props;
  return (
    <Modal
      open={modalOpen}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="alert_modal">
        <Grid justifyContent={'space-between'} container alignItems={'center'}>
          <Typography
            id="modal-modal-title"
            color={'white'}
            variant="h6"
            component="h2"
          >
            Congratulations
          </Typography>
          <CloseIcon onClick={closeModal} className="close-button" />
        </Grid>
        <Typography
          id="modal-modal-description"
          color={'#6c86ad'}
          sx={{ mt: 2 }}
        >
          {text}
        </Typography>
      </Box>
    </Modal>
  );
};

export default AlertModal;
