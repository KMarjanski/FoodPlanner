import React, { useEffect, useState } from "react";
import { Badge } from "react-bootstrap";
import kategorieProduktow from "./KategorieProduktow";

const Lista = () => {
  //   const mock = [
  //     {
  //       cart: [
  //         {
  //           inRecipes: [
  //             "Spring rolls",
  //             "Pad thai (baza)",
  //             "Tortilla z tofu",
  //             "Tom Yum",
  //             "Szaszłyki",
  //             "Tortilla z tofu kulami",
  //             "Tortilla z gyro-tofu",
  //           ],
  //           _id: "65c35e507217ec3d7453dec7",
  //           name: "Tofu",
  //           category: "Dania gotowe",
  //           __v: 0,
  //         },
  //         {
  //           inRecipes: ["Tortilla z gyro-tofu"],
  //           _id: "65cb9f542b88b747a4642cfd",
  //           name: "Hummus",
  //           category: "Dania gotowe",
  //           __v: 0,
  //         },
  //         {
  //           inRecipes: [
  //             "Tortilla z tofu",
  //             "Sos czosnkowy",
  //             "Schabowy z bakłażana",
  //             "Puree ziemniaczane z jajem sadzonym & mizeria",
  //             "Tortilla z tofu kulami",
  //             "Kaszanka veganka z ziemniaczkami",
  //             "Sałatka gryos",
  //             "Tortilla z gyro-tofu",
  //           ],
  //           _id: "65df4e99286e153b44b9967a",
  //           name: "Jogurt grecki",
  //           category: "Nabiał",
  //           __v: 0,
  //         },
  //         {
  //           inRecipes: [
  //             "Zupa pomidorowa",
  //             "Makaron z brokułem",
  //             "Zupa krem z cukinii",
  //             "Makaron z boczniakiem",
  //             "Tarta z gruszką i gorgonzolą",
  //             "Zupa krem z ciecierzycy",
  //             "Makaron z kurkami",
  //           ],
  //           _id: "65c35f047217ec3d7453ded2",
  //           name: "Śmietanka 30%",
  //           category: "Nabiał",
  //           __v: 0,
  //         },
  //         {
  //           inRecipes: [
  //             "Kiełbaski węgierskie",
  //             "Pasta jajeczna",
  //             "Bułka śniadaniowa",
  //             "Bułka kolacjowa",
  //             "Tarta z gruszką i gorgonzolą",
  //             "Puree ziemniaczane z jajem sadzonym & mizeria",
  //             "Stek z kapusty",
  //             "Makaron z kurkami",
  //           ],
  //           _id: "65c361dd7217ec3d7453def2",
  //           name: "Masło  ",
  //           category: "Nabiał",
  //           __v: 0,
  //         },
  //         {
  //           inRecipes: ["Grzanki", "Pizza", "Pinsa", "Sałatka Caprese"],
  //           _id: "65c363d17217ec3d7453df03",
  //           name: "Mozzarella",
  //           category: "Nabiał",
  //           __v: 0,
  //         },
  //         {
  //           inRecipes: ["Tortilla z gyro-tofu"],
  //           _id: "65cb9f022b88b747a4642cfb",
  //           name: "Tortilla",
  //           category: "Pieczywo",
  //           __v: 0,
  //         },
  //         {
  //           inRecipes: ["Sałatka gryos", "Sałatka Caprese", "Carpaccio z buraka"],
  //           _id: "66a7b4b905bad034fcc40e09",
  //           name: "Bagietka  ",
  //           category: "Pieczywo",
  //           __v: 0,
  //         },
  //         {
  //           inRecipes: ["Sałatka gryos", "Tortilla z gyro-tofu"],
  //           _id: "66a7b4a805bad034fcc40e08",
  //           name: "Przyprawa gyros",
  //           category: "Przyprawy",
  //           __v: 0,
  //         },
  //         {
  //           inRecipes: [
  //             "Makaron pomidorowy z mascarpone",
  //             "Makaron z brokułem",
  //             "Makaron pomidorowy z burratą",
  //             "Makaron z boczniakiem",
  //             "Tom Yum",
  //             "Makaron z kurkami",
  //           ],
  //           _id: "65cb9b1d2b88b747a4642cf7",
  //           name: "Makaron  ",
  //           category: "Suche",
  //           __v: 0,
  //         },
  //         {
  //           inRecipes: [
  //             "Orzo z tuńczykiem",
  //             "Sojowe bulgogi",
  //             "Burger fasolowy",
  //             "VegiBurgir",
  //             "VegiBurgirDżem",
  //             "VegiBurgirDzem",
  //             "Tortilla z tofu kulami",
  //             "Sałatka gryos",
  //             "Orzo z burakiem",
  //             "Tortilla z gyro-tofu",
  //           ],
  //           _id: "65c35cc67217ec3d7453deb6",
  //           name: "Cebula czerwona",
  //           category: "Warzywa",
  //           __v: 0,
  //         },
  //         {
  //           inRecipes: [
  //             "Orzo z tuńczykiem",
  //             "Sałatka grecka",
  //             "Tortilla z tofu",
  //             "Tortilla z tofu kulami",
  //             "Orzo z burakiem",
  //             "Tortilla z gyro-tofu",
  //           ],
  //           _id: "65c35cfd7217ec3d7453debb",
  //           name: "Pomidorki",
  //           category: "Warzywa",
  //           __v: 0,
  //         },
  //         {
  //           inRecipes: [
  //             "Orzo z tuńczykiem",
  //             "Spring rolls",
  //             "Sałatka grecka",
  //             "Tortilla z tofu",
  //             "Bao bao z boczniakiem",
  //             "Schabowy z bakłażana",
  //             "Puree ziemniaczane z jajem sadzonym & mizeria",
  //             "Bowl edamame",
  //             "Tortilla z tofu kulami",
  //             "Kaszanka veganka z ziemniaczkami",
  //             "Orzo z burakiem",
  //             "Tortilla z gyro-tofu",
  //           ],
  //           _id: "65c35d047217ec3d7453debc",
  //           name: "Ogórek",
  //           category: "Warzywa",
  //           __v: 0,
  //         },
  //         {
  //           inRecipes: [
  //             "Sałatka grecka",
  //             "Burger fasolowy",
  //             "Tortilla z tofu",
  //             "VegiBurgir",
  //             "VegiBurgirDżem",
  //             "VegiBurgirDzem",
  //             "Tortilla z tofu kulami",
  //             "Tacos chili sin carne",
  //             "Tortilla z gyro-tofu",
  //           ],
  //           _id: "65c35f3d7217ec3d7453ded4",
  //           name: "Sałata lodowa",
  //           category: "Warzywa",
  //           __v: 0,
  //         },
  //         {
  //           inRecipes: [
  //             "Tortilla z tofu",
  //             "Szaszłyki",
  //             "Tortilla z tofu kulami",
  //             "Tortilla z gyro-tofu",
  //           ],
  //           _id: "65d86781ed3a9c3f08338b78",
  //           name: "Papryka czerwona",
  //           category: "Warzywa",
  //           __v: 0,
  //         },
  //         {
  //           inRecipes: [
  //             "Curry pomidorowe",
  //             "Zupa pomidorowa",
  //             "Sałatka grecka",
  //             "Makaron pomidorowy z mascarpone",
  //             "Makaron z brokułem",
  //             "Makaron pomidorowy z burratą",
  //             "Zupa krem z cukinii",
  //             "Makaron z boczniakiem",
  //             "Curry (baza)",
  //             "Zupa krem z ciecierzycy",
  //             "La soupe aux choux (kapuśniaczek)",
  //             "Szaszłyki",
  //             "Makaron z kurkami",
  //           ],
  //           _id: "65c35b197217ec3d7453deaa",
  //           name: "Cebula",
  //           category: "Warzywa",
  //           __v: 0,
  //         },
  //         {
  //           inRecipes: ["Makaron z kurkami"],
  //           _id: "668ab7460088d719d84cfdc3",
  //           name: "Kurki",
  //           category: "Warzywa",
  //           __v: 0,
  //         },
  //         {
  //           inRecipes: [
  //             "Burger fasolowy",
  //             "VegiBurgir",
  //             "VegiBurgirDżem",
  //             "VegiBurgirDzem",
  //             "Pinsa",
  //             "Tacos chili sin carne",
  //             "Sałatka Caprese",
  //           ],
  //           _id: "65c360a17217ec3d7453dee7",
  //           name: "Pomidor ",
  //           category: "Warzywa",
  //           __v: 0,
  //         },
  //         {
  //           inRecipes: [
  //             "Zupa pomidorowa",
  //             "Makaron z boczniakiem",
  //             "Makaron z kurkami",
  //           ],
  //           _id: "65c35ef17217ec3d7453ded0",
  //           name: "Natka pietruszki",
  //           category: "Zioła",
  //           __v: 0,
  //         },
  //         {
  //           inRecipes: [
  //             "Orzo z tuńczykiem",
  //             "Zupa pomidorowa",
  //             "Makaron pomidorowy z mascarpone",
  //             "Makaron pomidorowy z burratą",
  //             "Sałatka Caprese",
  //             "Orzo z burakiem",
  //           ],
  //           _id: "65c35cd87217ec3d7453deb8",
  //           name: "Bazylia",
  //           category: "Zioła",
  //           __v: 0,
  //         },
  //         {
  //           inRecipes: [],
  //           _id: "66044e2174a317250c7302dd",
  //           name: "Wołowina dla psa",
  //           category: "Mięsko",
  //           __v: 0,
  //         },
  //         {
  //           inRecipes: [
  //             "Pasta jajeczna",
  //             "Naleśniki (baza)",
  //             "Schabowy z bakłażana",
  //             "Tarta z gruszką i gorgonzolą",
  //             "Puree ziemniaczane z jajem sadzonym & mizeria",
  //             "Jajochlebek",
  //           ],
  //           _id: "65c3621d7217ec3d7453def5",
  //           name: "Jajka",
  //           category: "Suche",
  //           __v: 0,
  //         },
  //         {
  //           inRecipes: [],
  //           _id: "65fb02fa5ab3f52cbcbd9a62",
  //           name: "Kawa",
  //           category: "Napoje",
  //           __v: 0,
  //         },
  //         {
  //           inRecipes: [
  //             "Owsianka (baza)",
  //             "Musli z mlekiem",
  //             "Musli kolacjowe",
  //             "Musli śniadaniowe",
  //             "Kaszkamaszka",
  //             "Naleśniki (baza)",
  //           ],
  //           _id: "65c361247217ec3d7453deed",
  //           name: "Mleko roślinne",
  //           category: "Suche",
  //           __v: 0,
  //         },
  //         {
  //           inRecipes: [],
  //           _id: "65c3cfa6e228c32630b9e60a",
  //           name: "Ser żółty",
  //           category: "Nabiał",
  //           __v: 0,
  //         },
  //         {
  //           inRecipes: [],
  //           _id: "65df4f77286e153b44b9967f",
  //           name: "Ręcznik papierowy",
  //           category: "Chemia",
  //           __v: 0,
  //         },
  //         {
  //           inRecipes: [
  //             "Burger fasolowy",
  //             "Bułka śniadaniowa",
  //             "Bułka kolacjowa",
  //             "VegiBurgir",
  //             "VegiBurgirDżem",
  //             "VegiBurgirDzem",
  //           ],
  //           _id: "65c360797217ec3d7453dee3",
  //           name: "Bułki",
  //           category: "Pieczywo",
  //           __v: 0,
  //         },
  //         {
  //           inRecipes: [],
  //           name: "Płyn do szyb",
  //           category: "Chemia",
  //         },
  //         {
  //           inRecipes: [],
  //           _id: "65df4fb8286e153b44b99681",
  //           name: "Sok porzeczkowy",
  //           category: "Napoje",
  //           __v: 0,
  //         },
  //       ],
  //       _id: "65c3b5c91e2b9cab37568ec8",
  //       date: "2024-08-07T17:21:53.375Z",
  //     },
  //   ];

  const { cookRaw, customSortCart } = kategorieProduktow;
  const [lista, setLista] = useState([]);
  useEffect(() => {
    fetch(`/cart`, {
      method: "GET",
      "Content-type": "application/json",
    })
      .then((response) => response.json())
      .then((thisData) => {
        setLista(
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
  console.log(lista);
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
