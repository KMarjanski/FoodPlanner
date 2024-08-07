import React, { useContext } from 'react'
import { StoreContext } from './store/StoreProvider';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faIgloo } from '@fortawesome/free-solid-svg-icons';

const Navigation = () => {
  const { setTab } = useContext(StoreContext);
  return (
    <Navbar bg="success" data-bs-theme="dark">
        <Container fluid>
          <Navbar.Brand>Jedzonko</Navbar.Brand>
          <Nav className="me-auto" onSelect={(key) => setTab(key)} >
            <Nav.Link disabled eventKey='Calendar'><FontAwesomeIcon icon={faCalendarDays} /></Nav.Link>
      <Nav.Link eventKey='Planer'>Planer</Nav.Link>
            <Nav.Link eventKey='Przepisy'>Przepisy</Nav.Link>
            <Nav.Link eventKey='Koszyk'>Koszyk</Nav.Link>
            <Nav.Link disabled eventKey='Lodowka'><FontAwesomeIcon icon={faIgloo} /></Nav.Link>
          </Nav>
        </Container>
      </Navbar>
  )
}

export default Navigation