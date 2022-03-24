import { useState, useEffect } from 'react';

// components
import Lk from "./Lk";
import API from "../utils/API";

const LkAuth = (props) => {
	// preloader
	const [access, setAccess] = useState(<div className="container__info">
	  <div className="item-1"><div></div></div>
	  <div className="item-2"><div></div></div>
	  <div className="item-3"><div></div></div>
	  <div className="item-4"><div></div></div>
	  <div className="item-5"><div></div></div>
	  <div className="item-6"><div></div></div>
	  <div className="item-7"><div></div></div>
	  <div className="item-8"><div></div></div>
	  <div className="item-9"><div></div></div>
	</div>);

	const getRole = async () => {
    let userData = await API.get('/get-role');
    return await userData.data;
  };

	useEffect(() => {
		getRole().then((result) => {
			if (result.role == 'user') setAccess(<Lk />);
			else if (result.role == 'user-offline') setAccess(<Lk />);
		  	else setAccess(<div className="container__info SomethingWentWrong"><h2>У вас недостаточно прав</h2></div>);
		}, 
		(error) => {
			console.log(error);
		  setAccess(<div className="container__info SomethingWentWrong"><h2>Что-то пошло не так</h2></div>);
		})
	}, [])

	return (
		<>{ access }</>
	)
}

export default LkAuth;