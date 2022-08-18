import {useEffect, useState} from 'react';
import { Table } from 'semantic-ui-react'

import {
	Container,
  } from 'semantic-ui-react'

const Customer = () => {
	
	const [customers, setCustomers] = useState<any>(null);
	
	const PRONET_CONTEXT_ENDPOINT = "http://localhost:8080/demo/";

	const loadCustomers = () => {
        let endpoint = PRONET_CONTEXT_ENDPOINT + "api/customer";
		fetch(endpoint, {cache:"no-cache", mode: 'cors', method:"GET"})
		.then( (response)=>{
			return response.json()} )
		.then( (json)=>{
			setCustomers(json);
		}).catch((reason)=>{
			console.log(reason);
		});
	};

    useEffect(() => {
        loadCustomers();
    }, []);

	if( customers == null ) {
		return (<article>ロード中</article>);
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
			</Table.Row>);
		}
        
		return (
			<Container text style={{ marginTop: '7em' }}>
				<Table celled>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>ID</Table.HeaderCell>
							<Table.HeaderCell>名前</Table.HeaderCell>
							<Table.HeaderCell>郵便番号</Table.HeaderCell>
							<Table.HeaderCell>住所</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{rows}
					</Table.Body>
				</Table>
			</Container>
		);
	}
}
export default Customer;