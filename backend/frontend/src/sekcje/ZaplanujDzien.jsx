import React, { useContext, useEffect, useState } from 'react'
import { Modal, Button, Row, Col, Badge, Form } from 'react-bootstrap'
import { StoreContext } from '../store/StoreProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const ZaplanujDzien = ({ show, setShow }) => {
  const handleClose = () => setShow('');
  const [searchSni, setSearchSni] = useState('');
  const [searchO, setSearchO] = useState('');
  const [searchK, setSearchK] = useState('');
  const { recipes, setRecipes, selected, setSelected } = useContext(StoreContext);
  const [recipesNow, setRecipesNow] = useState([]);
  const [selectedNew, setSelectedNew] = useState(selected);
  const getSelected = selectedNew[show.short];
  const handleSave = () => {
    setSelected(selectedNew);
    setShow('');
  };

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
  
  useEffect(() => {
    setRecipesNow(recipes.map(r => ({ ...r, selected: false })));
  }, [recipes, setRecipes])

  useEffect(() => {
    setSelectedNew(selected)
  }, [selected, show])

  return <Modal dialogClassName='my-modal' show={!!show} onHide={handleClose}>
    <Modal.Header style={{backgroundColor: 'rgb(69, 173, 107)'}} closeButton>
      <Modal.Title>{show.name}</Modal.Title>
    </Modal.Header>
    <Modal.Body style={{ backgroundColor: 'rgb(69, 173, 107)' }}>
      <Row>
        <Col>
          Śniadanie
          <div>{getSelected && getSelected.sni.map((s, i) => <Badge
            key={i}
            bg='success'
            className='me-1'
            style={{ cursor: 'pointer' }}
            onClick={_ => setSelectedNew(old => Object.fromEntries(Object.entries(old).map(o => o[0] === show.short ? [o[0], { ...o[1], sni: o[1].sni.filter(x => x !== s) }] : o)))}
          >
            {s}
          </Badge>)}</div>
        </Col>
        <Col xs={6}>
          <Form.Control placeholder='Szukaj...' className='mb-2' size="sm" type="text" value={searchSni} onChange={e => setSearchSni(e.target.value)}/>
          {recipesNow
            .filter(r => r.type === 'Śniadanie')
            .filter(r => r.name.toLowerCase().includes(searchSni.toLowerCase()))
            .filter(r => !getSelected?.sni?.includes(r.name))
            .map((r, i) => <Badge
              style={{ cursor: 'pointer' }}
              className='me-1'
              key={i}
              bg={r.selected ? 'primary' : 'success'}
              onClick={_ => setRecipesNow(old => old.map(o => o.name === r.name ? {...o, selected: !o.selected} : o))}
            >
              {r.name}
            </Badge>)
          }
        </Col>
      </Row>
      <hr/>
      <Row>
        <Col>
          Obiad
          <div>{getSelected && getSelected.o.map((s, i) => <Badge
            key={i}
            bg='success'
            className='me-1'
            style={{ cursor: 'pointer' }}
            onClick={_ => setSelectedNew(old => Object.fromEntries(Object.entries(old).map(o => o[0] === show.short ? [o[0], { ...o[1], o: o[1].o.filter(x => x !== s) }] : o)))}
          >
            {s}
          </Badge>)}</div>
        </Col>
        <Col xs='auto' className='mx-0 px-0'>
          <div><Button size='sm' variant='success' style={{ minWidth: '100%' }} onClick={() => { setSelectedNew(old => Object.fromEntries(Object.entries(old).map(o => o[0] === show.short ? [o[0], { ...o[1], sni: [...o[1].sni, ...recipesNow.filter(rn => rn.selected).map(rn => rn.name)] }] : o))); setRecipesNow(old => old.map(o => ({...o, selected: false})))}} ><FontAwesomeIcon icon={faStar} /></Button></div>
          <div><Button size='sm' variant='success' style={{ minWidth: '100%' }} onClick={() => { setSelectedNew(old => Object.fromEntries(Object.entries(old).map(o => o[0] === show.short ? [o[0], { ...o[1], o: [...o[1].o, ...recipesNow.filter(rn => rn.selected).map(rn => rn.name)] }] : o))); setRecipesNow(old => old.map(o => ({...o, selected: false})))}} className='my-1' ><FontAwesomeIcon icon={faSun} /></Button></div>
          <div><Button size='sm' variant='success' style={{ minWidth: '100%' }} onClick={() => { setSelectedNew(old => Object.fromEntries(Object.entries(old).map(o => o[0] === show.short ? [o[0], { ...o[1], k: [...o[1].k, ...recipesNow.filter(rn => rn.selected).map(rn => rn.name)] }] : o))); setRecipesNow(old => old.map(o => ({...o, selected: false})))}} ><FontAwesomeIcon icon={faMoon} /></Button></div>
        </Col>
        <Col xs={6}>
          <Form.Control placeholder='Szukaj...' className='mb-2' size="sm" type="text" value={searchO} onChange={e => setSearchO(e.target.value)}/>
          {recipesNow
            .filter(r => r.type === 'Obiad')
            .filter(r => r.name.toLowerCase().includes(searchO.toLowerCase()))
            .filter(r => !getSelected?.o?.includes(r.name))
            .map((r, i) => <Badge
              style={{ cursor: 'pointer' }}
              className='me-1'
              key={i}
              bg={r.selected ? 'primary' : 'success'}
              onClick={_ => setRecipesNow(old => old.map(o => o.name === r.name ? {...o, selected: !o.selected} : o))}
            >
              {r.name}
            </Badge>)
          }
        </Col>
      </Row>
      <hr/>
      <Row>
        <Col>
          Kolacja
          <div>{getSelected && getSelected.k.map((s, i) => <Badge
            key={i}
            bg='success'
            className='me-1'
            style={{ cursor: 'pointer' }}
            onClick={_ => setSelectedNew(old => Object.fromEntries(Object.entries(old).map(o => o[0] === show.short ? [o[0], { ...o[1], k: o[1].k.filter(x => x !== s) }] : o)))}
          >
            {s}
          </Badge>)}</div>
        </Col>
        <Col xs={6}>
          <Form.Control placeholder='Szukaj...' className='mb-2' size="sm" type="text" value={searchK} onChange={e => setSearchK(e.target.value)}/>
          {recipesNow
            .filter(r => r.type === 'Kolacja')
            .filter(r => r.name.toLowerCase().includes(searchK.toLowerCase()))
            .filter(r => !getSelected?.k?.includes(r.name))
            .map((r, i) => <Badge
              style={{ cursor: 'pointer' }}
              className='me-1'
              key={i}
              bg={r.selected ? 'primary' : 'success'}
              onClick={_ => setRecipesNow(old => old.map(o => o.name === r.name ? {...o, selected: !o.selected} : o))}
            >
              {r.name}
            </Badge>)
          }
        </Col>
      </Row>
    </Modal.Body>
    <Modal.Footer style={{backgroundColor: 'rgb(69, 173, 107)'}}>
      <Button variant="success" onClick={handleSave}>
        Zapisz dzień
      </Button>
    </Modal.Footer>
  </Modal>
}

export default ZaplanujDzien