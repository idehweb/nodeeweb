import {
    BulkDeleteButton,
    Create,
    Datagrid,
    DeleteButton,
    Edit,
    EditButton,
    Filter,
    FunctionField,
    NumberInput,
    Pagination,
    ReferenceField,
    ReferenceInput,
    ResourceContextProvider,
    SearchInput,
    SelectInput,
    Show,
    ShowButton,
    SimpleShowLayout,
    TextField,
    TextInput,
    useResourceContext, useTranslate,useGetList,ListContextProvider,useList,useGetOne
} from 'react-admin';
import { Card, CardContent, CardHeader } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Block } from 'notiflix/build/notiflix-block-aio';
import React, {Fragment,useState,useEffect} from 'react';
import {useParams} from 'react-router';
import {CategoryRounded as Icon, LibraryAdd} from '@mui/icons-material';
import {CustomResetViewsButton, List, SimpleForm} from '@/components';
import useStyles from '@/styles';
import {Val} from '@/Utils';
import API, {BASE_URL} from '@/functions/API';
import {Chip} from '@mui/material';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
export const ChangesForm = (props) => {
    const [pro,setPro] = useState('')
    const [progress,setProgress] = useState(0)
    const [success,setSuccess] = useState(false)
    const { id } = useParams();
    const {data,selectedProduct,onSuccess} = props;
    let newProductPrice = [];
    let failedProductPrice = [];
    const translate = useTranslate();
    const updateProduct=async (i,product,prices)=>{
        Block.arrows('.pID-'+product._id);
        
         setTimeout(function() {
            setProgress(i)
            if(product.combinations){
                product.combinations.map((combinition,ic)=>{
                    if(combinition){
                        if(combinition.price){
                                if(prices.plusPercent){
                                let percentPlus = combinition.price + (1/100) * prices.plusPercent * combinition.price;
                                combinition.price = percentPlus;
                                }
                                if(prices.minusPercent){
                                    let percentMinim = combinition.price - (1/100) * prices.plusPercent * combinition.price;
                                    combinition.price = percentMinim;
                                }
                                if(prices.plusxp){
                                    combinition.price +=  prices.plusxp
                                }
                                if(prices.minusxp){
                                    combinition.price -=  prices.minusxp
                                }
                        }
                        if(combinition.salePrice){

                        }
                    }
                })
                
            }
            updateServer(product).then((data)=>{
                newProductPrice.push(data)
                setPro(product.title.fa)
                Block.remove('.pID-'+product._id);
            }).catch(()=>{
                failedProductPrice.push(product)
            })
            
        }, 1000 * i );
        setSuccess(true);
        onSuccess(true)
        console.log('failedProductPricefailedProductPrice',failedProductPrice);
        console.log('newProductPricenewProductPrice',newProductPrice);
        
    }
    const update = async (prices) =>{
        if(selectedProduct.length !== 0){
            selectedProduct.forEach(function (product, index) {
                updateProduct(index,product,prices)
            });
        }else{
            if(data.length !== 0){
                data.forEach(function (product, index) {
                        updateProduct(index,product,prices)
                });
            }
        }
    }
    const updateServer = async (product) =>{
        API.put("/product/" + product._id, JSON.stringify({ ...product }))
        .then(({ data = {} }) => {
          return data;
        })
        .catch((err) => {
          console.log("errerrerrerr", err);
        });
    }

    return (
        <SimpleForm onSubmit={update}>
            <NumberInput
                min={0}
                source="plusPercent"
                label={translate("resources.category.addxpercent")}
            />
            <NumberInput
                min={0}
                source="minusPercent"
                label={translate("resources.category.minusxpercent")}
            />
            <NumberInput
                min={0}
                source="plusxp"
                label={translate("resources.category.addxprice")}
            />
            <NumberInput
                min={0}
                source="minusxp"
                label={translate("resources.category.minusxprice")}
            />
            {
                success ? (
                    <div style={{width:'100%',color:'green'}}>
                        بروز رسانی با موفقیت انجام شد
                    </div>
                ):(
                        <>
                            <div style={{width:'100%'}}>
                                {progress > 0 && (
                                        <LinearProgress style={{height:'20px',backgroundColor:'#257d7a'}}  variant="determinate"  value={progress} />
                                    )}
                            </div>
                            <span style={{marginTop:'20px',fontSize:'20px'}}>
                                
                                {
                                pro && (
                                    <>
                                    
                                    {pro}
                                    </>
                                    
                                )
                                }</span>
                        </>
                )
            }



            
            
        </SimpleForm>
    );
};
export default React.memo(ChangesForm)