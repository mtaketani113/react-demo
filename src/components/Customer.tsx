import {useEffect, useState} from 'react';

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
			rows.push(<tr key={customer.id}>
				<td>{customer.id}</td>
				<td>{customer.name}</td>
				<td>{customer.post}</td>
				<td>{customer.address}</td>
			</tr>);
		}
        
		return (
			<article>
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>名前</th>
							<th>郵便番号</th>
							<th>住所</th>
						</tr>
					</thead>
					<tbody>
						{rows}
					</tbody>
				</table>
			</article>
		);
	}
}
export default Customer;