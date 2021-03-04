import React,{ useState,useEffect,forwardRef } from 'react';
import Swal from 'sweetalert2'
import { app } from '../services/firebase'
import MaterialTable from "material-table"
import { Link } from "react-router-dom"
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import AddBoxIcon from '@material-ui/icons/AddBox';
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn'

const ProductList = () => {
    const[products,setProducts] = useState([])
    const[productsTable,setProductsTable] = useState([])
    const[search,setSearch] = useState("")

    useEffect(() => {
        const fetchProducts = async() => {
            const db = app.firestore()
            const data = await db.collection('products').get()
            const products = data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
            setProducts(products)
        }
        fetchProducts()
    },[])

    const columns = [
        { title: "Nombre", field: "name"},
        { title: "Descripción", field: "description"},
        { title: "Cantidad", field: "stock"},
        { title: "Precio", field: "price",render: rowData => "$"+rowData.price},
    ]

    const acciones = [  
        rowData => ({
            icon: () =><Link to={`/product/${rowData.id}`}> <Edit style={{ color: 'blue' }}/></Link>,
            tooltip: 'Editar',
        }),
        rowData => ({
            icon: () => <DeleteOutline style={{ color: 'green' }}/>,
            tooltip: 'Eliminar',
            onClick: async(event,rowData) => {
                Swal.fire({
                    title:'Procesando'
                })
                Swal.showLoading()
                const db = app.firestore();
                await db.collection("products").doc(rowData.id).delete()
                const newProducts = products.filter(product => product.id !== rowData.id)
                setProducts(newProducts)
                Swal.close()
            }
        }),
    ]

    const tableIcons = {
        Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
        Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
        Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
        DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
        Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
        Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
        Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
        FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
        LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
        NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
        PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
        ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
        Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
        SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
        ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
        ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
    };

    useEffect(() => {
        if(search){
            const filterProducts = products.filter(product => product.name.toLowerCase().includes(search.toLowerCase()))
            setProductsTable(filterProducts)
        }else{
            setProductsTable(products)
        }
    },[search,products])

    return(
        <React.Fragment>
            <Grid container spacing={1}>
                <Grid item md={7}></Grid>
                <Grid item md={3}>
                    <TextField 
                        variant='outlined'
                        value={search}
                        onChange={(event)=> setSearch(event.target.value)}
                        id="name" 
                        size='small'
                        label="Buscar..." 
                        fullWidth
                    />
                </Grid>
                <Grid item md={2}>
                        <Button 
                            color='secondary'
                            variant="contained" 
                            endIcon={<AddBoxIcon/>}
                            component={Link} 
                            to={'/newProduct'}
                            fullWidth
                        >
                            NUEVO
                        </Button>
                </Grid>
                <Grid item md={12}>
                    <MaterialTable
                        columns={columns.map((c) => ({ ...c, tableData: undefined }))}
                        data={productsTable}
                        icons={tableIcons}
                        actions={acciones}
                        components={{
                            Container: props => <Paper {...props} elevation={0}/>,
                        }}
                        options={{
                            actionsColumnIndex: -1,
                            toolbar: false,
                            pageSize: 10
                        }} 
                        localization={{
                            body:{
                                emptyDataSourceMessage: 'No hay productos disponibles'
                            },
                            pagination:{
                                labelDisplayedRows: '{from}-{to} de {count}',
                                labelRowsSelect: 'productos'
                            }
                        }}
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    )
}


export default ProductList