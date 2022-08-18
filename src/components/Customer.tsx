import {useEffect, useState} from 'react';
import { Table, Button, Header, Image, Modal, Form, Icon } from 'semantic-ui-react'

import {
	Container,
  } from 'semantic-ui-react'

const Customer = () => {
	
	const [customers, setCustomers] = useState<any>(null);
	const [open, setOpen] = useState<boolean>(false);
	
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

	const addCustomer = () => {
        let endpoint = PRONET_CONTEXT_ENDPOINT + "api/customer/new";
		let name = document.querySelector<HTMLInputElement>("#customer_name")!.value;
		let post = document.querySelector<HTMLInputElement>("#customer_post")!.value;
		let address = document.querySelector<HTMLInputElement>("#customer_address")!.value;
		fetch(endpoint, {cache:"no-cache", method:"PUT",
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			},
			body : JSON.stringify({name : name, post: post, address: address})})
		.then( (response)=>{
			loadCustomers()} )
		.catch((reason)=>{
			console.log(reason);
		}).finally(()=>{
			setOpen(false);
		});
	};

	const deleteCustomer = (id: string) => {
		if(window.confirm("削除しますか？")){
			let endpoint = PRONET_CONTEXT_ENDPOINT + "api/customer/delete/" + id;
			fetch(endpoint, {cache:"no-cache", method:"DELETE"})
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
				<Table.Cell>
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
							<Table.HeaderCell>名前</Table.HeaderCell>
							<Table.HeaderCell>郵便番号</Table.HeaderCell>
							<Table.HeaderCell>住所</Table.HeaderCell>
							<Table.HeaderCell></Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{rows}
					</Table.Body>
				</Table>
	<Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button circular icon='plus'></Button>}
    >
      <Modal.Header>顧客登録</Modal.Header>
      <Modal.Content image>
        <Image size='medium' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' wrapped />
        <Modal.Description>
          <Header>登録情報</Header>
		  <Form>
			<Form.Field>
				<label>名前</label>
				<input id="customer_name" placeholder='名前' />
			</Form.Field>
			<Form.Field>
				<label>郵便番号</label>
				<input id="customer_post" placeholder='郵便番号' />
			</Form.Field>
			<Form.Field>
				<label>住所</label>
				<input id="customer_address" placeholder='住所' />
			</Form.Field>
		  </Form>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => setOpen(false)}>
          閉じる
        </Button>
        <Button
          content="登録"
          labelPosition='right'
          icon='checkmark'
          onClick={() => addCustomer()}
          positive
        />
      </Modal.Actions>
    </Modal>
			</Container>
		);
	}
}
export default Customer;