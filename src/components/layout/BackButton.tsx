import { Icon, IconButton } from '@chakra-ui/react';
import { TbArrowNarrowLeft } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

function BackButton() {
  const navigate = useNavigate();

  return (
    <IconButton
      aria-label="go back"
      icon={<Icon as={TbArrowNarrowLeft} w={6} h={6} />}
      variant="ghost"
      size="lg"
      isRound
      onClick={() => navigate(-1)}
    />
  );
}

export default BackButton;
