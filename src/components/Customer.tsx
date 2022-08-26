import {useEffect, useState} from 'react';
import { Container, Table, Form, Icon } from 'semantic-ui-react';
import {ModalCustomerRegister} from './index';
import { useTranslation } from "react-i18next";
import { CustomerEntity } from "./entity/CustomerEntity";
import axios from 'axios';

type Props = {accessToken:string};
const Customer = ({accessToken}:Props) => {
	
	const { t } = useTranslation();
	
	const [customers, setCustomers] = useState<Array<CustomerEntity> | null>(null);
	
	const CONTEXT_ENDPOINT = "http://localhost:8080/demo/";

	const loadCustomers = () => {
        let endpoint = CONTEXT_ENDPOINT + "api/customer";
		axios.get(endpoint, {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			}).then(res => {
            setCustomers(res.data)
        });
	};

	const deleteCustomer = (id: string) => {
		if(window.confirm(t("customer.delete_messaeg"))){
			let endpoint = CONTEXT_ENDPOINT + "api/customer/delete/" + id;
			fetch(endpoint, {cache:"no-cache", method:"DELETE",
			headers: {
				Authorization: `Bearer ${accessToken}`
			}})
			.then( (response)=>{
				loadCustomers()} )
			.catch((reason)=>{
				console.log(reason);
			})
	
		}else{

		}
	};

    useEffect(() => {
        loadCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

	if( customers == null ) {
		return (<Form loading></Form>);
	}
	else {
		const rows = [];
		for(var i = 0; i < customers.length; i++) {
			let customer = customers[i];
			rows.push(<Table.Row key={customer.id}>
				<Table.Cell>{customer.id}</Table.Cell>
				<Table.Cell>{customer.name}</Table.Cell>
				<Table.Cell>{customer.post}</Table.Cell>
				<Table.Cell>{customer.address}</Table.Cell>
				<Table.Cell textAlign='center'>
					<ModalCustomerRegister loadCustomers={() => loadCustomers()} customer={customer} accessToken={accessToken} />
				</Table.Cell>
				<Table.Cell textAlign='center'>
					<Icon link name='trash alternate outline' onClick={() => deleteCustomer(customer.id)} />
				</Table.Cell>
			</Table.Row>);
		}
        
		return (
			<Container text style={{ marginTop: '7em' }}>
				<Table celled>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>ID</Table.HeaderCell>
							<Table.HeaderCell>{t("customer.name")}</Table.HeaderCell>
							<Table.HeaderCell>{t("customer.post")}</Table.HeaderCell>
							<Table.HeaderCell>{t("customer.address")}</Table.HeaderCell>
							<Table.HeaderCell></Table.HeaderCell>
							<Table.HeaderCell></Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{rows}
					</Table.Body>
				</Table>
				<ModalCustomerRegister loadCustomers={() => loadCustomers()} customer={null} accessToken={accessToken} />
			</Container>
		);
	}
}
export default Customer;