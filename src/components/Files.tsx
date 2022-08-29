import { useCallback, useEffect, useMemo, useState } from 'react';
import { DropzoneRootProps, useDropzone } from 'react-dropzone';
import { Icon, SemanticICONS } from 'semantic-ui-react';

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

const Files = () => {

  const [files, setFiles] = useState<Array<FileForDropZone>>([]);

  const onDrop = useCallback((acceptedFiles: Array<FileForDropZone>) => {
    setFiles(acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    })));
    console.log(acceptedFiles);
  }, []);

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

  const thumbs = files.map(file => {

    let extend:string | undefined = file.name.split('.').pop();
    let fileClass:SemanticICONS ;

    if(extend === "xlsx" || extend === "xls"){
      fileClass = 'file excel outline';
    }else if(extend === "pptx" || extend === "ppt"){
      fileClass = 'file powerpoint outline';
    }else{
      fileClass = 'file outline';
    }

    return (
    <div key={file.name}>

      <Icon name={fileClass} >{file.name}</Icon>
      
    </div>
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
        {thumbs}
      </aside>
    </section>
    </div>
  )
};

export default Files