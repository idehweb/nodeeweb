import React, {useEffect, useState} from 'react';

import {Col, Container, Row,Button} from 'shards-react';
import store from "#c/functions/store";
import {startChat} from "#c/functions";
import {Navigate,Link} from "react-router-dom";
import SendIcon from '@mui/icons-material/Send';
import AddCommentIcon from '@mui/icons-material/AddComment';
import {io} from "socket.io-client"
import {withTranslation} from 'react-i18next';
import RecentActorsIcon from '@mui/icons-material/RecentActors';

// Import Swiper styles
// 9100444540

const Chat = ({match, location, history, t}) => {
  // const socket = io('https://chat.gilbanu.ir');
  const socket = io('http://localhost:4000', {
    transports: ['websocket']
  });

  let st = store.getState().store;
  // let token = null;
  // if (st.user && st.user.token) {
  let {token = null, _id, firstName, lastName} = st.user;
  // }
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [inputValue2, setInputValue2] = useState('')
  const [message, setMessage] = useState('')
  const [from, setFrom] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [lastPong, setLastPong] = useState(null)
  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    })
    socket.on('disconnect', () => {
      setIsConnected(false);
    })
    
    socket.on('get message' + _id, (x) => {
      if (x.from && x.msg) {
        setMessage(x.msg);
        setFrom(x.from);
      }
    })
    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('pong')
    }
  }, [])
  const sendPing = (e) => {
    e.preventDefault();
    setInputValue('');
    socket.emit('send message', token + '::::' + inputValue + '::::' + inputValue2)
  }
  const useContacts = () => {
    startChat(inputValue2, _id).then((e) => {
      console.log('startChat', e)
    })
  }
  const goToContacts = () => {
    return <Navigate to={'/contacts'} push={true} exact={true}/>;

  }
  if (!token) {
    return <Navigate to={'/login/goToChat'} push={false} exact={true}/>;

  }
  return (
    <Container fluid className="main-content-container fghjkjhgf">

      <Row className="relative mt-3 mb-3">

        <Col>

          <Link to={'/contacts'}><Button className={'fixed buttop'}><RecentActorsIcon/></Button></Link>

          <Button onClick={useContacts} className={'fixed buttop lefter'}><AddCommentIcon/></Button>

        </Col>

      </Row>
      <Row className="relative mt-3 mb-3">
        <Col>
          {_id}
          {isConnected && firstName + ' ' + t('is online')}
          {!isConnected && firstName + ' ' + t('is offline')}
        </Col>
      </Row>
      <Row className="relative mt-3 mb-3">
        <Col>
          {message} - {from}
        </Col>
      </Row>
      <Row className="relative mt-3 mb-3">
        <Col>
          <form onSubmit={sendPing}>

            <input type={'text'} className={'fixed input'} onChange={(e) => setInputValue(e.target.value)}
                   value={inputValue}/>
            <Button onClick={sendPing} className={'fixed but'}><SendIcon/></Button>
          </form>
        </Col>
      </Row>
    </Container>
  );
};

export default withTranslation()(Chat);
