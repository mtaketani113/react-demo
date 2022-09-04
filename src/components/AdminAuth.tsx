import { ReactNode } from 'react'

type Props = {children:ReactNode};
const AdminAuth = (props:Props) => {

  //TODO 権限判定を追加
  const authorized:boolean = true;

  return(
    <>
      {authorized  ? props.children : ""}
    </>
  )
}

export default AdminAuth