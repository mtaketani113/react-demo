import {
  Container,
  Dropdown,
  Image,
  Menu,
} from 'semantic-ui-react'
import {useEffect, useState} from 'react';
import i18n from "i18next";
import { useTranslation } from "react-i18next";

type Props = {accessToken:string};
const HeaderMenu = ({accessToken}:Props) => {

	const { t } = useTranslation();

  const [user, setUser] = useState<any>(null);

  const translate = (lang :string) => {
		i18n.changeLanguage(lang);
	}

  const CONTEXT_ENDPOINT = "http://localhost:8080/demo/";

  const loadUser = () => {
    let endpoint = CONTEXT_ENDPOINT + "api/user?accessToken=" + accessToken;
    fetch(endpoint, {cache:"no-cache", mode: 'cors', method:"GET",
      headers: {
        Authorization: `Bearer ${accessToken}`
      }})
      .then( (response)=>{
        return response.json()} )
      .then( (json)=>{
        setUser(json);
      }).catch((reason)=>{
        console.log(reason);
      });
    };

  useEffect(() => {
    loadUser();
  }, []);

  return(
    <Menu fixed='top' inverted>
      <Container>
        <Menu.Item as='a' header>
          <Image size='mini' src='/logo192.png' style={{ marginRight: '1.5em' }} />
          {t("header.menu.title")}
        </Menu.Item>
        <Menu.Item as='a' href='/'>{t("header.menu.home")}</Menu.Item>

        <Menu.Item as='a' href='/customer'>{t("header.menu.customer")}</Menu.Item>

        <Menu.Menu position='right'>
        <Dropdown item simple text={t("header.language")}>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => translate('ja')}>{t("header.ja")}</Dropdown.Item>
            <Dropdown.Item onClick={() => translate('en')}>{t("header.en")}</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        </Menu.Menu>
        <Menu.Item as='a' href='/'>{user == null? "": user.name}</Menu.Item>
      </Container>
    </Menu>
  )
}

export default HeaderMenu