import React from 'react';
import { Typography, Box, Modal, InputBase, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const SlippageModal = ({ slippage, modalOpen, closeModal, setSlippage }) => {
  const handleChange = (e) => {
    const value = e.target.value;
    if (value > 50) setSlippage(50);
    else setSlippage(value);
  };

  return (
    <Modal
      open={modalOpen}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="slippageModalBox">
        <Grid justifyContent={'space-between'} container alignItems={'center'}>
          <Typography variant="h6" component="h2" color={'white'}>
            Swap Transaction Settings
          </Typography>
          <CloseIcon onClick={closeModal} className="close-button" />
        </Grid>
        <Typography variant="h6">Slippage tolerance:</Typography>
        <Grid className="search-box">
          <InputBase
            onChange={(e) => handleChange(e)}
            fullWidth={true}
            value={slippage}
            type="number"
          />
          <div className="set-auto" onClick={() => setSlippage(1)}>
            Auto
          </div>
        </Grid>
        <Typography className="description">
          Slippage tolerance is a pricing difference between the price at the
          confirmation time and the actual price of the transaction users are
          willing to accept when swapping.
        </Typography>
      </Box>
    </Modal>
  );
};

export default SlippageModal;
