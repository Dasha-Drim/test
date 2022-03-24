import { useState, useEffect } from "react";

// graphic
import upload from './icons/upload.svg';
import magnifier from './icons/magnifier.svg';

import './Upload.scss';


function Upload(props){
  const [fileName, setFileName] = useState(props.fileName);

  useEffect(() => {
    setFileName(props.fileName);
  }, [props.passportPhotoLink])
  
  let error = ( props.errors !== undefined && props.errors[props.name] ) ? 'no-valid' : '';
  return(
    <div className={`Upload ${error} ${(props.passportPhotoLink && fileName === "Выберите файл...") ? 'photoReadyToView' : ''}`}>
      <label htmlFor="scan">{props.label}</label>
      <a target="_blank" href={props.passportPhotoLink} className={props.passportPhotoLink && fileName === "Выберите файл..." ? 'viewPhoto' : 'display-none'}>
        <img src={magnifier} />
      </a>
      <label className="input-file label-wrapper">
        <div>
          <span className={props.passportPhotoLink && fileName === "Выберите файл..." ? 'display-none' : ''}>{fileName}</span>
          <img src={upload}/>
        </div>
        <input ref={props.refy} className="display-none" type="file" id={props.name} name={props.name} onChange={(e) => {setFileName(e.target.files[0] ? e.target.files[0].name : props.fileName)}} />
      </label>
    </div>
  )
}

export default Upload;
