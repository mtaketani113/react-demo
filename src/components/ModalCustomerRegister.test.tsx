import { cleanup, render, screen } from '@testing-library/react';
import Customer from './Customer';
import axios, { AxiosInstance } from 'axios';
import userEvent from '@testing-library/user-event';
import i18n from '../i18n/configs';
import { I18nextProvider } from 'react-i18next';
import ModalCustomerRegister from './ModalCustomerRegister';
jest.mock('axios');

jest.mock("react-i18next", () => ({
	...jest.requireActual("react-i18next"),
	useTranslation: () => {
	  return {
		t: (str: string) => str,
		i18n: {
		  language: "en",
		  addResourceBundle: () => jest.fn(),
		  changeLanguage: () => new Promise(() => {}),
		},
	  };
	},
  }));


describe('ModalCustomerRegister', () => {

  afterEach(cleanup);
  it('should render Modal', async () => {
    render(
     <ModalCustomerRegister loadCustomers={function (pageNum: number): void {
          throw new Error('Function not implemented.');
        } } customer={null} pageNum={0} />
    );
    const addButton = await screen.findByTestId('addButton');
    userEvent.click(addButton);
    const inputNameFiled = await screen.findByText('customer.name');
    expect(inputNameFiled).toBeInTheDocument();
    
  });

  it('should close Modal', async () => {
    render(
     <ModalCustomerRegister loadCustomers={function (pageNum: number): void {
          throw new Error('Function not implemented.');
        } } customer={null} pageNum={0} />
    );
    const addButton = await screen.findByTestId('addButton');
    userEvent.click(addButton);
    const closeButton = await screen.findByText('customer.close');
    userEvent.click(closeButton);
    const inputNameFiled = screen.queryByText('customer.name');
    expect(inputNameFiled).toBeNull();
    
  });

});
