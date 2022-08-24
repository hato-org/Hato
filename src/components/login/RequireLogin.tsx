import { Center } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../modules/auth";
import LoginButton from "./LoginButton";

interface RequireLoginProps {
	children: JSX.Element
}

const RequireLogin = ({ children }: RequireLoginProps) => {

	const { user } = useAuth();

	if (user) return children;

	return <Navigate to='/login' replace />

}

export default RequireLogin;