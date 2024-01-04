import { Dispatch, SetStateAction, createContext, useContext } from 'react';

export const UserScheduleContext = createContext<
  [UserSchedule, Dispatch<SetStateAction<UserSchedule>>] | undefined
>(undefined);

export const useUserScheduleContext = () => {
  const schedule = useContext(UserScheduleContext);

  if (!schedule) throw new Error('UserScheduleContext is undefined');

  return schedule;
};
