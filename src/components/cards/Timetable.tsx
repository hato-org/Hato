import {
  Box,
  Heading,
  VStack,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Icon,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Navigate, Link as RouterLink } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { useAuth } from "../../modules/auth";
import { useClient } from "../../modules/client";
import Error from "./Error";
import Loading from "../common/Loading";
import { TbChevronRight } from "react-icons/tb";
import TimetableTable from "../timetable/Table";
import { useCurrentTable } from "../../hooks/timetable";

const Timetable = () => {
  const { user } = useAuth();
  const date = new Date();

  if (!user) return <Navigate to="/login" replace />;

  const { data, isLoading, isError, error } = useCurrentTable(["dashboard"]);
  // useQuery<CurrentTimetable>(
  //   [
  //     "dashboard",
  //     "timetable",
  //     user.type,
  //     user.grade,
  //     user.class,
  //     user.course,
  //   ],
  //   async () =>
  //     (
  //       await client.get("/timetable/v1.1/now", {
  //         params: {
  //           type: user.type,
  //           grade: user.grade,
  //           class: user.class,
  //           course: user.course,
  //         },
  //       })
  //     ).data,
  // 		{
  // 			refetchOnWindowFocus: false,
  // 			refetchOnMount: false
  // 		}
  // );

  if (!data || isLoading) return <Loading />;

  if (error) return <Error error={error} />;

  return (
    <VStack w="100%">
      <HStack
        w="100%"
        pt={2}
        pl={2}
        as={RouterLink}
        to={`/timetable?y=${date.getFullYear()}&m=${date.getMonth() + 1}&d=${date.getDate()}`}
      >
        <Heading as="h2" size="md">
          時間割
        </Heading>
        <Spacer />
        <Text textStyle="title" color="gray.400">
          {data?.week}週 {data?.period}時間目
        </Text>
        <Icon as={TbChevronRight} w={5} h={5} />
      </HStack>
      <TimetableTable data={data} />
    </VStack>
  );
};

export default Timetable;
