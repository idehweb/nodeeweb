import { Delete } from '@mui/icons-material';
import { styled, IconButton } from '@mui/material';

const StyledButton = styled(IconButton)({
  position: 'absolute',
  right: 0,
  top: 0,
  fontSize: 16,
  transition: '0.2s all ease-in-out',
  color: 'rgb(244, 67, 54)',
  padding: 4,
});

export default function EveryFields({ onClick }) {
  return (
    <StyledButton tabIndex={-1} className="remove-button" onClick={onClick}>
      <Delete />
    </StyledButton>
  );
}
