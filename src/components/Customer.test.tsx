import { render, screen } from '@testing-library/react';
import Customer from './Customer';
import axios, { AxiosInstance } from 'axios';
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

describe('Customer', () => {
  it('should render customers list', async () => {

	const myAxios: jest.Mocked<AxiosInstance> = axios as any;
	myAxios.get.mockResolvedValue({
		data: [{ id: '1',
		 name: "name",
		 post: "post",
		 address: "address"}],
	  });
    render(<Customer />);
    const listElements = await screen.findAllByRole('cell');
    expect(listElements[0]).toBeInTheDocument();
  });
});