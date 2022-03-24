import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { isMobile } from "react-device-detect";

// components
import Header from "../../blocks/Header/Header";
import HeaderAuth from "../../blocks/HeaderAuth/HeaderAuth";
import Footer from "../../blocks/Footer/Footer";
import Roulette from "../../games/roulette/Roulette";

// graphic
import chip10 from '../../games/bingo37/chips/chip10.svg';
import chip50 from '../../games/bingo37/chips/chip50.svg';
import chip100 from '../../games/bingo37/chips/chip100.svg';
import chip500 from '../../games/bingo37/chips/chip500.svg';
import chip1000 from '../../games/bingo37/chips/chip1000.svg';

// graphic
import chip1USD from '../../games/bingo37/chips/chip1USD.svg';
import chip2USD from '../../games/bingo37/chips/chip2USD.svg';
import chip5USD from '../../games/bingo37/chips/chip5USD.svg';
import chip10USD from '../../games/bingo37/chips/chip10USD.svg';
import chip20USD from '../../games/bingo37/chips/chip20USD.svg';

//sound
import drawing from '../../games/bingo37/sound/drawing.wav';
import win from '../../games/bingo37/sound/win.wav';
import chip from '../../games/bingo37/sound/chip.wav';

import back from '../../games/bingo37/icons/back.svg';
import arrow from '../../games/bingo37/icons/arrow.svg';
import trash from '../../games/bingo37/icons/trash.svg';
import cross from '../../games/bingo37/icons/cross.svg';
import repeat from '../../games/bingo37/icons/repeat.svg';
import x2 from '../../games/bingo37/icons/x2.svg';
import machine from '../../games/bingo37/img/machine.jpg';
import crossBtn from '../../games/bingo37/icons/crossBtn.svg';
import fullscreen from '../../games/bingo37/icons/fullscreen.svg';

//import './Home.scss';

const RoulettePage = (props) => {
	let location = useLocation();
	let [demo] = useState(!location.state ? true : location.state.demo);
	
	let auth = props.useAuth();

	let [gameLoaded, setGameLoaded] = useState(false);

	useEffect(() => {
		document.querySelector("html").classList.add("roulette");
		return () => document.querySelector("html").classList.remove("roulette");
	}, [])

	function updateSize() {
		try {
			if(window.screen.width > 992) {
				if (document.querySelector(".Table-inner")) document.querySelector(".Table-inner").style.transform = "none";
				if (document.querySelector(".Roulette__Table")) document.querySelector(".Roulette__Table").style.height = "auto";
				return false;
			}

			let bodyHeight = document.body.clientHeight;
			let roundInfoMobileHeight = document.querySelector(".Roulette__RoundInfo_Mobile").clientHeight;
			let controlsHeight =  document.querySelector(".Roulette__Controls").clientHeight;

			let currentTableHeight = document.querySelector(".Table-inner").clientHeight;

			let compressionRatio = (bodyHeight-roundInfoMobileHeight-controlsHeight)/currentTableHeight;
			if(compressionRatio > 1) return false;

			document.querySelector(".Table-inner").style.transform = "scale("+compressionRatio+")";
			document.querySelector(".Table-inner").style.transformOrigin = "top center";

			document.querySelector(".Roulette__Table").style.height = document.querySelector(".Table-inner").clientHeight*compressionRatio + "px";
		} catch(e) {

		}
	}

	useEffect(() => {
		window.addEventListener('resize', updateSize);
		return () => window.removeEventListener('resize', updateSize);
	}, [])

	useEffect(() => {
		console.log("gameLoaded", gameLoaded);
		if(!gameLoaded) return;
		updateSize();
	}, [gameLoaded])



	return (
		<div className="RoulettePage" >
			<Roulette chips={[
				{src: chip1USD, price: 1},
				{src: chip2USD, price: 2},
				{src: chip5USD, price: 5},
				{src: chip10USD, price: 10},
				{src: chip20USD, price: 20}
			]} sound={{drawing: drawing, win: win, chip: chip}} icons={{back: back, arrow: arrow, trash: trash, repeat: repeat, cross: cross, x2: x2, crossBtn: crossBtn, fullscreen: fullscreen}} 
			img={{machine: machine}} 
			balance={auth.balance}
			realBalance={auth.realBalance} 
			updateBalance={auth.updateBalance} 
			onWinGetBalance={() => { auth.reconfirm(() => {}) }} 
			demo={demo}
			isMobile={true} 
			componentMounted={() => setGameLoaded(true)} />
		</div>
	);
};

export default RoulettePage;
//isMobile={(isMobile) && (window.screen.width < 992) ? true : false} />