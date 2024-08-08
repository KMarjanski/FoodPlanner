import React, { useContext, useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import kategorieProduktow from "./KategorieProduktow";
import { StoreContext } from "../store/StoreProvider";

const Lista = () => {
  const { cookRaw, customSortCart } = kategorieProduktow;
  const { list, setList } = useContext(StoreContext);
  const [lista, setLista] = useState([]);
  useEffect(() => {
    fetch(`/cart`, {
      method: "GET",
      "Content-type": "application/json",
    })
      .then((response) => response.json())
      .then((thisData) => {
        setList((old) => {
          const thisList = customSortCart(cookRaw(thisData[0].cart));
          if (JSON.stringify(old) === JSON.stringify(thisList)) return old;
          else return thisList;
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setLista(
      list.map((l) => ({
        ...l,
        ingredients: l.ingredients.map((i) => ({
          name: i,
          checked: false,
        })),
      }))
    );
  }, [list]);

  return (
    <center>
      {lista.map((l) => (
        <>
          <h2 key={l.category}>{l.category}</h2>
          {l.ingredients.map((i) => (
            <Badge
              onClick={() =>
                setLista((old) =>
                  old.map((o) => {
                    if (o.category === l.category) {
                      return {
                        ...o,
                        ingredients: o.ingredients.map((oi) => {
                          if (oi.name === i.name) {
                            return { ...oi, checked: !oi.checked };
                          } else return oi;
                        }),
                      };
                    } else return o;
                  })
                )
              }
              bg={i.checked ? "info" : "success"}
              key={i.name}
              style={{ display: "block" }}
              className="mb-3 py-3"
            >
              {i.name}
            </Badge>
          ))}
        </>
      ))}
    </center>
  );
};

export default Lista;
