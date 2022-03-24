import { Link, BrowserRouter, useHistory as Router, Route, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';

// components
import Modal from 'react-modal';
import API from '../../utils/API';
import {Logout} from "../../utils/Logout";

// graphic
import hamburger_menu from './icons/hamburger_menu.svg';
import cross from './icons/cross.svg';
import exit from './icons/exit.svg';
import arrow from './icons/arrow.svg';
import personWhite from './icons/personWhite.svg';

import './HeaderAuth.scss';


const HeaderAuth = (props) => {
  const [balance, setBalance] = useState("");

  const getBalanceRequest = async (data) => {
	let userData = await API.get('/get-balance');
	return await userData.data;
  };
  useEffect(() => {
	console.log('balance request')
	getBalanceRequest().then(
	  (result) => {
		console.log(result);
		if(result.success) setBalance(result.balance);
		if(props.getBalanceFromServer) {
		  console.log('SEND BALANCE');
		  props.getBalanceFromServer(result.balance);
		}
	  },
	  (error) => {
		console.log(error);
	  }
	)
  }, [props])

  return (
	<div className="HeaderAuth">
	  	<div className="container-fluid">
			<div className="row py-2 px-1 px-lg-4 m-0 align-items-center justify-content-between">
		  		<div className="col-12 d-flex align-items-center">
						<div className="HeaderAuth__menu d-flex align-items-center justify-content-between w-100">
							<div className="d-flex align-items-center">
								<Link to="/" className="HeaderAuthr__logo">Jenis</Link>
				  				<nav className="ml-4 d-none d-sm-block">
									<Link to="/">Главная</Link>
									<Link to="/games">Игры</Link>
									<Link to="/">FAQ</Link>
				  				</nav>
				  			</div>
			  				<div className="d-flex align-items-center">
								<div className="text-center mr-4 HeaderAuth__balance">
									<span>{balance}</span>
									<span>Баланс</span>
								</div>
								<div className="HeaderAuth__btn">
				  					<Link to="/lk" className="main-btn"><img src={personWhite} alt="" className="mr-1" />Профиль</Link>
								</div>
			  				</div>
						</div>
		  			</div>
				</div>
	  		</div>
		</div>
  );
};

export default HeaderAuth;
