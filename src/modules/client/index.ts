import axios from "axios";
import { useCallback } from "react";
import { useSetRecoilState } from "recoil";
import { useAuth } from "../auth";

export const useClient = () => {
	const { user } = useAuth();

  const client = useCallback(
    axios.create({
      baseURL: `${window.location.protocol}//${window.location.host}/api`,
			headers: {
				'X-APIKEY': user?.apiKey || ''
			}
    }),
    [user]
  );

	return {
		client,
	}
};
