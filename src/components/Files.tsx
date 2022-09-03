import { useCallback, useEffect, useMemo, useState } from 'react';
import { DropzoneRootProps, useDropzone } from 'react-dropzone';
import { Icon, SemanticICONS, List } from 'semantic-ui-react';

const baseStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  transition: 'border .3s ease-in-out'
};

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#00e676'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

interface FileForDropZone extends File{
  preview?: string;
}

interface IFile{
  id: string,
  fileName: string

}

const Files = () => {

  const [files, setFiles] = useState<Array<FileForDropZone>>([]);
  const [fileList, setFileList] = useState<Array<IFile>>([]);
  const CONTEXT_ENDPOINT = "http://localhost:8080/demo/";
  const onDrop = useCallback((acceptedFiles: Array<FileForDropZone>) => {
    console.log(acceptedFiles);
    let endpoint = CONTEXT_ENDPOINT + "api/file";

    acceptedFiles.forEach((file) =>{
      let formData = new FormData();
      formData.append('fileDatas', file);
      fetch(endpoint, {cache:"no-cache", mode: 'cors', method:"POST", body : formData}).then(response => {
        setFiles(acceptedFiles.map(file => Object.assign(file, {
          preview: URL.createObjectURL(file)
        })));
        loadfileList();
      });
    });
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadfileList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadfileList = ()=>{
    let endpoint = CONTEXT_ENDPOINT + "api/file";
    fetch(endpoint, {cache:"no-cache", mode: 'cors', method:"GET"}).then((response)=>{ return response.json(); })
    .then((json: any) =>{
      setFileList(json);
    })
  }

  const deleteFile = (id: string) => {
		if(window.confirm("削除しますか?")){
			let endpoint = CONTEXT_ENDPOINT + "api/file/delete/" + id;
			fetch(endpoint, {cache:"no-cache", method:"DELETE"})
			.then( (response)=>{
				loadfileList()} )
			.catch((reason)=>{
				console.log(reason);
      })
		}else{

		}
	};

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    onDrop,
  });

  const style:DropzoneRootProps = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragReject,
    isDragAccept
  ]);

  const thumbs = fileList.map((file: IFile) => {

    let extend:string | undefined = file.fileName.split('.').pop();
    let fileClass:SemanticICONS ;

    if(extend === "xlsx" || extend === "xls"){
      fileClass = 'file excel outline';
    }else if(extend === "pptx" || extend === "ppt"){
      fileClass = 'file powerpoint outline';
    }else{
      fileClass = 'file outline';
    }

    let url = "http://localhost:8080/demo/api/file/" + file.id;
    return (
    <List.Item>
      <div>
        <a href={url}>
          <Icon name={fileClass} />{file.fileName}
        </a>
        <Icon link name='trash alternate outline' onClick={() => deleteFile(file.id)} />
      </div>
    </List.Item>
  )});

  // clean up
  useEffect(() => () => {
    files.forEach(file => URL.revokeObjectURL(file.preview != null ? file.preview: ""));
  }, [files]);

  return (
    <div style={{ marginTop: '7em' }}>
    <section>
      <div {...getRootProps({style})}>
        <input {...getInputProps()} />
        <div>Drag and drop your images here.</div>
      </div>
      <aside>
        <List>
        {thumbs}
        </List>
      </aside>
    </section>
    </div>
  )
};

export default Files