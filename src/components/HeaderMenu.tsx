import { Container, Dropdown, Image, Menu } from 'semantic-ui-react';
import { useEffect, useState } from 'react';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { UserEntity } from './entity/UserEntity';
import axios from 'axios';

type Props = { accessToken: string };
const HeaderMenu = ({ accessToken }: Props) => {
  const { t } = useTranslation();

  const [user, setUser] = useState<UserEntity | null>(null);

  const translate = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const CONTEXT_ENDPOINT =
    process.env.REACT_APP_BACKGROUND_URL == null
      ? 'http://localhost:8080/demo/'
      : process.env.REACT_APP_BACKGROUND_URL;

  const loadUser = async () => {
    let endpoint = CONTEXT_ENDPOINT + 'api/user?accessToken=' + accessToken;
    axios.get(endpoint).then((res) => {
      setUser(res.data);
    });
  };

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Menu fixed="top" inverted>
      <Container>
        <Menu.Item as="a" header>
          <Image size="mini" src="/logo192.png" style={{ marginRight: '1.5em' }} />
          {t('header.menu.title')}
        </Menu.Item>
        <Menu.Item as="a" href="/">
          {t('header.menu.home')}
        </Menu.Item>
        <Menu.Item as="a" href="/customer">
          {t('header.menu.customer')}
        </Menu.Item>
        <Menu.Item as="a" href="/map">
          {t('header.menu.map')}
        </Menu.Item>
        <Menu.Item as="a" href="/files">
          {t('header.menu.file')}
        </Menu.Item>

        <Menu.Menu position="right">
          <Dropdown item simple text={t('header.language')}>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => translate('ja')}>{t('header.ja')}</Dropdown.Item>
              <Dropdown.Item onClick={() => translate('en')}>{t('header.en')}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
        <Menu.Item as="a" href="/">
          <Image src={user == null ? '' : user.picture} avatar />
          {user == null ? '' : user.name}
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default HeaderMenu;
