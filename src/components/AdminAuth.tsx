
const AdminAuth = (props:any) => {

  //TODO 権限判定を追加
  const authorized:boolean = true;

  return(
    <>
      {authorized  ? props.children : ""}
    </>
  )
}

export default AdminAuth