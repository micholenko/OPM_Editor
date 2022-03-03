import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import { EdgeSingular } from 'cytoscape';

import edgeTypes from '../options/edge-types.json';
console.log(edgeTypes);

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

interface ModalProps {
  open: boolean,
  setOpen: Function;
  createdEdge: EdgeSingular;
};

interface OptionProps {
  option: string;
  createdEdge: EdgeSingular;
  handleClose: Function;
};

const EdgeSelectionOption: React.FC<OptionProps> = ({ option, createdEdge, handleClose }) => {
  return (
    <Button onClick={() => {
      createdEdge.data({ 'type': option });
      handleClose();
    }}>{option}</Button>
  );
};



const EdgeSelectionModal: React.FC<ModalProps> = ({ open, setOpen, createdEdge }) => {

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  console.log(open);
  return (
    { open } &&
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Choose edge type.
        </Typography>
        <div id="modal-modal-description">
          {edgeTypes.map((option: string) => <EdgeSelectionOption option={option} createdEdge={createdEdge} handleClose={handleClose} />)}
        </div>
      </Box>
    </Modal>
  );
};

export default EdgeSelectionModal;