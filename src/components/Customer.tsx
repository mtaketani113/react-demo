import { useEffect, useReducer, useState } from 'react';
import { Container, Table, Form, Icon, Pagination } from 'semantic-ui-react';
import { ModalCustomerRegister } from './index';
import { useTranslation } from 'react-i18next';
import { CustomerEntity } from './entity/CustomerEntity';
import axios from 'axios';
import _ from 'lodash'

const Customer = () => {

  type STATE = {column:any,  allCustomers:Array<CustomerEntity>, customers:Array<CustomerEntity>, direction:any};

  const { t } = useTranslation();

  const [customers, setCustomers] = useState<Array<CustomerEntity> | null>(null);
  // const [allCustomers, setAllCustomers] = useState<Array<CustomerEntity> | null>(null);
  const [pageNum, setPageNum] = useState(1);

  const tableReducer = (state:any, action:any) => {
    switch (action.type) {
      case 'LOAD':

        return {
          ...state,
          allCustomers: action.payload,
        }
      case 'CHANGE_SORT':
        if (state.column === action.column) {
          let start = (pageNum - 1) * 5;
          let end = Math.min(pageNum * 5, state.allCustomers.length);
          setCustomers(state.allCustomers.slice().reverse().slice(start, end));
          return {
            ...state,
            allCustomers: state.allCustomers.slice().reverse(),
            direction:
              state.direction === 'ascending' ? 'descending' : 'ascending',
          }
        }
  
        let start = (pageNum - 1) * 5;
        let end = Math.min(pageNum * 5, state.allCustomers.length);
        setCustomers(_.sortBy(state.allCustomers, [action.column]).slice(start, end));
        return {
          column: action.column,
          allCustomers: _.sortBy(state.allCustomers, [action.column]),
          direction: 'ascending',
        }
      default:
        throw new Error()
    }
  }

  const [state, dispatch] = useReducer(tableReducer, {
    column: null,
    allCustomers: null,
    direction: null,
  })

  const { column, allCustomers, direction }:STATE = state
  
  const CONTEXT_ENDPOINT =
    process.env.REACT_APP_BACKGROUND_URL == null
      ? 'http://localhost:8080/demo/'
      : process.env.REACT_APP_BACKGROUND_URL;
  // 顧客一覧を取得
  const loadCustomers = (page: number) => {
    let endpoint = CONTEXT_ENDPOINT + 'api/customer';
    axios.get(endpoint).then((res) => {
      // setAllCustomers(res.data);
      dispatch({ type: 'LOAD', payload: res.data });
      if (res.data != null) {
        let start = (page - 1) * 5;
        let end = Math.min(page * 5, res.data.length);
        setCustomers(res.data.slice(start, end));
      }
    });
  };

  //　IDをキーに顧客を削除
  const deleteCustomer = (id: number) => {
    if (window.confirm(t('message.confirm.delete'))) {
      let endpoint = CONTEXT_ENDPOINT + 'api/customer/delete/' + id;
      fetch(endpoint, { cache: 'no-cache', method: 'DELETE' })
        .then((response) => {
          loadCustomers(pageNum);
        })
        .catch((reason) => {
          console.log(reason);
        });
    } else {
    }
  };

  // ページングの処理
  const pagingCustomers = (e: any, data: any) => {
    if (allCustomers != null) {
      let start = (data.activePage - 1) * 5;
      let end = Math.min(data.activePage * 5, allCustomers.length);
      setCustomers(allCustomers.slice(start, end));
      setPageNum(data.activePage);
    }
  };

  useEffect(() => {
    loadCustomers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (customers == null || allCustomers == null) {
    return <Form loading></Form>;
  } else {
    const rows = [];
    for (var i = 0; i < customers.length; i++) {
      let customer = customers[i];
      rows.push(
        <Table.Row key={customer.id}>
          <Table.Cell>{customer.id}</Table.Cell>
          <Table.Cell>{customer.name}</Table.Cell>
          <Table.Cell>{customer.post}</Table.Cell>
          <Table.Cell>{customer.address}</Table.Cell>
          <Table.Cell textAlign="center">
            <ModalCustomerRegister
              loadCustomers={() => loadCustomers(pageNum)}
              customer={customer}
              pageNum={pageNum}
            />
          </Table.Cell>
          <Table.Cell textAlign="center">
            <Icon link name="trash alternate outline" onClick={() => deleteCustomer(customer.id)} />
          </Table.Cell>
        </Table.Row>,
      );
    }

    return (
      <Container text style={{ marginTop: '7em' }}>
        <Pagination
          defaultActivePage={1}
          totalPages={Math.ceil(allCustomers.length / 5)}
          onPageChange={pagingCustomers}
        />
        <Table sortable celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'name' ? direction : null}
                onClick={() => {
                  dispatch({ type: 'CHANGE_SORT', column: 'name' });
                }}
              >{t('customer.name')}</Table.HeaderCell>
              <Table.HeaderCell>{t('customer.post')}</Table.HeaderCell>
              <Table.HeaderCell>{t('customer.address')}</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{rows}</Table.Body>
        </Table>
        <ModalCustomerRegister
          loadCustomers={() => loadCustomers(pageNum)}
          customer={null}
          pageNum={pageNum}
        />
      </Container>
    );
  }
};
export default Customer;
