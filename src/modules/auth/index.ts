import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import axios from "axios";
import { authAtom, userAtom } from "../../store/auth";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [user, setUser] = useRecoilState(userAtom);
  const toast = useToast({
    position: 'top-right',
    variant: 'left-accent',
  });
	const navigate = useNavigate();

  const onFail = useCallback(
    (error: any) => {
      console.error("Error occurred while logging in:", error);

      toast({
        title: "ログインでエラーが発生しました",
        status: "error",
      });

      setUser(null);
    },
    [toast]
  );

  const login = useCallback(
    async ({ credential }: GoogleCredentialResponse) => {
      try {
        // サーバーにユーザーデータ問い合わせ
        const { user } = await getToken(credential);

        // 返却されたJWTとユーザーデータをatomに格納
        setUser(user);

        toast({
          title: `${user.name}でログインしました。`,
          status: "success",
        });

        navigate('/')
      } catch (error) {
        onFail(error);
      }
    },
    [toast, setUser]
  );

  const logout = useCallback(() => {
    setUser(null);
  }, [setUser]);

  const update = useCallback(async (newUser: Partial<User>) => {
    try {
  
      const res = await axios.post<User>('/api/user', {...newUser, _id: user?._id});
      if (res.status !== 200) throw Error('Failed to save user setting');
      
      toast({
        title: '保存しました',
        status: 'success'
      })

      setUser(res.data)

    } catch(error) {
      console.error(error);
      toast({
        title: '保存できませんでした',
        status: 'error',
      })
    } 
  }, [user])

  return { user, login, logout, update };
};

const getToken = async (credential: string) => {
  const res = await axios.post("/api/user/login", { token: credential });
  console.log(res);
  if (res.status !== 200) throw Error("Failed to acquire token");

  return res.data;
};
