import React, {useEffect, useState} from "react";
import {
    eid,
    slide1Img,
    slide2Img,
    slide3Img,
    slide4Img,
    slide5Img,
    slideOffer1Img,
    slideOffer2Img,
    slideOffer3Img,
    slideOffer4Img,
    slideOffer5Img,
    slideOffer6Img,
    slideOffer7Img,
    slideOffer8Img,
    valentineDays
} from "#c/assets/index";
import Xarrow, {useXarrow, Xwrapper} from 'react-xarrows';
import {
    enableAdmin,
    enableAgent,
    enableSell,
    fetchCats,
    getModelsData,
    getPosts,
    getPostsByCat,
    getThemeData,
    isClient,
    loadPosts,
    loadProducts,
    SaveData,
    setCountry
} from "#c/functions/index";
import {ProductsSliderServer} from "#c/components/components-overview/ProductsSlider";
import {PostSliderServer} from "#c/components/components-overview/PostSlider";
import Draggable from 'react-draggable'; // Both at the same time
import {withTranslation} from "react-i18next";

const boxStyle = {border: 'grey solid 2px', borderRadius: '10px', padding: '5px'};

const DraggableBox = ({i, item}) => {
    const updateXarrow = useXarrow();
    return (
        <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
            <div id={item.name} style={boxStyle}>
                <div id={'dr' + i} className={'handle'}>
                    <div className={'  table'} key={i}><label className={'the-head'}>{item.name}</label>
                        {item.schema && item.schema.map((sh, j) => {
                            console.log()
                            return <div className={'d-flex'}>
                                <label>{sh.name}</label><label>{sh.type}</label>
                              {/*<label>{item.schema[sh].ref}</label>*/}
                            </div>
                        })}
                    </div>
                </div>
            </div>
        </Draggable>
    );
};
const Db = (props) => {
  console.log('Db...')
    // const Recipe = React.lazy(() =>
    //     import(`../../../public_media/theme/shomeis/shomeis.json`)
    //         .catch(() => ({ default: () => <div>Not found</div> }))
    // );
    // console.log('Reci/pe',Recipe)
    const [tables, setTables] = useState(null);
    useEffect(() => {
        if (!tables)
            getModelsData().then(r => {
                // if (r && r.tables) {
                //     console.log('r.tables', r.tables)
                    setTables(r);
                // }
            })
    }, []);
    const handleStart = (e) => {

    };
    const handleDrag = (e) => {

    };
    const handleStop = (e) => {

    };
// console.clear()
// console.log('tables',tables);
//     if(tables)
//     axis="x"
//     handle=".handle"
//     defaultPosition={{x: 0, y: 0}}
//     position={null}
//     grid={[25, 25]}
//     scale={1}
//     onStart={handleStart}
//     onDrag={handleDrag}
//     onStop={handleStop}
    const updateXarrow = useXarrow();
    return (<div className="main-content-container fghjkjhgf ltr">

            {/*<div className={'ltr'}>*/}

            {/*{tables && tables.map((t, i) => {*/}
            {/*return <Draggable onDrag={updateXarrow} onStop={updateXarrow}>*/}
            {/*<div id={'dr' + i} className={'handle'}>*/}
            {/*<div className={'  table'} key={i}><label className={'the-head'}>{t.name}</label>*/}
            {/*{t.schema && Object.keys(t.schema).map((sh, j) => {*/}
            {/*console.log()*/}
            {/*return <div className={'d-flex'}>*/}
            {/*<label>{sh}</label><label>{t.schema[sh].instance}</label><label>{t.schema[sh].ref}</label>*/}
            {/*</div>*/}
            {/*})}*/}
            {/*</div>*/}
            {/*</div>*/}
            {/*</Draggable>*/}
            {/*})}*/}

            {/*</div>*/}
            <div style={{display: "flex", justifyContent: "space-evenly", width: "100%"}}>
                <Xwrapper>
                    {tables && tables.map((t, i) => {
                        if (i < 2)
                            console.log('i', i)
                        return <DraggableBox i={i} item={t}/>
                    })}
                    <Xarrow start={'Sms'} end="Action"/>
                    <Xarrow start={'Customer'} end="Action"/>
                    <Xarrow start={'Comment'} end="Action"/>
                    <Xarrow start={'User'} end="Action"/>
                    <Xarrow start={'Product'} end="Action"/>
                    <Xarrow start={'Order'} end="Action"/>
                    <Xarrow start={'Transaction'} end="Action"/>
                    <Xarrow start={'Order'} end="Transaction"/>
                    <Xarrow start={'Settings'} end="Action"/>
                    <Xarrow start={'Post'} end="Settings"/>
                    <Xarrow start={'Discount'} end="Order"/>
                    {/**/}
                    {/**/}
                    <Xarrow start={'Customer'} end="Transaction"/>
                    {/**/}
                    <Xarrow start={'PostCategory'} end="Menu"/>
                    <Xarrow start={'Link'} end="Menu"/>
                    <Xarrow start={'Media'} end="Menu"/>
                    <Xarrow start={'Media'} end="Menu"/>
                    <Xarrow start={'PostCategory'} end="Post"/>
                    <Xarrow start={'Category'} end="Product"/>
                    <Xarrow start={'Attributes'} end="Product"/>
                    <Xarrow start={'Customer'} end="Product"/>
                    <Xarrow start={'Customer'} end="Order"/>
                    <Xarrow start={'Customer'} end="Sms"/>
                    <Xarrow start={'Customer'} end="Comment"/>

                </Xwrapper>
            </div>

        </div>
    );
    // else
    //     return <></>
};
export const HomeServer = [
    {
        func: loadProducts,
        params: "61d58e38d931414fd78c7fca"
    },
    {
        func: loadProducts,
        params: "61d58e37d931414fd78c7fbd"
    },
    {
        func: loadProducts,
        params: "61d58e37d931414fd78c7fb7"
    },
    {
        func: loadProducts,
        params: "61d58e37d931414fd78c7fb9"
    },
    {
        func: loadProducts,
        params: "61d58e37d931414fd78c7fbc"
    },
    {
        func: loadProducts,
        params: "61d58e37d931414fd78c7fba"
    },
    {
        func: loadPosts,
        params: null
    },
    {
        func: fetchCats,
        params: null
    }];
// export const HomeServer = loadProducts;
// export const HomeServerArgument = "61d58e37d931414fd78c7fba";
// export const HomeServer = fetchData("61d58e37d931414fd78c7fba");
export default withTranslation()(Db);
