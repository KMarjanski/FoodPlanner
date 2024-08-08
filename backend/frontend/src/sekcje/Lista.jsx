import React, { useContext, useEffect } from "react";
import { Badge } from "react-bootstrap";
import kategorieProduktow from "./KategorieProduktow";
import { StoreContext } from "../store/StoreProvider";

const Lista = () => {
  const { cookRaw, customSortCart } = kategorieProduktow;
  const { list, setList } = useContext(StoreContext);
  useEffect(() => {
    fetch(`/cart`, {
      method: "GET",
      "Content-type": "application/json",
    })
      .then((response) => response.json())
      .then((thisData) => {
        setList(
          customSortCart(cookRaw(thisData[0].cart)).map((l) => ({
            ...l,
            ingredients: l.ingredients.map((i) => ({
              name: i,
              checked: false,
            })),
          }))
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <center>
      {list.map((l) => (
        <>
          <h2 key={l.category}>{l.category}</h2>
          {l.ingredients.map((i) => (
            <Badge
              onClick={() =>
                setList((old) =>
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
