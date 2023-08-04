import React, {useEffect, useState} from 'react';

import {Col, Container, Row,Button} from 'shards-react';
import store from "#c/functions/store";
import {getContacts,addToMyContacts} from "#c/functions";
import {Navigate} from "react-router-dom";
// import {io} from "socket.io-client"
import {withTranslation} from 'react-i18next';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
// Import Swiper styles
// 9100444540

const Contacts = ({match, location, history, t}) => {
  // const socket = io('https://chat.gilbanu.ir');
  let st = store.getState().store;
  // let token = null;
  // if (st.user && st.user.token) {
  let {token = null, _id, firstName, lastName} = st.user;
  // }
  // const [isConnected, setIsConnected] = useState(socket.connected)
  const [contacts, setContcats] = useState([])
  const [enableAddContact, setEnableAddContact] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [from, setFrom] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [lastPong, setLastPong] = useState(null)
  useEffect(() => {
    getMyContacts();
  }, [])

  const getMyContacts = () => {
    getContacts().then((e) => {
      setContcats(e);

    })
  }
  const enableAddContactfunc = () => {
    setEnableAddContact(true)
  }
  const addContact = (e) => {
    e.preventDefault();
    addToMyContacts(phoneNumber).then((e) => {
      setPhoneNumber('');
      setEnableAddContact(false);

    })
  }
  if (!token) {
    return <Navigate to={'/login/goToChat'} push={false} exact={true}/>;

  }
  return (
    <Container fluid className="main-content-container fghjkjhgf">
      <Row className="relative mt-3 mb-3">

        <Col>
          {!enableAddContact && <Button onClick={enableAddContactfunc} className={'fixed buttop lefter'}><PersonAddIcon/></Button>}
          {enableAddContact && <form onSubmit={addContact}><input type={'tel'} className={'fixed customer_f'} onChange={(e) => setPhoneNumber(e.target.value)}
                                        value={phoneNumber}/><Button onClick={addContact} className={'fixed buttop lefter'}><PersonAddIcon/></Button></form>}

        </Col>

      </Row>
      {contacts && contacts.map((e, k) => {
        return <Row className="relative mt-3 mb-3" key={k}>

          <Col>

          </Col>

        </Row>
      })}

    </Container>
  );
};

export default withTranslation()(Contacts);
