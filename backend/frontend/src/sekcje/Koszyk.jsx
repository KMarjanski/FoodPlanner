import React, { useContext, useEffect, useState, useRef } from 'react'
import { Badge, Button, Row, Col, Container, Form, Overlay, Popover, ButtonGroup, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpFromBracket, faSave, faXmark } from '@fortawesome/free-solid-svg-icons';
import { StoreContext } from '../store/StoreProvider'
import kategorieProduktow from './KategorieProduktow'

const Koszyk = () => {
  const { getIngredientCategoryWithIcon, handleOnClickIngredients, sortByCategory, customSortCart } = kategorieProduktow;
  const { selectedPlan, planners, ingredients, setIngredients, cart, setCart } = useContext(StoreContext);
  const [showOverlay, setShowOverlay] = useState(false);
  const overlayTarget = useRef(null);
  const cookRaw = (rawArr) => {
    return rawArr.reduce((acc, curr) => {
    if (!acc?.some(acc => acc.category === curr.category)) acc.push({ category: curr.category, ingredients: [curr.name] })
    else if (!acc?.find(acc => acc.category === curr.category)?.ingredients?.some(ci => ci === curr.name)) {
      return acc.map(acc => acc.category === curr.category ? { ...acc, ingredients: [...acc.ingredients, curr.name] } : acc)
    }
    return acc;
  }, []);
  }

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
      fetch(`/cart`, {
        method: "GET",
        "Content-type": "application/json",
      })
        .then((response) => response.json())
        .then((thisData) => {
          setCart(thisData);
        });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

  const [koszykRaw, setKoszykRaw] = useState([]);
  const [koszyk, setKoszyk] = useState(cookRaw(koszykRaw));
  const [search, setSearch] = useState('');
  const [spinner, setSpinner] = useState(false);
  const initFilteredRecipes = [];

  useEffect(() => {
    setKoszyk(cookRaw(koszykRaw));
  }, [koszykRaw, setKoszyk])

  useEffect(() => {
    !!cart.length && setKoszykRaw(cart[0].cart);
  }, [cart, setKoszykRaw])

  const filteredRecipes = Object.entries(planners?.find(p => p.label === selectedPlan.selected) || {}).filter(p => p[0] !== 'id' && p[0] !== 'label' && p[0] !== "_id").reduce((acc, curr) => {
    Object.entries(curr[1]).reduce((acc, curr) => {
      curr[1].forEach(c => {
        if (!acc.some(acc => acc === c)) acc.push(c);
      })
      return acc
    }, initFilteredRecipes)
    return acc
  }, initFilteredRecipes);
  const ingredientsListRaw = filteredRecipes.map(fr => ingredients.filter(i => i.inRecipes.some(ir => ir === fr))).reduce((acc, curr) => {
    curr.forEach(c => {
      if (!acc.some(acc => acc.name === c.name)) acc.push(c);
    })
    return acc
  }, []).sort(sortByCategory);
  const missingIngredientsRaw = ingredients.filter(i => !koszykRaw.some(ilr => ilr.name === i.name));
  const missingIngredients = cookRaw(missingIngredientsRaw)
  const missingIngredientsWSearch = missingIngredients.reduce((acc, curr) => {
    acc.push({ ...curr, ingredients: curr.ingredients.filter(i => i.toLowerCase().includes(search.toLowerCase())) })
    return acc
  }, []).sort(sortByCategory);
  const ingredientsWSearch = cookRaw(ingredients).reduce((acc, curr) => {
    acc.push({ ...curr, ingredients: curr.ingredients.filter(i => i.toLowerCase().includes(search.toLowerCase())) })
    return acc
  }, []).sort(sortByCategory);
  const isNotNewIngr = missingIngredientsWSearch.some(miws => !!miws.ingredients.length);
  const addToKoszykRaw = (name, category) => setKoszykRaw(old => [...old, { inRecipes: [], name, category }])
  useEffect(() => overlayTarget.current.focus(), [koszyk]);

  return (
    <Row style={{maxWidth: '100%'}}>
      <Col xs={6}>
        <center>
          <Row>
            <Col xs='auto' className='me-0 pe-0'>
              <Button onClick={() => setKoszykRaw([])} className='float-start ms-1 mt-1' variant='success' >
                <FontAwesomeIcon icon={faXmark} />
              </Button>
            </Col>
            <Col xs='auto' className='mx-0 px-0'>
              <Button onClick={() => {
                setSpinner(true)
                fetch(`/editCart/65c3b5c91e2b9cab37568ec8`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({...cart[0], cart: koszykRaw, date: Date.now()}),
                }).then(_ => setTimeout(() => setSpinner(false), 500))
              }} className='float-start ms-1 mt-1' variant='success' title={`Last saved: ${cart[0] && cart[0]?.date && cart[0]?.date.replace("T", " ").replace("Z", "")}`} >
                {spinner ? <Spinner animation="grow" size='sm' className='p-0' /> : <FontAwesomeIcon icon={faSave} />}
              </Button>
            </Col>
            <Col className='ms-0 ps-0' >
              <Button onClick={() => {
                fetch(`/toEvernote`, {
                  method: "POST",
                  headers: { "Content-Type": "text/plain" },
                  body: JSON.stringify(customSortCart(koszyk).map(k => `<h3>${k.category}</h3><ul style="--en-todo:true;">${k.ingredients.map((i, j) => `<li${j===0 ? '' : ' style="--en-checked:false;"'}><div>${i}</div></li>`)}</ul>`)).replaceAll('["', '').replaceAll('"]', '').replaceAll('","', '').replaceAll(',', '').replaceAll(/\\/g, ''),
                })
                navigator.clipboard.writeText(JSON
                  .stringify(customSortCart(koszyk))
                  .replaceAll('category', '')
                  .replaceAll('ingredients', '')
                  .replaceAll('[{', '')
                  .replaceAll(']},{', '')
                  .replaceAll('":"', '\n')
                  .replaceAll('","":[', '\n')
                  .replace('"', '')
                  .replaceAll('","', '\n')
                  .replaceAll(']}]', '')
                  .replaceAll('""', '\n')
                  .replaceAll('"', ''))
              }} className='float-start ms-1 mt-1' variant='success' >
                <FontAwesomeIcon icon={faArrowUpFromBracket} />
              </Button>
            </Col>
            <Col className='me-2' ><h1>Koszyk</h1></Col>
            <Col xs={1} />
            <Col xs='auto' className='me-2' >
              <Button onClick={() => setKoszykRaw(ingredientsListRaw)} variant='success' size='lg' className='mt-1 float-end' >
                Generuj koszyk
              </Button>
            </Col>
          </Row>
          <Container fluid>
            {koszyk.sort(sortByCategory).map((il, i) => <Container fluid key={i}>
                <h2>{getIngredientCategoryWithIcon(il.category)}</h2>
              {il.ingredients.map((ing, j) => <Badge className='me-1' key={j} onClick={() => setKoszykRaw(old => old.filter(o => o.name !== ing))} bg='success' style={{cursor: 'pointer'}}>{ing}</Badge>)}
              </Container>
            )}
          </Container>
        </center>
      </Col>
      <Col xs={6} style={{ borderLeft: '1px solid #198754' }} >
        <center><h1>Lista składników</h1>
          <Form.Control autoFocus placeholder='Szukaj...' ref={overlayTarget} value={search} onChange={e => setSearch(e.target.value)} />
          <Container className='mb-4' fluid>
            {(isNotNewIngr ? ingredientsWSearch : [{ name: '', ingredients: [`${search}`]}]).map((il, i) =><Container fluid key={i}>
                {!!il.ingredients.length && <h2>{getIngredientCategoryWithIcon(il.category)}</h2>}
              {il.ingredients.map((ing, j) => {
                const isInCart = koszyk.some(k => k.ingredients.some(i => i === ing));
                return <Badge
                  onClick={() => isInCart ? {} : isNotNewIngr ? setKoszykRaw(old => { setSearch(''); return [...old, missingIngredientsRaw.find(mir => mir.name === ing)]}) : setShowOverlay(true) }
                  bg={isNotNewIngr ? isInCart ? 'secondary' : 'success' : 'primary'} style={isInCart ? {} : { cursor: 'pointer' }} className='me-1' key={j}>{ing}</Badge>
              })}
                <Overlay target={overlayTarget.current} show={showOverlay} placement="bottom">
	              	<Popover style={{backgroundColor: 'rgb(69, 173, 107)'}}>
	              		<Popover.Body>
                      <ButtonGroup vertical>
                      <Button variant='success' size='sm' onClick={() => { handleOnClickIngredients(il.name, true, setSearch, search, setShowOverlay, setIngredients, 'Chemia'); addToKoszykRaw(search, 'Chemia'); }}>{getIngredientCategoryWithIcon('Chemia')}</Button>
                      <Button variant='success' size='sm' onClick={() => { handleOnClickIngredients(il.name, true, setSearch, search, setShowOverlay, setIngredients, 'Dania gotowe'); addToKoszykRaw(search, 'Dania gotowe'); }}>{getIngredientCategoryWithIcon('Dania gotowe')}</Button>
                      <Button variant='success' size='sm' onClick={() => { handleOnClickIngredients(il.name, true, setSearch, search, setShowOverlay, setIngredients, 'Nabiał'); addToKoszykRaw(search, 'Nabiał'); }}>{getIngredientCategoryWithIcon('Nabiał')}</Button>
                      <Button variant='success' size='sm' onClick={() => { handleOnClickIngredients(il.name, true, setSearch, search, setShowOverlay, setIngredients, 'Napoje'); addToKoszykRaw(search, 'Napoje'); }}>{getIngredientCategoryWithIcon('Napoje')}</Button>
                      <Button variant='success' size='sm' onClick={() => { handleOnClickIngredients(il.name, true, setSearch, search, setShowOverlay, setIngredients, 'Mięsko'); addToKoszykRaw(search, 'Mięsko'); }}>{getIngredientCategoryWithIcon('Mięsko')}</Button>
                      <Button variant='success' size='sm' onClick={() => { handleOnClickIngredients(il.name, true, setSearch, search, setShowOverlay, setIngredients, 'Mrożonki'); addToKoszykRaw(search, 'Mrożonki'); }}>{getIngredientCategoryWithIcon('Mrożonki')}</Button>
                      <Button variant='success' size='sm' onClick={() => { handleOnClickIngredients(il.name, true, setSearch, search, setShowOverlay, setIngredients, 'Owoce'); addToKoszykRaw(search, 'Owoce'); }}>{getIngredientCategoryWithIcon('Owoce')}</Button>
                      <Button variant='success' size='sm' onClick={() => { handleOnClickIngredients(il.name, true, setSearch, search, setShowOverlay, setIngredients, 'Pasty'); addToKoszykRaw(search, 'Pasty'); }}>{getIngredientCategoryWithIcon('Pasty')}</Button>
                      <Button variant='success' size='sm' onClick={() => { handleOnClickIngredients(il.name, true, setSearch, search, setShowOverlay, setIngredients, 'Pieczywo'); addToKoszykRaw(search, 'Pieczywo'); }}>{getIngredientCategoryWithIcon('Pieczywo')}</Button>
                      <Button variant='success' size='sm' onClick={() => { handleOnClickIngredients(il.name, true, setSearch, search, setShowOverlay, setIngredients, 'Przyprawy'); addToKoszykRaw(search, 'Przyprawy'); }}>{getIngredientCategoryWithIcon('Przyprawy')}</Button>
                      <Button variant='success' size='sm' onClick={() => { handleOnClickIngredients(il.name, true, setSearch, search, setShowOverlay, setIngredients, 'Puszki'); addToKoszykRaw(search, 'Puszki'); }}>{getIngredientCategoryWithIcon('Puszki')}</Button>
                      <Button variant='success' size='sm' onClick={() => { handleOnClickIngredients(il.name, true, setSearch, search, setShowOverlay, setIngredients, 'Słodycze'); addToKoszykRaw(search, 'Słodycze'); }}>{getIngredientCategoryWithIcon('Słodycze')}</Button>
                      <Button variant='success' size='sm' onClick={() => { handleOnClickIngredients(il.name, true, setSearch, search, setShowOverlay, setIngredients, 'Słoiki'); addToKoszykRaw(search, 'Słoiki'); }}>{getIngredientCategoryWithIcon('Słoiki')}</Button>
                      <Button variant='success' size='sm' onClick={() => { handleOnClickIngredients(il.name, true, setSearch, search, setShowOverlay, setIngredients, 'Snacki'); addToKoszykRaw(search, 'Snacki'); }}>{getIngredientCategoryWithIcon('Snacki')}</Button>
                      <Button variant='success' size='sm' onClick={() => { handleOnClickIngredients(il.name, true, setSearch, search, setShowOverlay, setIngredients, 'Sosy'); addToKoszykRaw(search, 'Sosy'); }}>{getIngredientCategoryWithIcon('Sosy')}</Button>
                      <Button variant='success' size='sm' onClick={() => { handleOnClickIngredients(il.name, true, setSearch, search, setShowOverlay, setIngredients, 'Suche'); addToKoszykRaw(search, 'Suche'); }}>{getIngredientCategoryWithIcon('Suche')}</Button>
                      <Button variant='success' size='sm' onClick={() => { handleOnClickIngredients(il.name, true, setSearch, search, setShowOverlay, setIngredients, 'Warzywa'); addToKoszykRaw(search, 'Warzywa'); }}>{getIngredientCategoryWithIcon('Warzywa')}</Button>
                      <Button variant='success' size='sm' onClick={() => { handleOnClickIngredients(il.name, true, setSearch, search, setShowOverlay, setIngredients, 'Zioła'); addToKoszykRaw(search, 'Zioła'); }}>{getIngredientCategoryWithIcon('Zioła')}</Button>
                      </ButtonGroup>
	              		</Popover.Body>
	              	</Popover>
	              </Overlay>
              </Container>
            )}
          </Container>
        </center>
      </Col>
    </Row>
  )
}

export default Koszyk

