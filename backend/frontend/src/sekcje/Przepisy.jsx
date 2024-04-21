import React, {useContext, useState, useEffect} from 'react'
import { Col, Row, Button, Form, Container } from 'react-bootstrap'
import { StoreContext } from '../store/StoreProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const Przepisy = () => {
    const { recipes, setRecipes, setTab } = useContext(StoreContext);
    const [s, setS] = useState('');
    const filteredSniadanie = recipes.filter(przepis => przepis.type === 'Śniadanie').filter(przepis => przepis.name.toLowerCase().includes(s.toLowerCase()) || przepis.categories.some(category => category.toLowerCase().includes(s.toLowerCase())))
    const filteredObiad = recipes.filter(przepis => przepis.type === 'Obiad').filter(przepis => przepis.name.toLowerCase().includes(s.toLowerCase()) || przepis.categories.some(category => category.toLowerCase().includes(s.toLowerCase())))
    const filteredKolacja = recipes.filter(przepis => przepis.type === 'Kolacja').filter(przepis => przepis.name.toLowerCase().includes(s.toLowerCase()) || przepis.categories.some(category => category.toLowerCase().includes(s.toLowerCase())))
    const filteredRecipes = recipes.filter(przepis => przepis.name.toLowerCase().includes(s.toLowerCase()) || przepis.categories.some(category => category.toLowerCase().includes(s.toLowerCase())))
    const recipesCol = (i, przepis) => (<Col key={i} xs={'auto'} className='me-0 pe-0'>
        <Button className='mb-2' variant='light' onClick={() => setTab(`PrzepisEdytowany_${przepis.name}`)}>{przepis.name}</Button>
    </Col>)

    useEffect(() => {
      fetch(`/recipes`, {
        method: "GET",
        "Content-type": "application/json",
      })
        .then((response) => response.json())
        .then((thisData) => {
          setRecipes(thisData);
        });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Container fluid>
        <Row>
            <Col><h2 className='mt-1' style={{visibility: filteredSniadanie.length ? 'visible' : 'hidden'}}>Śniadania</h2></Col>
            <Col xs='auto' className='mt-2'><Form.Control type="text" placeholder='Szukaj...' value={s} onChange={e => setS(e.target.value)} /></Col>
            <Col xs='auto' className='mt-2'><Button className='float-end' variant="success" onClick={() => setTab('DodajPrzepis')} ><FontAwesomeIcon icon={faPlus} /></Button></Col>
        </Row>
        <Row>
            {filteredSniadanie.map((przepis, i) => recipesCol(i, przepis))}
        </Row>
        {filteredRecipes.length > 1 && <hr className='mt-2 mb-0' />}
        {!!filteredObiad.length && <Row>
            <Col><h2>Obiady</h2></Col>
        </Row>}
        <Row>
            {filteredObiad.map((przepis, i) => recipesCol(i, przepis))}
        </Row>
        {filteredRecipes.length > 1 && <hr className='mt-2 mb-0' />}
        {!!filteredKolacja.length && <Row>
            <Col><h2>Kolacje</h2></Col>
        </Row>}
        <Row>
            {filteredKolacja.map((przepis, i) => recipesCol(i, przepis))}
        </Row>
    </Container>
}

export default Przepisy