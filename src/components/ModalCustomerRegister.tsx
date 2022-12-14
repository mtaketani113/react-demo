import { useState } from 'react';
import {
  Button,
  Header,
  Image,
  Modal,
  Form,
  Segment,
  TransitionablePortal,
  Icon,
} from 'semantic-ui-react';

import { useTranslation } from 'react-i18next';
import { CustomerEntity } from './entity/CustomerEntity';

/**
 * 顧客追加、更新のモーダル画面
 */
type Props = {
  loadCustomers: (pageNum: number) => void;
  customer: CustomerEntity | null;
  pageNum: number;
};
const ModalCustomerRegister = ({ loadCustomers, customer, pageNum }: Props) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState<boolean>(false); // モーダル画面の表示、非表示のuseState Hook
  const [openComp, setOpenComp] = useState<boolean>(false); // 保存完了メッセージの表示、非表示のuseState Hook

  const CONTEXT_ENDPOINT = 'http://localhost:8080/demo/'; // バックエンドのEndPoint

  /**
   * 顧客追加のメソッド
   */
  const addCustomer = () => {
    let endpoint = CONTEXT_ENDPOINT + 'api/customer/new';
    let name = document.querySelector<HTMLInputElement>('#customer_name')!.value;
    let post = document.querySelector<HTMLInputElement>('#customer_post')!.value;
    let address = document.querySelector<HTMLInputElement>('#customer_address')!.value;
    fetch(endpoint, {
      cache: 'no-cache',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ name: name, post: post, address: address }),
    })
      .then((response) => {
        loadCustomers(pageNum);
        setOpenComp(true);
        setTimeout(() => {
          setOpenComp(false);
        }, 3000);
      })
      .catch((reason) => {
        console.log(reason);
      })
      .finally(() => {
        setOpen(false);
      });
  };

  /**
   * 顧客更新のメソッド
   */
  const updateCustomer = (updateId: number) => {
    let endpoint = CONTEXT_ENDPOINT + 'api/customer/update';
    let name = document.querySelector<HTMLInputElement>('#customer_name')!.value;
    let post = document.querySelector<HTMLInputElement>('#customer_post')!.value;
    let address = document.querySelector<HTMLInputElement>('#customer_address')!.value;
    fetch(endpoint, {
      cache: 'no-cache',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ id: updateId, name: name, post: post, address: address }),
    })
      .then((response) => {
        loadCustomers(pageNum);
        setOpenComp(true);
        setTimeout(() => {
          setOpenComp(false);
        }, 3000);
      })
      .catch((reason) => {
        console.log(reason);
      })
      .finally(() => {
        setOpen(false);
      });
  };

  const register = () => {
    if (customer == null || customer.id == null) {
      addCustomer();
    } else {
      updateCustomer(customer.id);
    }
  };

  let buttonName: string;
  let title: string;
  let customerName: any;
  let customerPost: any;
  let customerAddress: any;

  if (customer == null || customer.id == null) {
    // 顧客情報が渡ってこない場合は、新規追加とみなす。
    title = t('customer.add_title');
    buttonName = t('customer.add');
  } else {
    // 顧客情報が渡ってくる場合は、変更とみなす。
    title = t('customer.change_title');
    buttonName = t('customer.change');
    customerName = customer.name;
    customerPost = customer.post;
    customerAddress = customer.address;
  }

  return (
    <>
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={
          <Button circular data-testid={customer == null ? 'addButton' : 'changeButtons'}>
            {buttonName}
          </Button>
        }
      >
        <Modal.Header>{title}</Modal.Header>
        <Modal.Content image>
          <Image
            size="medium"
            src="https://react.semantic-ui.com/images/avatar/large/rachel.png"
            wrapped
          />
          <Modal.Description>
            <Header>{t('customer.info')}</Header>
            <Form>
              <Form.Field>
                <label>{t('customer.name')}</label>
                <input
                  id="customer_name"
                  placeholder={t('customer.name')}
                  defaultValue={customerName}
                />
              </Form.Field>
              <Form.Field>
                <label>{t('customer.post')}</label>
                <input
                  id="customer_post"
                  placeholder={t('customer.post')}
                  defaultValue={customerPost}
                />
              </Form.Field>
              <Form.Field>
                <label>{t('customer.address')}</label>
                <input
                  id="customer_address"
                  placeholder={t('customer.address')}
                  defaultValue={customerAddress}
                />
              </Form.Field>
            </Form>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={() => setOpen(false)}>
            {t('customer.close')}
          </Button>
          {/* モーダルを閉じるボタン */}
          <Button
            content={t('customer.register')}
            labelPosition="right"
            icon="checkmark"
            onClick={() => register()}
            positive
          />
          {/* 入力内容を登録するボタン */}
        </Modal.Actions>
      </Modal>
      {/*
        保存完了時のメッセージ表示部
      */}
      <TransitionablePortal open={openComp}>
        <Segment style={{ left: '40%', position: 'fixed', top: '10%', zIndex: 1000 }}>
          <p>
            <Icon color="green" name="check circle" />
            {t('message.save')}
          </p>
        </Segment>
      </TransitionablePortal>
    </>
  );
};
export default ModalCustomerRegister;
