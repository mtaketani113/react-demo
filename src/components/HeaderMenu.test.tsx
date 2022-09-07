import { cleanup, render, screen } from '@testing-library/react';
import HeaderMenu from './HeaderMenu';
import axios, { AxiosInstance } from 'axios';
import userEvent from '@testing-library/user-event';
import i18n from "../i18n/configs"
import { I18nextProvider } from 'react-i18next'
jest.mock('axios');

describe('HeaderMenu', () => {

	beforeEach(() => {
		const myAxios: jest.Mocked<AxiosInstance> = axios as any;
		myAxios.get.mockResolvedValue({
			data: { name: 'name',
			picture: "picture"},
		});
	})
	afterEach(cleanup);
	it('should render HeaderMenu', async () => {
    	render(
			<I18nextProvider i18n={i18n}> 
				<HeaderMenu accessToken="testToken"/>
			</I18nextProvider>
		);
		const homeButton = await screen.findByText('ホーム');
		expect(homeButton).toBeInTheDocument();
		const userName = await screen.findByText('name');
		expect(userName).toBeInTheDocument();
	});

	it('should change English', async () => {
    	render(
			<I18nextProvider i18n={i18n}> 
				<HeaderMenu accessToken="testToken"/>
			</I18nextProvider>
		);
		const englishButton = await screen.findByText('英語');
		userEvent.click(englishButton);
		const customerButtonEn = await screen.findByText('Customer');
		expect(customerButtonEn).toBeInTheDocument();
		const japaneseButton = await screen.findByText('Japanese');
		userEvent.click(japaneseButton);
		const mapButtonJa = await screen.findByText('マップ');
		expect(mapButtonJa).toBeInTheDocument();
		const customerButtonJa = await screen.findByText('顧客一覧');
		expect(customerButtonJa).toBeInTheDocument();
	});
});