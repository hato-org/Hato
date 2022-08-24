import { Heading, VStack } from "@chakra-ui/react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import Event from "../components/calendar/Event";
import BottomNavbar from "../components/nav/BottomNavbar";
import Header from "../components/nav/Header";

const EventDetail = () => {
  const { id } = useParams();
  console.log(id);



  return (
    <>
      <Helmet>
        <title></title>
      </Helmet>
      <Header>
        <Heading size="md">イベントの詳細</Heading>
      </Header>
			<Event id={id} />
      <BottomNavbar />
    </>
  );
};

export default EventDetail;
