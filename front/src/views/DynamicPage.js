import React, {useEffect, useState} from "react";
import {Container} from "shards-react";
import {useParams} from "react-router-dom";
import {withTranslation} from "react-i18next";
import {dFormat, PriceFormat} from "#c/functions/utils";
import MainContent from '#c/components/MainContent';
import PageBuilder from "#c/components/page-builder/PageBuilder";
import {addBookmark, clearPost, getPage, isClient, loadPost, loveIt, MainUrl, savePost} from "#c/functions/index";
import {SnapChatIcon} from "#c/assets/index";
import Loading from "#c/components/Loading";
import store from "../functions/store";
import {useSelector} from "react-redux";
const DynamicPage = (props) => {
  let {match, location, history, t, url,elements} = props;
  let page = useSelector((st) => {
    return st.store.page || [];
  });
  let params = useParams();
  let the_id = params._id;
  const [mainId, setMainId] = useState(the_id);
  const [tab, setTab] = useState("description");
  const [state, setState] = useState(isClient ? [] : (page || []));
  const [lan, setLan] = useState(store.getState().store.lan || "fa");
    useEffect(() => {
    },[]);
  let {
    load,
    title,
    description,
    photos,
    redirect,
    _id,
    thumbnail,
    kind,
    excerpt,
    maxWidth,
    notfound,
    enableAdmin = false,
    views = null
  } = state;
  return (
    <Container className="main-content-container p-0 pb-4 kiuytyuioiu bg-white" key={0}>
      <div className={'the-body'} key={1}>
        <PageBuilder elements={elements} data={params} params={params} kind={kind} maxWidth={maxWidth}/>
      </div>
    </Container>
  );
};
export const PageServer = [
  {
    func: loadPost,
    params: "6217502008d0e437d6b4ad97"
  }
];
export default withTranslation()(DynamicPage);
