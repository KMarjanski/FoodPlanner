import React, { useContext, useEffect } from "react";
import { StoreContext } from "./store/StoreProvider";

import Navigation from './Navigation'
import Planer from './sekcje/Planer'
import Przepisy from './sekcje/Przepisy'
import Koszyk from './sekcje/Koszyk'
import DodajPrzepis from './sekcje/DodajPrzepis'
import Kalendarz from "./sekcje/Kalendarz";
import Lodowka from "./sekcje/Lodowka";

const App = () => {
  const { tab, setSelectedPlan } = useContext(StoreContext);
  useEffect(() => {
      fetch(`/selected`, {
        method: "GET",
        "Content-type": "application/json",
      })
        .then((response) => response.json())
        .then((thisData) => {
          setSelectedPlan(thisData[0]);
        });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  return (
    <>
      <Navigation />
      {tab === 'Planer' && <Planer />}
      {tab === 'Przepisy' && <Przepisy />}
      {tab === 'Koszyk' && <Koszyk />}
      {tab === 'Calendar' && <Kalendarz />}
      {tab === 'Lodowka' && <Lodowka />}
      {tab === 'DodajPrzepis' && <DodajPrzepis />}
      {tab.includes('PrzepisEdytowany') && <DodajPrzepis />}
    </>
  );
};

export default App;
