import React, { createContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export const StoreContext = createContext(null);

const StoreProvider = ({ children }) => {
  const emptyDay = {
    pn: { sni: [], o: [], k: [], sna: [] },
    wt: { sni: [], o: [], k: [], sna: [] },
    sr: { sni: [], o: [], k: [], sna: [] },
    czw: { sni: [], o: [], k: [], sna: [] },
    pt: { sni: [], o: [], k: [], sna: [] },
    sob: { sni: [], o: [], k: [], sna: [] },
    nd: { sni: [], o: [], k: [], sna: [] },
  };
  const defaultSelected = { id: uuidv4(), label: "", ...emptyDay };
  const [tab, setTab] = useState("Planer");
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [planners, setPlanners] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [cart, setCart] = useState([]);
  const [list, setList] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState({ selected: "UNO" });
  const [selected, setSelected] = useState(defaultSelected);

  return (
    <StoreContext.Provider
      value={{
        tab,
        setTab,
        categories,
        setCategories,
        ingredients,
        setIngredients,
        planners,
        setPlanners,
        recipes,
        setRecipes,
        selectedPlan,
        setSelectedPlan,
        cart,
        setCart,
        selected,
        setSelected,
        list,
        setList,
        emptyDay,
        defaultSelected,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
