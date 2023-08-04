import React, {useState} from "react";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import {withTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import PriceFilter from "#c/components/page-builder/sidemenu/filters/PriceFilter";
import { useLocation,useNavigate  } from 'react-router-dom';
import {
  isClient,
} from "#c/functions/index";
const Collapsable = (props) => {
  const navigate = useNavigate();
  let url = isClient ? new URL(window.location.href) : "";
  const pathnameArray = url.pathname.split('/');
  pathnameArray[pathnameArray.length - 1] = parseInt(pathnameArray[pathnameArray.length - 1])+1;
  
 
  console.log('urlurlurlurlurlurlurlurlurlurlurlurl',url.pathname);
 
  let {title, values,slug,defaultStatus=false,type} = props;
  const [open, setOpen] = useState(defaultStatus);
  const handleClick = () => {
    setOpen(!open);
  };
  const handlerPriceChange =(price)=>{
              url.searchParams.set(slug,price[0]+'-'+price[1]);
            url.searchParams.set('offset', 0);
            navigate(url.pathname+url.search);
  }

  if(type === 'price'){
          return (<List
            dir="rtl"
            sx={{width: '100%', bgcolor: 'background.paper'}}
            component="nav"
            aria-labelledby="nested-list-subheader"
            style={{boxShadow: '0 0 1px 1px #e6e6e6',padding:'10px'}}
          >
            <ListItemButton onClick={handleClick} style={{background:'rgba(125,125,125,.15)'}}>
              <ListItemText primary={title} />
              {open ? <ExpandLess/> : <ExpandMore/>}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <PriceFilter handlerPriceChange={handlerPriceChange}/>
              </List>
            </Collapse>
          </List>);
        }
let urlMe;
  return (
    <List
      dir="rtl"
      sx={{width: '100%', bgcolor: 'background.paper'}}
      component="nav"
      aria-labelledby="nested-list-subheader"
      style={{boxShadow: '0 0 1px 1px #e6e6e6',padding:'10px'}}
    >
      <ListItemButton onClick={handleClick} style={{background:'rgba(125,125,125,.15)',fontWeight:600}}>
        <ListItemText primary={title} />
        {open ? <ExpandLess/> : <ExpandMore/>}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          
                {values && values.map((ij, idxx2) => {
            // url.searchParams.set(slug, ij.slug);
            url.searchParams.set('offset', 0);
            // console.log('searchParams',url.searchParams);
            // console.log('url.search',url.search);
            // console.log('url.pathname',url.pathname);
            // console.log('urlurlurlurlurl',url);
            url.pathname = 'product-category/'+ij.slug;
            return( 
              <Link to={url.pathname + url.search} style={{color:'#868e96'}}>
                 {/* <Link to={url.pathname + url.search} style={{color:'#868e96'}}> */}
                <ListItemButton sx={{pl: 4}} alignItems="flex-end">

                  <ListItemText primary={ij.name.fa}/>
                </ListItemButton>
              </Link>
            )
          })}

        </List>
      </Collapse>
    </List>);
// {/*<Link to={'/' + slug + '/' + ij.slug + '/'}>*/}
        }
export default withTranslation()(Collapsable);
