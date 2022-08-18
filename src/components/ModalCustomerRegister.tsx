import {useState} from 'react';
import { Button, Header, Image, Modal, Form } from 'semantic-ui-react'

type Props = { loadCustomers:() => void, customer:any};
const ModalCustomerRegister = ({loadCustomers, customer}: Props) => {

	const [open, setOpen] = useState<boolean>(false);
	
	const PRONET_CONTEXT_ENDPOINT = "http://localhost:8080/demo/";

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

	const updateCustomer = (updateId:string) => {
        let endpoint = PRONET_CONTEXT_ENDPOINT + "api/customer/update";
		let name = document.querySelector<HTMLInputElement>("#customer_name")!.value;
		let post = document.querySelector<HTMLInputElement>("#customer_post")!.value;
		let address = document.querySelector<HTMLInputElement>("#customer_address")!.value;
		fetch(endpoint, {cache:"no-cache", method:"POST",
			headers: {
				'Content-Type': 'application/json; charset=utf-8'
			},
			body : JSON.stringify({id : updateId, name : name, post: post, address: address})})
		.then( (response)=>{
			loadCustomers()} )
		.catch((reason)=>{
			console.log(reason);
		}).finally(()=>{
			setOpen(false);
		});
	};

	const register = () =>{
		if(customer == null || customer.id == null || customer.id === ''){
			addCustomer();
		}else{
			updateCustomer(customer.id);
		}
	}

	let buttonName:string;
	let title:string;
	let customerName:any;
	let customerPost:any;
	let customerAddress:any;

	if(customer == null || customer.id == null || customer.id === ''){
		title = '顧客登録';
		buttonName = '追加';
	}else{
		title = '顧客更新';
		buttonName = '変更';
		customerName = customer.name;
		customerPost = customer.post;
		customerAddress = customer.address;
	}
       
	return (
			
	<Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button circular>{buttonName}</Button>}
    >
      <Modal.Header>{title}</Modal.Header>
      <Modal.Content image>
        <Image size='medium' src='https://react.semantic-ui.com/images/avatar/large/rachel.png' wrapped />
        <Modal.Description>
          <Header>登録情報</Header>
		  <Form>
			<Form.Field>
				<label>名前</label>
				<input id="customer_name" placeholder='名前' defaultValue={customerName}/>
			</Form.Field>
			<Form.Field>
				<label>郵便番号</label>
				<input id="customer_post" placeholder='郵便番号' defaultValue={customerPost}/>
			</Form.Field>
			<Form.Field>
				<label>住所</label>
				<input id="customer_address" placeholder='住所' defaultValue={customerAddress}/>
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
          onClick={() => register()}
          positive
        />
      </Modal.Actions>
    </Modal>

		);
}
export default ModalCustomerRegister;