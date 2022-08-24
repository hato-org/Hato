import { Center } from "@chakra-ui/react"
import { Helmet } from "react-helmet-async";


const NotFound = () => {

	return (
		<>
		<Helmet>
			<title>404 Not Found - Hato</title>
		</Helmet>
		<Center w='100%' h='100%' flexDir='column'>
			404
		</Center>
		</>
	)
}

export default NotFound;