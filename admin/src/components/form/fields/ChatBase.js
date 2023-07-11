import React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { Input } from '@mui/material';
import axios  from 'axios';
// let messages = [];
const ChatCloseIcon = () =>{
    return (
        <svg style={{position:'relative'}} fill="#ffffff" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
        </svg>
    )
}
 const ChatIcon = (props) =>{
    const {action}=props;
    const svgstyles = {
        fill:'#ffffff'
    }
    if(action)
    return (
        <div id="box-widget-icon" className="fadeInUp">
            <div className="widget-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
                    <path d="M60.19,53.75a3,3,0,1,0,3.06,3A3,3,0,0,0,60.19,53.75Zm-11.37,0a3,3,0,1,0,3.06,3A3,3,0,0,0,48.81,53.75Zm45.94,4A35,35,0,1,0,52.75,92v12.76s14.55-4.25,30.53-19.28C94.68,74.74,94.75,59.41,94.75,59.41l0,0C94.74,58.87,94.75,58.3,94.75,57.72Zm-10.14.6s0,10.64-8,18.09A57.93,57.93,0,0,1,53,89.8V80.34A24.29,24.29,0,1,1,84.61,57.16c0,.4,0,.8,0,1.19ZM70.69,53.75a3,3,0,1,0,3.06,3A3,3,0,0,0,70.69,53.75Z" transform="translate(0.25 0.25)" style={svgstyles}></path>
                </svg>
            </div>
        <div className="unread-num"></div>
        </div>
    )
}

 const ChatContent1 = () =>{
    return (
        <>
            <div style={{
                width:'100%',
                height:'100%',
                position:'relative'
                
            }}>
                <header style={{
                    width:'100%',
                    height:'70px',
                    background:'rgb(40,96,133)',
                    boxShadow: '0 1px 4px rgba(0,0,0,.2)',
                    padding: '13px 10px',
                    display:'flex',
                    borderTopLeftRadius:'15px',
                    borderTopRightRadius:'15px'

                }}>
                   
                    <div style={{
                        width: "93px",
                         marginRight: "-3px"
                    }} className="pull-right avatar">
                        <span title="" data-container="body" rel="tooltip" data-placement="auto left" data-original-title="دیجیتال مارکتینگ آروند">
                            <img src="https://cdn.goftino.com/static/assets/img/profile.png" alt="avatar" width="40" height="40" />
                        </span>
                        <span title="" data-container="body" rel="tooltip" data-placement="auto left" data-original-title="ادمین 1">
                            <img src="https://cdn.goftino.com/profile/63f9cd63f0d5b21b92d7e53ew12a.jpg" alt="avatar" width="40" height="40" />
                        </span>
                        <span title="" data-container="body" rel="tooltip" data-placement="auto left" data-original-title="علیرضا رضوان">
                            <img src="https://cdn.goftino.com/static/assets/img/profile.png" alt="avatar" width="40" height="40" />
                        </span>
                    </div>
                    
                    
                    <div className="pull-right box-title">
                        <div className="title-name">پشتیبانی سایت آروند شاپ</div>
                        <div className="title-text">پاسخگوی سوالات شما هستیم</div>
                    </div>
                    <div id={'closeIcon'}>

                    </div>
                </header>
                <main style={{
                    height:'500px',
                    overflowY:'scroll',
                    background:'#ddd',
                    scrollBehavior:'hidden',
                    background:"url('data:image/png;base64,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')"
                }}>
                </main>
                <footer style={{
                    height:'70px',
                    background:'#ffffff',
                    position:'relative',
                    bottom:'0px',
                    zIndex:'99999',
                    borderBottomLeftRadius:'15px',
                    borderBottomRightRadius:'15px'
                }}>

                </footer>

            </div>

        </>
    )
}
const ChatType = (props) =>{
    let {callBackData} = props;
    const [text,setText] = React.useState('')
    const handlerEnter = (e) =>{
        if (event.charCode === 13) {
            callBackData(text)
            setText('')
        }
    }
    const handlerClick=(e)=>{
        callBackData(text)
        setText('')
    }
    return (
        <Grid container spacing={2} columns={12} style={{paddingTop:'5px'}}>
            <Grid item xs={2}>
                <span><KeyboardVoiceIcon cursor='pointer' sx={{color:'#bababa',"&:hover": { color: "#999" }}}/></span>
            </Grid>
            <Grid item xs={8}>
                <span>
                    <Input
                     type={'text'}
                     placeholder={'پیامی بنویسید...'}
                     required
                     value={text}
                     onChange={(e)=>{
                        setText(e.target.value)
                     }}
                     onKeyPress={handlerEnter}
                     disableUnderline={true}
                     fullWidth={true}
                     multiline={true}
                     className='chatFont'
                     autoFocus={true}
                     focused
                     />
                </span>
            </Grid>
            <Grid item xs={1}>
                <span><EmojiEmotionsOutlinedIcon cursor='pointer' sx={{color:'#bababa',"&:hover": { color: "#999" }}}/></span>
            </Grid>
            <Grid item xs={1}>
                <span>
                    {
                        text ? (
                            <SendOutlinedIcon cursor='pointer'
                                sx={{transform: 'rotate(180deg)',color:'rgb(40,96,133)'}}
                                onClick={(e)=>handlerClick(text)}
                             />
                        ):(
                            <AttachFileOutlinedIcon cursor='pointer'
                                sx={{color:'#bababa',"&:hover": { color: "#999" }}}
                            />
                        )
                    }
                </span>
            </Grid>
      </Grid>
    )
}

const ChatSender = (props) =>{
const {data}=props;
  return (
                    <React.Fragment>
                        {
                            data.type==='client' ? (
                                <div className="yours messages">
                                    <div className="message last">
                                        {data.text}
                                    </div>
                                </div>
                            ): data.type==='support'  && (
                                <div className="mine messages">
                                    <div className="message last">
                                        {data.text}
                                    </div>
                                </div>
                            )
                        }
                    </React.Fragment>
  )
}



const ChatContent =   (props) =>{
    const {action,onClose,options} = props;
    const {title,subTitle} = options;
    const [messages,setMessages] = React.useState([]);
    const Header = styled(Paper)(({ theme }) => ({
        backgroundColor: 'rgb(40,96,133)',
    
        padding: theme.spacing(1),
        textAlign: 'center',
        color: '#ffffff',
        borderBottomLeftRadius:'0px !important',
        borderBottomRightRadius:'0px !important',
      }));
      const Footer = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        borderTopLeftRadius:'0px !important',
        borderTopRightRadius:'0px !important',
      }));
      const Close = styled(Paper)(({ theme }) => ({
        position: 'absolute',
        zIndex: '20005',
        width: '30px',
        height: '30px',
        top: '0',
        left: '0',
        padding:'4px !important',
         borderRadius:'30px !important',
         background:'rgb(40,96,133)',
         cursor:'pointer'
      }));




      const handlerCallBackMessage = async (value) =>{
        const headers = { 
            // "Access-Control-Allow-Origin": "http://localhost:3000",
            // "Access-Control-Allow-Credentials": "true",
            // "Access-Control-Allow-Headers": "Content-Type, Authorization, x-id,Content-Length, X-Requested-With",
            // "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin': '*',
            "X-Id-Token": "abc123abc123"
        };
        if(value){
            let messageObjClient = {
                username:'mohammad',
                // type:'client',
                text:value
            }
            setMessages(messages => [...messages,messageObjClient] );
            console.log('AxiosVaslue',messageObjClient);
            // ApiUrl/cUSTOMER
            await axios.post('https://idehweb.com/chatgpt/index.php', messageObjClient,{headers}).then((res)=>{
                console.log('Reeeeeeeeees',res);
                if(res){
                    const {choices} = res;
                    let messageObjSupport = {
                        username:'mohammad',
                        type:'support',
                        text:choices.message.content
                    }
                    setMessages(messages => [...messages,messageObjSupport] );
                }
            }).catch((err)=>{
                    console.log('errrorrFromAxios',err);
            });
            
            
        }
      }
    if(action)
    return (
        <>
                <div style={{bottom:'20px'}}>
                    <Box sx={{ flexGrow: 1 }} >
                            <Grid container spacing={1} direction="column">
                                <Grid xs={12} md={12}>
                                <Header>
                                    <Grid container spacing={2} columns={12}>
                                        <Grid item xs={3}>
                                            <span title={title} data-container="body" rel="tooltip" data-placement="auto left" data-original-title={title}>
                                                <img src="https://cdn.goftino.com/static/assets/img/profile.png" alt="avatar" width="40" height="40" />
                                            </span>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <section style={{textAlign:'right'}}>
                                                <span style={{width:'100%',display:'inline-block'}}>{title}   </span>
                                                <span style={{width:'100%',display:'inline-block',fontSize:'12px'}}>{subTitle}   </span>
                                            </section>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <Close onClick={()=>onClose(true)}>
                                                <ChatCloseIcon/>
                                            </Close>
                                        </Grid>
                                    </Grid>
                                </Header>
                                </Grid>
                                <Grid xs={12} md={12}>
                                    <div className={'chatBody'}>
                                        <div className="chat">
                                            {
                                                messages && (
                                                    messages.map((message,i)=>
                                                        <ChatSender key={i} data={message}/>
                                                    )
                                                )
                                            }
                                            
                                        </div>
                                    </div>
                                        
                                </Grid>
                                <Grid xs={12} md={12}>
                                    <Footer>
                                        <ChatType callBackData={(e)=>handlerCallBackMessage(e)}/>
                                    </Footer>
                                </Grid>
                            </Grid>
                    </Box>
                </div>
        </>
    )
}
 const ChatBase = (props) =>{
    const [toggleChat,setToggleChat] = React.useState(true)
    const {field} = props;
    const {position,left,bottom,width,top,height,active} = field;
    if(active)
return(
    <>
        <section style={{
            position:position,
            left:left,
            bottom:bottom,
            zIndex:'9999999999',
            width:width,
            height:height,
            top:top
        }}>
        <ChatIcon action={false} onClick={()=>setToggleChat(false)}/>
        <ChatContent options={field} action={true} onClose={()=>setToggleChat(false)}/>
        </section>
    </>
)
}
export default React.memo(ChatBase)