import React, { useContext, useEffect, useRef, useState } from "react";
import { StoreContext } from "../store/StoreProvider";
import {
  Container,
  Form,
  Button,
  Tabs,
  Tab,
  Badge,
  Row,
  Col,
  Overlay,
  Popover,
  ButtonGroup,
} from "react-bootstrap";
import kategorieProduktow from "./KategorieProduktow";

const DodajPrzepis = () => {
  const {
    getIngredientCategoryWithIcon,
    handleOnClickIngredients,
    sortByName,
  } = kategorieProduktow;
  const {
    recipes,
    categories,
    ingredients,
    setIngredients,
    setCategories,
    tab,
    setTab,
  } = useContext(StoreContext);
  const cache = recipes.find((r) => r.name === tab.split("_")[1]);
  const [form, setForm] = useState(
    cache
      ? cache
      : { name: "", type: "Śniadanie", categories: [], ingredients: [] }
  );
  const [cSearch, setCSearch] = useState("");
  const [iSearch, setISearch] = useState("");
  const categoriesOverlayTarget = useRef(null);
  const nameOverlayTarget = useRef(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const overlayTarget = useRef(null);
  const handleOnClickCategory = (x, neew = false) => {
    setForm((old) => {
      if (old.categories.some((c) => c === x))
        return { ...old, categories: old.categories.filter((c) => c !== x) };
      else return { ...old, categories: [...old.categories, x] };
    });
    setCSearch("");
    if (neew) {
      fetch("/addCategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cSearch }),
      }).then((res) => {
        if (res.status === 200) {
          setTimeout(() => {
            fetch(`/categories`, {
              method: "GET",
              "Content-type": "application/json",
            })
              .then((response) => response.json())
              .then((thisData) => {
                setCategories(thisData);
              });
            // eslint-disable-next-line react-hooks/exhaustive-deps
          }, 100);
        } else if (res.status === 404) {
          setTimeout(() => {}, 1000);
        }
      });
    }
  };
  const filteredCategories = [
    ...categories
      .filter((c) => form.categories.some((fc) => fc === c.name))
      .sort(sortByName),
    ...categories
      .filter((c) => !form.categories.some((fc) => fc === c.name))
      .sort(sortByName),
  ].filter((c) => c.name.toLowerCase().includes(cSearch.toLowerCase()));
  const filteredIngredients = [
    ...ingredients
      .filter((i) => i.category !== "Chemia")
      .filter((i) => form.ingredients.some((fi) => fi === i.name))
      .sort(sortByName),
    ...ingredients
      .filter((i) => i.category !== "Chemia")
      .filter((i) => !form.ingredients.some((fi) => fi === i.name))
      .sort(sortByName),
  ].filter((i) => i.name.toLowerCase().includes(iSearch.toLowerCase()));

  useEffect(() => {
    fetch(`/ingredients`, {
      method: "GET",
      "Content-type": "application/json",
    })
      .then((response) => response.json())
      .then((thisData) => {
        setIngredients(thisData);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetch(`/categories`, {
      method: "GET",
      "Content-type": "application/json",
    })
      .then((response) => response.json())
      .then((thisData) => {
        setCategories(thisData);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSumbit = (edit = cache) => {
    const addedIngredients = ingredients
      .filter((i) => form.ingredients.some((fi) => fi === i.name))
      .filter((i) => !i.inRecipes.some((ir) => ir === form.name));
    const removedIngredients = ingredients
      .filter((i) => !form.ingredients.some((fi) => fi === i.name))
      .filter((i) => i.inRecipes.some((ir) => ir === form.name));
    const addedCategories = categories
      .filter((c) => form.categories.some((fc) => fc === c.name))
      .filter((i) => !i.connectedTo.some((ct) => ct === form.name));
    const removedCategories = categories
      .filter((c) => !form.categories.some((fc) => fc === c.name))
      .filter((i) => i.connectedTo.some((ct) => ct === form.name));
    if (!!addedIngredients.length) {
      addedIngredients
        .map((ai) => ({ ...ai, inRecipes: [...ai.inRecipes, form.name] }))
        .forEach((ai) => {
          fetch(`/editIngredient/${ai._id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ai),
          });
        });
    }
    if (!!removedIngredients.length) {
      removedIngredients
        .map((ri) => ({
          ...ri,
          inRecipes: ri.inRecipes.filter((ir) => ir !== form.name),
        }))
        .forEach((ri) => {
          fetch(`/editIngredient/${ri._id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ri),
          });
        });
    }
    if (!!addedCategories.length) {
      addedCategories
        .map((ac) => ({ ...ac, connectedTo: [...ac.connectedTo, form.name] }))
        .forEach((ac) => {
          fetch(`/editCategories/${ac._id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ac),
          });
        });
    }
    if (!!removedCategories.length) {
      removedCategories
        .map((rc) => ({
          ...rc,
          connectedTo: rc.connectedTo.filter((ct) => ct !== form.name),
        }))
        .forEach((rc) => {
          fetch(`/editCategories/${rc._id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(rc),
          });
        });
    }
    if (edit)
      fetch(`/editRecipes/${form._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    else
      fetch("/addRecipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categories: form.categories,
          ingredients: form.ingredients,
          name: form.name,
          type: form.type,
        }),
      });
    fetch(`/categories`, {
      method: "GET",
      "Content-type": "application/json",
    })
      .then((response) => response.json())
      .then((thisData) => {
        setCategories(thisData);
      });
    setTab("Przepisy");
  };
  useEffect(() => {
    if (
      nameOverlayTarget.current !== document.activeElement &&
      categoriesOverlayTarget.current !== document.activeElement
    ) {
      overlayTarget.current.focus();
    }
  }, [form, ingredients, nameOverlayTarget, categoriesOverlayTarget]);

  return (
    <Container fluid>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Nazwa przepisu</Form.Label>
          <Form.Control
            id="name"
            ref={nameOverlayTarget}
            type="text"
            value={form.name}
            onChange={(x) => {
              return setForm((old) => ({ ...old, name: x.target.value }));
            }}
          />
        </Form.Group>
        <hr className="mb-2 mt-0" />
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Typ</Form.Label>
        </Form.Group>
        <Tabs
          defaultActiveKey={form.type}
          className="mb-3"
          onSelect={(x) => setForm((old) => ({ ...old, type: x }))}
          fill
        >
          <Tab eventKey="Śniadanie" title="Śniadanie" />
          <Tab eventKey="Obiad" title="Obiad" />
          <Tab eventKey="Kolacja" title="Kolacja" />
        </Tabs>
        <hr className="mb-2 mt-0" />
        <Form.Group className="mb-3">
          <Row>
            <Col>
              <Form.Label>Kategoria</Form.Label>
            </Col>
            <Col xs="auto">
              <Form.Control
                id="category"
                ref={categoriesOverlayTarget}
                type="text"
                placeholder="Szukaj..."
                value={cSearch}
                onChange={(x) => setCSearch(x.target.value)}
              />
            </Col>
          </Row>
          <center>
            {(!!filteredCategories.length
              ? filteredCategories
              : [{ name: cSearch }]
            ).map((c, i) => (
              <div style={{ display: "inline-block" }} key={i}>
                <Badge
                  bg={
                    form.categories.some((fc) => fc === c.name)
                      ? "primary"
                      : !!filteredCategories.length
                      ? "danger"
                      : "secondary"
                  }
                  onClick={(_) =>
                    !!filteredCategories.length
                      ? handleOnClickCategory(c.name, false)
                      : handleOnClickCategory(c.name, true)
                  }
                  className="ms-1"
                >
                  {c.name}
                </Badge>
              </div>
            ))}
          </center>
        </Form.Group>
        <hr className="mb-2 mt-0" />
        <Form.Group className="mb-3">
          <Row>
            <Col>
              <Form.Label>Składniki</Form.Label>
            </Col>
            <Col xs="auto">
              <Form.Control
                autoFocus
                ref={overlayTarget}
                type="text"
                placeholder="Szukaj..."
                value={iSearch}
                onChange={(x) => setISearch(x.target.value)}
              />
            </Col>
          </Row>
          <center>
            {(!!filteredIngredients.length
              ? filteredIngredients
              : [{ name: iSearch }]
            ).map((x, i) => (
              <div style={{ display: "inline-block" }} key={i}>
                <Badge
                  bg={
                    form.ingredients.some((fi) => fi === x.name)
                      ? "primary"
                      : !!filteredIngredients.length
                      ? "danger"
                      : "secondary"
                  }
                  onClick={(_) => {
                    if (!!filteredIngredients.length)
                      handleOnClickIngredients(
                        x.name,
                        false,
                        setISearch,
                        null,
                        null,
                        null,
                        null,
                        setForm
                      );
                    else setShowOverlay(true);
                  }}
                  className="ms-1"
                  title={x.category}
                >
                  {x.name}
                </Badge>
                <Overlay
                  target={overlayTarget.current}
                  show={showOverlay}
                  placement="left"
                >
                  <Popover style={{ backgroundColor: "rgb(69, 173, 107)" }}>
                    <Popover.Body>
                      <ButtonGroup vertical>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() =>
                            handleOnClickIngredients(
                              x.name,
                              true,
                              setISearch,
                              iSearch,
                              setShowOverlay,
                              setIngredients,
                              "Dania gotowe",
                              setForm
                            )
                          }
                        >
                          {getIngredientCategoryWithIcon("Dania gotowe")}
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() =>
                            handleOnClickIngredients(
                              x.name,
                              true,
                              setISearch,
                              iSearch,
                              setShowOverlay,
                              setIngredients,
                              "Nabiał",
                              setForm
                            )
                          }
                        >
                          {getIngredientCategoryWithIcon("Nabiał")}
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() =>
                            handleOnClickIngredients(
                              x.name,
                              true,
                              setISearch,
                              iSearch,
                              setShowOverlay,
                              setIngredients,
                              "Napoje",
                              setForm
                            )
                          }
                        >
                          {getIngredientCategoryWithIcon("Napoje")}
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() =>
                            handleOnClickIngredients(
                              x.name,
                              true,
                              setISearch,
                              iSearch,
                              setShowOverlay,
                              setIngredients,
                              "Mięsko",
                              setForm
                            )
                          }
                        >
                          {getIngredientCategoryWithIcon("Mięsko")}
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() =>
                            handleOnClickIngredients(
                              x.name,
                              true,
                              setISearch,
                              iSearch,
                              setShowOverlay,
                              setIngredients,
                              "Mrożonki",
                              setForm
                            )
                          }
                        >
                          {getIngredientCategoryWithIcon("Mrożonki")}
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() =>
                            handleOnClickIngredients(
                              x.name,
                              true,
                              setISearch,
                              iSearch,
                              setShowOverlay,
                              setIngredients,
                              "Owoce",
                              setForm
                            )
                          }
                        >
                          {getIngredientCategoryWithIcon("Owoce")}
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() =>
                            handleOnClickIngredients(
                              x.name,
                              true,
                              setISearch,
                              iSearch,
                              setShowOverlay,
                              setIngredients,
                              "Pasty",
                              setForm
                            )
                          }
                        >
                          {getIngredientCategoryWithIcon("Pasty")}
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() =>
                            handleOnClickIngredients(
                              x.name,
                              true,
                              setISearch,
                              iSearch,
                              setShowOverlay,
                              setIngredients,
                              "Pieczywo",
                              setForm
                            )
                          }
                        >
                          {getIngredientCategoryWithIcon("Pieczywo")}
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() =>
                            handleOnClickIngredients(
                              x.name,
                              true,
                              setISearch,
                              iSearch,
                              setShowOverlay,
                              setIngredients,
                              "Przyprawy",
                              setForm
                            )
                          }
                        >
                          {getIngredientCategoryWithIcon("Przyprawy")}
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() =>
                            handleOnClickIngredients(
                              x.name,
                              true,
                              setISearch,
                              iSearch,
                              setShowOverlay,
                              setIngredients,
                              "Puszki",
                              setForm
                            )
                          }
                        >
                          {getIngredientCategoryWithIcon("Puszki")}
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() =>
                            handleOnClickIngredients(
                              x.name,
                              true,
                              setISearch,
                              iSearch,
                              setShowOverlay,
                              setIngredients,
                              "Słodycze",
                              setForm
                            )
                          }
                        >
                          {getIngredientCategoryWithIcon("Słodycze")}
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() =>
                            handleOnClickIngredients(
                              x.name,
                              true,
                              setISearch,
                              iSearch,
                              setShowOverlay,
                              setIngredients,
                              "Słoiki",
                              setForm
                            )
                          }
                        >
                          {getIngredientCategoryWithIcon("Słoiki")}
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() =>
                            handleOnClickIngredients(
                              x.name,
                              true,
                              setISearch,
                              iSearch,
                              setShowOverlay,
                              setIngredients,
                              "Snacki",
                              setForm
                            )
                          }
                        >
                          {getIngredientCategoryWithIcon("Snacki")}
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() =>
                            handleOnClickIngredients(
                              x.name,
                              true,
                              setISearch,
                              iSearch,
                              setShowOverlay,
                              setIngredients,
                              "Sosy",
                              setForm
                            )
                          }
                        >
                          {getIngredientCategoryWithIcon("Sosy")}
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() =>
                            handleOnClickIngredients(
                              x.name,
                              true,
                              setISearch,
                              iSearch,
                              setShowOverlay,
                              setIngredients,
                              "Suche",
                              setForm
                            )
                          }
                        >
                          {getIngredientCategoryWithIcon("Suche")}
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() =>
                            handleOnClickIngredients(
                              x.name,
                              true,
                              setISearch,
                              iSearch,
                              setShowOverlay,
                              setIngredients,
                              "Warzywa",
                              setForm
                            )
                          }
                        >
                          {getIngredientCategoryWithIcon("Warzywa")}
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() =>
                            handleOnClickIngredients(
                              x.name,
                              true,
                              setISearch,
                              iSearch,
                              setShowOverlay,
                              setIngredients,
                              "Zioła",
                              setForm
                            )
                          }
                        >
                          {getIngredientCategoryWithIcon("Zioła")}
                        </Button>
                      </ButtonGroup>
                    </Popover.Body>
                  </Popover>
                </Overlay>
              </div>
            ))}
          </center>
        </Form.Group>
        <Button onClick={() => handleSumbit()} variant="success">
          {cache ? "Edytuj" : "Dodaj"}
        </Button>
        {cache && (
          <Button
            disabled={JSON.stringify(cache) === JSON.stringify(form)}
            className="ms-2"
            onClick={() => handleSumbit(false)}
            variant="success"
          >
            Dodaj jako nowy
          </Button>
        )}
      </Form>
    </Container>
  );
};

export default DodajPrzepis;
