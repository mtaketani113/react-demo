import { useEffect, useState } from 'react';
import { Container, Table, Form, Icon, Pagination } from 'semantic-ui-react';
import { ModalCustomerRegister } from './index';
import { useTranslation } from 'react-i18next';
import { CustomerEntity } from './entity/CustomerEntity';
import axios from 'axios';

const Customer = () => {
  const { t } = useTranslation();

  const [customers, setCustomers] = useState<Array<CustomerEntity> | null>(null);
  const [allCustomers, setAllCustomers] = useState<Array<CustomerEntity> | null>(null);
  const [pageNum, setPageNum] = useState(1);

  const CONTEXT_ENDPOINT = 'http://localhost:8080/demo/';

  const loadCustomers = (page: number) => {
    let endpoint = CONTEXT_ENDPOINT + 'api/customer';
    axios.get(endpoint).then((res) => {
      setAllCustomers(res.data);
      if (res.data != null) {
        let start = (page - 1) * 5;
        let end = Math.min(page * 5, res.data.length);
        setCustomers(res.data.slice(start, end));
      }
    });
  };

  const deleteCustomer = (id: string) => {
    if (window.confirm(t('customer.delete_messaeg'))) {
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
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>{t('customer.name')}</Table.HeaderCell>
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
