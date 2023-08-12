import React from 'react';
// import clsx from 'clsx';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import {Alert, Button, Col, Row} from 'shards-react';
import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";
import store from "#c/functions/store";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {withTranslation} from 'react-i18next';
// import {Button, Col, Container, Nav, Na .vItem, NavLink, Row} from 'shards-react';
import {Link} from 'react-router-dom';

import useStyles from './styles';
import {dateFormat, PriceFormat} from '#c/functions/utils';
import {MainUrl} from '#c/functions';


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  else if (b[orderBy] > a[orderBy]) return 1;
  else return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  if (array && array.length > 0) {
    const stabilizedThis = array.forEach((el, index) => [el, index]);
    if (stabilizedThis) {
      stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
      });
      return stabilizedThis.forEach((el) => el[0]);
    } else {
      return array
    }
  } else {
    return [];
  }
}

function EnhancedTableHead({headCells, classes, order, orderBy, t}) {
  // const createSortHandler = property => event => {
  //   onRequestSort(event, property);
  // };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, idx) => (
          <TableCell
            key={idx}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              // onClick={createSortHandler(headCell.id)}
            >
              {t(headCell.label)}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// EnhancedTableHead.propTypes = {
//   classes: PropTypes.object.isRequired,
//   numSelected: PropTypes.number.isRequired,
//   onRequestSort: PropTypes.func.isRequired,
//   onSelectAllClick: PropTypes.func.isRequired,
//   order: PropTypes.oneOf(['asc', 'desc']).isRequired,
//   orderBy: PropTypes.string.isRequired,
//   rowCount: PropTypes.number.isRequired,
// };
//
// const useToolbarStyles = makeStyles(theme => ({
//   root: {
//     paddingLeft: theme.spacing(2),
//     paddingRight: theme.spacing(1),
//   },
//   highlight:
//     theme.palette.type === 'light'
//       ? {
//         color: theme.palette.secondary.main,
//         backgroundColor: lighten(theme.palette.secondary.light, 0.85),
//       }
//       : {
//         color: theme.palette.text.primary,
//         backgroundColor: theme.palette.secondary.dark,
//       },
//   title: {
//     flex: '1 1 100%',
//   },
// }));

const EnhancedTableToolbar = (props) => {
  // const classes = useToolbarStyles();
  // const {numSelected} = props;

  return <Toolbar></Toolbar>;
};

function DataTable({
                     data: rows = [],
                     headCells = [],
                     base = '',
                     count,
                     renewData,
                     t,
                     newText,
                     buttonText,
                     model,
                     actions,
                     rules
                   }) {
  console.log('DataTable',)
  let lan = store.getState().store.lan || 'fa';

  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  let buttonLink = '', pageBuilder = false;
  // console.clear()
  // console.log('rules',rules)
  if (rules.url) {
    buttonLink = rules.url;
  }
  if (rules.pageBuilder) {
    pageBuilder = true;
  }
  if (headCells && !headCells[0] && rows && rows[0]) {
    // console.log(Object.keys(rows[0]))
    Object.keys(rows[0]).forEach((head) => {
      // console.log('typeof rows[0].head',  rows[0][head])
      // if (typeof rows[0][head] != 'object')
      headCells.push({
        id: head,
        numeric: false,
        disablePadding: true,
        label: head,
      })
    })

  }
  // console.log('headCells',headCells)
  // headCells.push({
  //   id: 'actions',
  //   numeric: false,
  //   disablePadding: true,
  //   label: 'actions',
  //   edit: true,
  //   delete: true,
  //   pageBuilder: pageBuilder,
  // })
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.forEach((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // const handleClick = (event, name) => {
  //   const selectedIndex = selected.indexOf(name);
  //   let newSelected = [];
  //
  //   if (selectedIndex === -1) {
  //     newSelected = newSelected.concat(selected, name);
  //   } else if (selectedIndex === 0) {
  //     newSelected = newSelected.concat(selected.slice(1));
  //   } else if (selectedIndex === selected.length - 1) {
  //     newSelected = newSelected.concat(selected.slice(0, -1));
  //   } else if (selectedIndex > 0) {
  //     newSelected = newSelected.concat(
  //       selected.slice(0, selectedIndex),
  //       selected.slice(selectedIndex + 1),
  //     );
  //   }
  //
  //   setSelected(newSelected);
  // };

  const handleChangePage = (event, newPage, {renewData, rowsPerPage}) => {
    // console.log('event',event)
    // console.log('newPage',newPage)
    // console.log('renewData',renewData)
    renewData(newPage * rowsPerPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, count - page * rowsPerPage);
  console.log('rows', stableSort(rows, getComparator(order, orderBy)))
  // return JSON.stringify(stableSort(rows, getComparator(order, orderBy)))
  if(!count){
    count=rows.length
  }
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <div className={'extra-menu-top ltr mb-3'}>
          <Link to={'/admin/' + model + '/create/'}><Button className={'circle'}><AddCircleOutlineIcon/></Button></Link>
        </div>
        {rows && count > 0 && (
          <EnhancedTableToolbar numSelected={selected.length}/>
        )}
        {rows && count > 0 && (
          <TableContainer>
            <Table className={classes.table} size="small">
              <EnhancedTableHead
                headCells={headCells}
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                t={t}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={count || 0}
              />
              <TableBody>
                {/*.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)*/}

                {rows && stableSort(rows, getComparator(order, orderBy))
                  .map((row, idx) => {
                    console.log('row is:', row);
                    const isItemSelected = isSelected(row.name);
                    // const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        // onClick={event => handleClick(event, row._id)}
                        role="checkbox"
                        tabIndex={-1}
                        key={idx}
                        selected={isItemSelected}>
                        {/*<TableCell padding="checkbox">*/}
                        {/*<Checkbox*/}
                        {/*checked={isItemSelected}*/}
                        {/*inputProps={{ 'aria-labelledby': labelId }}*/}
                        {/*/>*/}
                        {/*</TableCell>*/}
                        {headCells.map((HC, index) => {
                          console.log('typeof row[HC.id]',HC.id,typeof row[HC.id])

                          if (HC.type === 'object') {
                            if(typeof row[HC.id]=='string'){
                              return JSON.stringify(row[HC.id])
                            }
                            return (
                              <TableCell
                                component="td"
                                key={index}
                                scope="row"
                                padding="none">
                                {(HC.keys && row[HC.id]) && HC.keys.map((key) => {
                                  return <div>{row[HC.id][key]}</div>;
                                })}
                                {(!HC.keys && row[HC.id] && (typeof row[HC.id] == 'object' && !(row[HC.id] instanceof Array))) && Object.keys(row[HC.id]).map((key) => {
                                  return <div>{JSON.stringify(row[HC.id][key])}</div>;
                                })}
                                {(!HC.keys && row[HC.id] && (typeof row[HC.id] == 'object' && (row[HC.id] instanceof Array))) && row[HC.id].map((key) => {
                                  return <div>{(key && key.slug) ? key.slug : ''}</div>;
                                })}
                                {/*{JSON.stringify(row[HC.id])}*/}
                              </TableCell>
                            );
                          } else if (HC.type === 'multiLang') {
                            return (
                              <TableCell
                                component="td"
                                key={index}
                                scope="row"
                                padding="none">
                                {row[HC.id] && JSON.stringify(row[HC.id][lan])}
                              </TableCell>
                            );
                          } else if (HC.type === 'image') {
                            return (
                              <TableCell
                                component="td"
                                key={index}
                                scope="row"
                                padding="none">
                                {row[HC.id] && <img src={MainUrl + '/' + row[HC.id]}/>}
                              </TableCell>
                            );
                          } else if (HC.type === 'boolean') {
                            return (
                              <TableCell
                                component="td"
                                key={index}
                                scope="row"
                                padding="none">
                                {row[HC.id] && <Check/>}
                                {!row[HC.id] && <Close/>}
                              </TableCell>
                            );
                          } else if (HC.type === 'date') {
                            return (
                              <TableCell
                                component="td"
                                key={index}
                                scope="row"
                                padding="none">
                                {dateFormat(row[HC.id])}
                              </TableCell>
                            );
                          } else if (HC.type === 'actions') {

                            return (
                              <TableCell
                                component="td"
                                key={index}
                                scope="row"
                                padding="none">
                                {HC.edit ? (
                                  <Link
                                    outline
                                    className={'btn btn-primary btn-sm'}
                                    theme="info"
                                    size="sm"
                                    to={'/admin/' + model + '/edit/' + row['_id']}>
                                    {HC.button_text || t('edit')}
                                  </Link>
                                ) : null}
                                {HC.delete ? (
                                  <Link
                                    outline
                                    theme="danger"
                                    className={'btn btn-primary ml-2 mr-2 btn-outline-danger btn-sm'}
                                    size="sm"
                                    to={'/admin/' + model + '/delete/' + row['_id']}
                                  >
                                    {t('delete')}
                                  </Link>
                                ) : null}
                                {HC.pageBuilder ? (
                                  <Link
                                    outline
                                    theme="danger"
                                    size="sm"
                                    className={'btn btn-primary ml-2 mr-2 btn-outline-warning btn-sm'}

                                    to={'/admin/' + model + '/edit-page/' + row['_id']}
                                  >

                                    {t('edit with page builder')}
                                  </Link>
                                ) : null}
                                {actions && actions(row['_id'])}
                              </TableCell>
                            );
                          } else if (HC.type === 'string') {

                            return (
                              <TableCell
                                component="td"
                                key={index}
                                scope="row"
                                padding="none">
                                <div className={row[HC.id + '_cl']}>
                                  {JSON.stringify(row[HC.id])}
                                </div>
                              </TableCell>
                            );
                          } else if (HC.type === 'number') {
                            return (
                              <TableCell
                                component="td"
                                key={index}
                                scope="row"
                                padding="none">
                                <div className={row[HC.id + '_cl']}>
                                  {JSON.stringify(row[HC.id])}
                                </div>
                              </TableCell>
                            );
                          } else if (HC.type === 'price') {
                            return (
                              <TableCell
                                component="td"
                                key={index}
                                scope="row"
                                padding="none">
                                <div className={row[HC.id + '_cl']}>
                                  {JSON.stringify(PriceFormat(row[HC.id]))}
                                </div>
                              </TableCell>
                            );
                          } else {
                            return (
                              <TableCell
                                component="td"
                                key={index}
                                scope="row"
                                padding="none">
                                <div className={row[HC.id + '_cl']}>
                                  {JSON.stringify(row[HC.id])}
                                </div>
                              </TableCell>
                            );
                          }
                        })}
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow style={{height: 33 * emptyRows}}>
                    <TableCell colSpan={6}/>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        {rows && count > 0 && (
          <TablePagination
            rowsPerPageOptions={[10, 20, 50, 100]}
            component="div"
            count={parseInt(count)}
            rowsPerPage={rowsPerPage}
            page={page}
            labelRowsPerPage={t('number per row:')}
            nexticonbuttontext={t('next page')}
            previousiconbuttontext={t('previous page')}
            labelDisplayedRows={({from, to, count}) =>
              `${from} ${t('to')} ${to === -1 ? count : to} ${t(
                'from'
              )} ${count} ${t('item')}`
            }
            onPageChange={(e, newPage) => handleChangePage(e, newPage, {renewData, rowsPerPage})}
            // onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        )}
        {rows && !count && (
          <Alert className="mb-0 p-4">
            <Row>
              <Col lg="8" md="6" sm="12" className={'cebter'}>
                {t(newText)}
              </Col>
              <Col lg="4" md="6" sm="12">
                {buttonLink && <Link
                  outline
                  className="mr-1 text-white font-weight-bold fffs inMobileButton"

                  theme="info"
                  size="sm"
                  to={buttonLink}>
                  {t(buttonText)}
                </Link>}

              </Col>
            </Row>
          </Alert>
        )}
      </Paper>
    </div>
  );
}

export default withTranslation()(DataTable);
