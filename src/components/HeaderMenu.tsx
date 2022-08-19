import {
  Container,
  Dropdown,
  Image,
  Menu,
} from 'semantic-ui-react'
import i18n from "i18next";
import { useTranslation } from "react-i18next";

const HeaderMenu = () => {

	const { t } = useTranslation();

  const translate = (lang :string) => {
		i18n.changeLanguage(lang);
	}

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
      </Container>
    </Menu>
  )
}

export default HeaderMenu