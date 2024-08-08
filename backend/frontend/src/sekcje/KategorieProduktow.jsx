import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBowlFood,
  faCow,
  faBottleWater,
  faAppleWhole,
  faSnowflake,
  faCubesStacked,
  faBreadSlice,
  faDog,
  faJar,
  faSoap,
  faMortarPestle,
  faCookie,
  faBraille,
  faTrashCan,
  faCarrot,
  faCannabis,
  faDrumSteelpan,
  faPepperHot,
} from "@fortawesome/free-solid-svg-icons";

class kategorieProduktow {
  getIngredientCategoryWithIcon = (category) => {
    switch (category) {
      case "Chemia":
        return (
          <>
            Chemia
            <FontAwesomeIcon className="ms-2" icon={faSoap} />
          </>
        );
      case "Dania gotowe":
        return (
          <>
            Dania gotowe
            <FontAwesomeIcon className="ms-2" icon={faBowlFood} />
          </>
        );
      case "Nabiał":
        return (
          <>
            Nabiał
            <FontAwesomeIcon className="ms-2" icon={faCow} />
          </>
        );
      case "Napoje":
        return (
          <>
            Napoje
            <FontAwesomeIcon className="ms-2" icon={faBottleWater} />
          </>
        );
      case "Mięsko":
        return (
          <>
            Mięsko
            <FontAwesomeIcon className="ms-2" icon={faDog} />
          </>
        );
      case "Mrożonki":
        return (
          <>
            Mrożonki
            <FontAwesomeIcon className="ms-2" icon={faSnowflake} />
          </>
        );
      case "Owoce":
        return (
          <>
            Owoce
            <FontAwesomeIcon className="ms-2" icon={faAppleWhole} />
          </>
        );
      case "Pasty":
        return (
          <>
            Pasty
            <FontAwesomeIcon className="ms-2" icon={faMortarPestle} />
          </>
        );
      case "Pieczywo":
        return (
          <>
            Pieczywo
            <FontAwesomeIcon className="ms-2" icon={faBreadSlice} />
          </>
        );
      case "Przyprawy":
        return (
          <>
            Przyprawy
            <FontAwesomeIcon className="ms-2" icon={faCubesStacked} />
          </>
        );
      case "Puszki":
        return (
          <>
            Puszki
            <FontAwesomeIcon className="ms-2" icon={faDrumSteelpan} />
          </>
        );
      case "Słodycze":
        return (
          <>
            Słodycze
            <FontAwesomeIcon className="ms-2" icon={faCookie} />
          </>
        );
      case "Słoiki":
        return (
          <>
            Słoiki
            <FontAwesomeIcon className="ms-2" icon={faJar} />
          </>
        );
      case "Snacki":
        return (
          <>
            Snacki
            <FontAwesomeIcon className="ms-2" icon={faTrashCan} />
          </>
        );
      case "Sosy":
        return (
          <>
            Sosy
            <FontAwesomeIcon className="ms-2" icon={faPepperHot} />
          </>
        );
      case "Suche":
        return (
          <>
            Suche
            <FontAwesomeIcon className="ms-2" icon={faBraille} />
          </>
        );
      case "Warzywa":
        return (
          <>
            Warzywa
            <FontAwesomeIcon className="ms-2" icon={faCarrot} />
          </>
        );
      case "Zioła":
        return (
          <>
            Zioła
            <FontAwesomeIcon className="ms-2" icon={faCannabis} />
          </>
        );
      default:
        break;
    }
  };
  handleOnClickIngredients = (
    x,
    neew = false,
    setSearch,
    search,
    setShowOverlay,
    setIngredients,
    category,
    setForm = null
  ) => {
    setForm &&
      setForm((old) => {
        if (old.ingredients.some((c) => c === x))
          return {
            ...old,
            ingredients: old.ingredients.filter((c) => c !== x),
          };
        else return { ...old, ingredients: [...old.ingredients, x] };
      });
    setSearch("");
    if (neew) {
      fetch("/addIngredient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: search, category }),
      }).then((res) => {
        setShowOverlay(false);
        if (res.status === 200) {
          setTimeout(() => {
            fetch(`/ingredients`, {
              method: "GET",
              "Content-type": "application/json",
            })
              .then((response) => response.json())
              .then((thisData) => {
                setIngredients(thisData);
              });
            // eslint-disable-next-line react-hooks/exhaustive-deps
          }, 100);
        } else if (res.status === 404) {
          setTimeout(() => {}, 1000);
        }
      });
    }
  };
  sortByName = (a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  };
  sortByCategory = (a, b) => {
    if (a.category < b.category) return -1;
    if (a.category > b.category) return 1;
    return 0;
  };
  cookRaw = (rawArr) => {
    return rawArr.reduce((acc, curr) => {
      if (!acc?.some((acc) => acc.category === curr.category))
        acc.push({ category: curr.category, ingredients: [curr.name] });
      else if (
        !acc
          ?.find((acc) => acc.category === curr.category)
          ?.ingredients?.some((ci) => ci === curr.name)
      ) {
        return acc.map((acc) =>
          acc.category === curr.category
            ? { ...acc, ingredients: [...acc.ingredients, curr.name] }
            : acc
        );
      }
      return acc;
    }, []);
  };
  customSortCart = (cart) =>
    [
      cart.find((c) => c.category === "Owoce") || [],
      cart.find((c) => c.category === "Warzywa") || [],
      cart.find((c) => c.category === "Zioła") || [],
      cart.find((c) => c.category === "Pieczywo") || [],
      cart.find((c) => c.category === "Pasty") || [],
      cart.find((c) => c.category === "Słoiki") || [],
      cart.find((c) => c.category === "Puszki") || [],
      cart.find((c) => c.category === "Przyprawy") || [],
      cart.find((c) => c.category === "Sosy") || [],
      cart.find((c) => c.category === "Dania gotowe") || [],
      cart.find((c) => c.category === "Nabiał") || [],
      cart.find((c) => c.category === "Mięsko") || [],
      cart.find((c) => c.category === "Mrożonki") || [],
      cart.find((c) => c.category === "Suche") || [],
      cart.find((c) => c.category === "Napoje") || [],
      cart.find((c) => c.category === "Słodycze") || [],
      cart.find((c) => c.category === "Snaki") || [],
      cart.find((c) => c.category === "Chemia") || [],
    ].filter((f) => f.length === undefined);
}

const kategorieProduktowInstance = new kategorieProduktow();

export default kategorieProduktowInstance;
