import { cleanup, render, screen } from '@testing-library/react';
import Customer from './Customer';
import axios, { AxiosInstance } from 'axios';
import userEvent from '@testing-library/user-event';
import i18n from "../i18n/configs"
import { I18nextProvider } from 'react-i18next'
jest.mock('axios');

describe('Customer', () => {

	beforeEach(() => {
		const myAxios: jest.Mocked<AxiosInstance> = axios as any;
		myAxios.get.mockResolvedValue({
			data: [{ id: '1',
			name: "name",
			post: "post",
			address: "address"}],
		});
	})
	afterEach(cleanup);
	it('should render customers list', async () => {
    	render(
			<I18nextProvider i18n={i18n}> 
				<Customer />
			</I18nextProvider>
		);
    	const listElements = await screen.findAllByRole('cell');
    	expect(listElements[0]).toBeInTheDocument();
		const addButton = await screen.findByText('追加');
		expect(addButton).toBeInTheDocument();
	});

	it('should add customer', async () => {
		render(
			<I18nextProvider i18n={i18n}> 
				<Customer />
			</I18nextProvider>
		);
		const addButton = await screen.findByTestId('addButton');
		userEvent.click(addButton);
		const registerButton = await screen.findByText('登録');
		expect(registerButton).toBeInTheDocument();
	});
});