import {
  Center,
  Heading,
  HStack,
  Icon,
  IconButton,
  Spacer,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { TbPlus } from "react-icons/tb";
import { useSearchParams } from "react-router-dom";
import AddEventDrawer from "../components/calendar/AddEventDrawer";
import UpcomingEvents from "../components/calendar/UpcomingEvents";
import Loading from "../components/common/Loading";
import BottomNavbar from "../components/nav/BottomNavbar";
import Header from "../components/nav/Header";
import TimetableTable from "../components/timetable/Table";
import { useCurrentTable } from "../hooks/timetable";

const Timetable = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const tableQuery = useCurrentTable();

  return (
    <>
      <Helmet>
        <title>時間割 - Hato</title>
      </Helmet>
      <Header>
        <Heading size="md">時間割</Heading>
      </Header>
      <Center w="100%" p={8} mb={16}>
        <VStack w="100%" align="flex-start" spacing={8}>
          <TimetableTable {...tableQuery} />
          <VStack w="100%" spacing={2}>
            <HStack w="100%">
              <Heading size="md">予定されているイベント</Heading>
              <Spacer />
              <IconButton
                aria-label="予定の追加"
                icon={<TbPlus />}
                variant="ghost"
                isRound
                onClick={onOpen}
              />
            </HStack>
            <UpcomingEvents
              year={Number(searchParams.get("y"))}
              month={Number(searchParams.get("m"))}
              day={Number(searchParams.get("d"))}
            />
          </VStack>
        </VStack>
      </Center>
      <BottomNavbar />
      <AddEventDrawer isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Timetable;
