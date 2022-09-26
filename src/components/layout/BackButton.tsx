import { IconButton } from '@chakra-ui/react';
import { TbArrowNarrowLeft } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

function BackButton() {
  const navigate = useNavigate();

  return (
    <IconButton
      aria-label="go back"
      icon={<TbArrowNarrowLeft />}
      variant="ghost"
      size="lg"
      isRound
      onClick={() => navigate(-1)}
    />
  );
}

export default BackButton;
