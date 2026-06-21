import { Icon, IconButton } from '@chakra-ui/react';
import { TbArrowNarrowLeft } from 'react-icons/tb';
import { useNavigate } from 'react-router';

function BackButton() {
  const navigate = useNavigate();

  return (
    <IconButton
      aria-label="go back"
      variant="ghost"
      size="lg"
      borderRadius="full"
      onClick={() => navigate(-1)}
    >
      {<Icon as={TbArrowNarrowLeft} w={6} h={6} />}
    </IconButton>
  );
}

export default BackButton;
