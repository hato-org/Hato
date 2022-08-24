import { Divider, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { Link as RouterLink, useParams } from "react-router-dom";
import { TbChevronLeft } from "react-icons/tb";
import { default as Account } from "./Account";
import { MotionCenter } from "../motion";
import Theme from "./Theme";

export const Setting = () => {
  const { category } = useParams();

  let component;

  switch (category) {
    case "account":
      component = <Account />;
      break;

    case "theme":
      component = <Theme />;
      break;

    default:
      component = <></>;
      break;
  }

  return (
    <MotionCenter
      w="100%"
      initial={{
        x: "100vw",
        opacity: 0,
      }}
      animate={{
        x: 0,
        opacity: 1,
      }}
      exit={{
        x: "100vw",
        opacity: 0,
      }}
      transition={{
        type: "spring",
        bounce: 0,
        duration: 0.4,
      }}
      key={location.pathname}
      layout
    >
      <VStack w='100%' spacing={4}>
        <HStack w='100%' as={RouterLink} to="/settings" color='title'>
          <Icon as={TbChevronLeft} />
          <Text fontWeight='bold'>戻る</Text>
        </HStack>
				<Divider />
        {component}
      </VStack>
    </MotionCenter>
  );
};
