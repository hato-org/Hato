import React, { Suspense } from 'react';
import { Portal } from '@chakra-ui/react';
// import Events from './Events';
// import AddToHomeScreen from './AddToHomeScreen';
// import ICalendar from './ICalendar';
const Events = React.lazy(() => import('./Events'));
const AddToHomeScreen = React.lazy(() => import('./AddToHomeScreen'));
const ICalendar = React.lazy(() => import('./ICalendar'));
const Pin = React.lazy(() => import('./Pin'));

// const Tutorial = {
//   Events,
//   AddToHomeScreen,
//   ICalendar,
// };

export default function Tutorial() {
  return (
    <Suspense>
      <Portal>
        <Events />
        <AddToHomeScreen />
        <ICalendar />
        <Pin />
      </Portal>
    </Suspense>
  );
}
