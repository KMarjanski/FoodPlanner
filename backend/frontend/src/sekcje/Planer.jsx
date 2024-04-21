import React, { useContext, useEffect, useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead';
import { StoreContext } from '../store/StoreProvider';
import { Row, Col, Button, Container, Badge, Spinner } from 'react-bootstrap';
import ZaplanujDzien from './ZaplanujDzien';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRepeat, faXmark, faPlus, faXmarksLines } from '@fortawesome/free-solid-svg-icons';

const Planer = () => {
  const { planners, selectedPlan, setSelectedPlan, setTab, setPlanners, selected, setSelected, emptyDay, defaultSelected } = useContext(StoreContext);
  const [show, setShow] = useState('');
  const [newPlanners, setNewPlanners] = useState(null);
  const [spinner, setSpinner] = useState(false);
  const [newPlan, setNewPlan] = useState(false);

  useEffect(() => {
    fetch(`/planners`, {
      method: "GET",
      "Content-type": "application/json",
    })
      .then((response) => response.json())
      .then((thisData) => {
        setPlanners(thisData);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedPlan.selected && !!planners.find(p => p?.label === selectedPlan.selected)) {
      !selected._id && !newPlan && setSelected(planners.find(p => p?.label === selectedPlan.selected))
    }
  }, [selectedPlan, planners, selected, newPlan, setSelected])

  const getSelectedPlan = () => {
    fetch(`/selected`, {
        method: "GET",
        "Content-type": "application/json",
      })
        .then((response) => response.json())
        .then((thisData) => {
          setSelectedPlan(thisData[0]);
        });
  }

  const updateSelectedPlan = (label) => {
    fetch(`/editSelected/${selectedPlan._id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({...selectedPlan, selected: label}),
    })
  }

  const posilki = (dzien) => {
    return <>
      <Row>
        <Col xs='auto'><h4>Śniadanie</h4></Col>
        <Col>
          {selected[dzien].sni.map((s, i) => <Badge className='me-1' onClick={() => setTab(`PrzepisEdytowany_${s}`)} style={{ cursor: 'pointer' }} bg='success' key={i}>{s}</Badge>)}
        </Col>
      </Row>
      <Row>
        <Col xs='auto'><h4>Obiad</h4></Col>
        <Col>
          {selected[dzien].o.map((s, i) => <Badge className='me-1' onClick={() => setTab(`PrzepisEdytowany_${s}`)} style={{ cursor: 'pointer' }} bg='success' key={i}>{s}</Badge>)}
        </Col>
      </Row>
      <Row>
        <Col xs='auto'><h4>Kolacja</h4></Col>
        <Col>
          {selected[dzien].k.map((s, i) => <Badge className='me-1' onClick={() => setTab(`PrzepisEdytowany_${s}`)} style={{ cursor: 'pointer' }} bg='success' key={i}>{s}</Badge>)}
        </Col>
      </Row>
    </>
  }

  return (<>
    {selected.label === '' && <Row className='m-0'>
      <Col className='p-0' >
        <Typeahead
          allowNew
          newSelectionPrefix="Dodaj nowy plan: "
          className='mb-1'
          onChange={(selected) => {
            if (!selected[0].customOption) {
              setSelected(selected[0]);
              updateSelectedPlan(selected[0].label);
              getSelectedPlan();
            } else {
              setNewPlanners(selected[0].label);
            }
            setNewPlan(false);
          } }
          options={planners}
        />
      </Col>
      <Col xs='auto' className='p-0' >
        <Button variant='success' onClick={() => {
          fetch("/addPlanners", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({...selected, label: newPlanners}),
          })
          updateSelectedPlan(newPlanners);
          getSelectedPlan();
          fetch(`/planners`, {
      method: "GET",
      "Content-type": "application/json",
    })
      .then((response) => response.json())
      .then((thisData) => {
        setPlanners(thisData);
        setSelected(thisData.find(p => p?.label === newPlanners))
      });
        }} >
          <FontAwesomeIcon icon={faPlus} />
        </Button>
      </Col>
    </Row>}
    {selected.label !== '' && <h3 className='ms-2'>{selected.label}
      <Button disabled={spinner} className='float-end me-3 mt-1' size='sm' variant='success' onClick={() => { setNewPlan(true); setSelected(defaultSelected); }} >
        {spinner ? <Spinner animation="grow" size='sm' className='p-0' /> : <FontAwesomeIcon icon={faXmark} />}
      </Button>
      {!JSON.stringify(selected).includes(JSON.stringify(emptyDay).slice(1,-1)) && !spinner && <Button disabled={spinner} className='float-end me-3 mt-1' size='sm' variant='success' onClick={() => { setNewPlan(true); setSelected(old => ({ ...old, ...emptyDay, })); }} >
        <FontAwesomeIcon icon={faXmarksLines} />
      </Button>}
      {!spinner && JSON.stringify(planners.find(p => p.label === selected.label)) !== JSON.stringify(selected) &&
        <Button className='float-end me-2 mt-1' variant='success' size='sm' onClick={() => setSelected(planners.find(p => p.label === selected.label))} >
        <FontAwesomeIcon icon={faRepeat} />
      </Button>}
      {!spinner && JSON.stringify(planners.find(p => p.label === selected.label)) !== JSON.stringify(selected) &&
        <Button className='float-end me-2 mt-1' variant='success' size='sm' onClick={() => {
          setSpinner(true);
          fetch(`/editPlanners/${selected._id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selected),
          }).then(() => {
            setTimeout(() => fetch(`/planners`, {
              method: "GET",
              "Content-type": "application/json",
            })
              .then((response) => response.json())
              .then((thisData) => {
                setPlanners(thisData);
                setSpinner(false);
                setSelected(thisData.find(p => p?.label === selectedPlan.selected))
              }), 2500)
          })
        }} >
        Edytuj
      </Button>}
    </h3>}
      <Container fluid>
        <Row>
          <Col>
              <Row>
                <Col><center><h2 className='ms-5'>Poniedziałek</h2></center></Col>
                <Col xs='auto' ><Button variant='success' size='sm' className='float-end mt-1' onClick={() => setShow({name: 'Poniedziałek', short: 'pn'})}><FontAwesomeIcon icon={faPlus} /></Button></Col>
              </Row>
              {posilki('pn')}
          </Col>
          <Col style={{borderLeft: '1px solid rgba(56, 127, 83, 0.7)'}}>
              <Row>
                <Col><center><h2 className='ms-5'>Wtorek</h2></center></Col>
                <Col xs='auto' ><Button variant='success' size='sm' className='float-end mt-1' onClick={() => setShow({name: 'Wtorek', short: 'wt'})}><FontAwesomeIcon icon={faPlus} /></Button></Col>
              </Row>
              {posilki('wt')}
          </Col>
        </Row>
        <hr className='mt-0 mb-0'/>
        <Row>
          <Col>
              <Row>
                <Col><center><h2 className='ms-5'>Środa</h2></center></Col>
                <Col xs='auto' ><Button variant='success' size='sm' className='float-end mt-1' onClick={() => setShow({name: 'Środa', short: 'sr'})}><FontAwesomeIcon icon={faPlus} /></Button></Col>
              </Row>
              {posilki('sr')}
          </Col>
          <Col style={{borderLeft: '1px solid rgba(56, 127, 83, 0.7)'}}>
              <Row>
                <Col><center><h2 className='ms-5'>Czwartek</h2></center></Col>
                <Col xs='auto' ><Button variant='success' size='sm' className='float-end mt-1' onClick={() => setShow({name: 'Czwartek', short: 'czw'})}><FontAwesomeIcon icon={faPlus} /></Button></Col>
              </Row>
              {posilki('czw')}
          </Col>
        </Row>
        <hr className='mt-0 mb-0'/>
        <Row>
          <Col>
              <Row>
                <Col><center><h2 className='ms-5'>Piątek</h2></center></Col>
                <Col xs='auto' ><Button variant='success' size='sm' className='float-end mt-1' onClick={() => setShow({name: 'Piątek', short: 'pt'})}><FontAwesomeIcon icon={faPlus} /></Button></Col>
              </Row>
              {posilki('pt')}
          </Col>
          <Col style={{borderLeft: '1px solid rgba(56, 127, 83, 0.7)'}}>
              <Row>
                <Col><center><h2 className='ms-5'>Sobota</h2></center></Col>
                <Col xs='auto' ><Button variant='success' size='sm' className='float-end mt-1' onClick={() => setShow({name: 'Sobota', short: 'sob'})}><FontAwesomeIcon icon={faPlus} /></Button></Col>
              </Row>
              {posilki('sob')}
          </Col>
          <Col style={{borderLeft: '1px solid rgba(56, 127, 83, 0.7)'}}>
              <Row>
                <Col><center><h2 className='ms-5'>Niedziela</h2></center></Col>
                <Col xs='auto' ><Button variant='success' size='sm' className='float-end mt-1' onClick={() => setShow({name: 'Niedziela', short: 'nd'})}><FontAwesomeIcon icon={faPlus} /></Button></Col>
              </Row>
              {posilki('nd')}
          </Col>
        </Row>
    </Container>
    <ZaplanujDzien show={show} setShow={setShow} />
    </>)
}

export default Planer