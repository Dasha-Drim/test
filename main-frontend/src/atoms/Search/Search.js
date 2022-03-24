import { useState } from 'react';

//graphics
import search from './icons/search.svg';

import './Search.scss';

function Search(props){
  let [inputValue, setInputValue] = useState();
  return(
    <div className="Search">
      <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} name={props.name} placeholder={props.placeholder} defaultValue={props.defaultValue} ref={props.refy}/>
      <button><img src={search}/></button>
    </div>
  )
}

export default Search;
