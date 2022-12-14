import { Container, Dropdown, Image, Menu } from 'semantic-ui-react';
import { useEffect, useState } from 'react';
import i18n from 'i18next';
import { useTranslation } from 'react-i18next';
import { UserEntity } from './entity/UserEntity';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { CONTEXT_ENDPOINT } from './Constants';

type Props = { accessToken: string };
const HeaderMenu = ({ accessToken }: Props) => {
  const [cookies, setCookie] = useCookies(['lang']); // 日英切替のCookie情報。初期表示時に利用

  const { t } = useTranslation();

  const [user, setUser] = useState<UserEntity | null>(null);

  const maxAge: number = 60 * 60 * 24 * 1;

  /**
   * 日英切り替え時
   *
   * @param lang 表示する言語（ja:日本語 en:英語）
   */
  const translate = (lang: string) => {
    i18n.changeLanguage(lang);
    setCookie('lang', lang, { maxAge: maxAge });
  };

  const loadUser = async () => {
    let endpoint = CONTEXT_ENDPOINT + 'api/user?accessToken=' + accessToken;
    axios.get(endpoint).then((res) => {
      setUser(res.data);
    });
  };

  useEffect(() => {
    loadUser();
    if (cookies.lang != null) {
      i18n.changeLanguage(cookies.lang);
    }
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
        <Menu.Item as="a" href="/graph">
          {t('header.menu.graph')}
        </Menu.Item>
        <Menu.Item as="a" href="/calendar">
          カレンダー
        </Menu.Item>

        <Menu.Menu position="right">
          <Dropdown item simple text={t('header.language')}>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => translate('ja')}>{t('header.ja')}</Dropdown.Item>
              {/* 日本語切替 */}
              <Dropdown.Item onClick={() => translate('en')}>{t('header.en')}</Dropdown.Item>
              {/* 英語切替 */}
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
