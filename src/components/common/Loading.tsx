import { Center, Spinner } from "@chakra-ui/react";
import React from "react";

const Loading = React.memo(() => {

	console.log('re-rendered loading')
  return (
    <Center w='100%' flexGrow={1} p={4}>
      <Spinner color="blue.400" thickness='3px' />
    </Center>
  );
});

export default Loading;
