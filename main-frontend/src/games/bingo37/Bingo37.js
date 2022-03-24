import React, {Component} from 'react';
import { withTranslation } from 'react-i18next';
import hoistStatics from 'hoist-non-react-statics';

import './Bingo37.scss';

import ENVIRONMENT from "../../utils/ENVIRONMENT.js";

import io from 'socket.io-client';

/** Class representing a game Bingo37 
* @namespace Bingo37
*/

class Bingo37 extends React.Component {
  bingo37Container;
  params = [];

  mainContainerDOM;
  mainGameContainerDOM;
  videoContainer;
  videoImg;
  modalContainer;
  modalVideoContainer;
  notifyContainer;
  reconnectContainer;
  tableDOM;
  controlsContainerDOM;
  timeLineDOM;
  roundInfoDOM;

  confetti;
  confettiMobile;

  winAudio;
  chipAudio;

  youWonContainer;

  load;
  loadMobile;

  currentChip;
  chips = [];
  infoBlocks = {
    win: null,
    winMobile: null,
    time: null,
    timeMobile: null,
    step: null,
    bet: null,
    betMobile: null,
    lastNumbers: null,
    lastNumbersMobile: null,
    currentNumber: null,
    currentNumberMobile: null,
  };
  modalInfo = {};
  buttonClear;
  buttonUndo;

  translate = {};

  finalArrayOfBets = [];
  previousFinalArrayOfBets = [];
  betsLog = [];
  uidChip = 0;

  tableIsBlocked = true;
  timerId = null;


  lastBalance;

    /**
    * Represents a game Bingo37 for React.
    * @memberof Bingo37
    * @constructor
    * @params {Object} params - object with array of chips and object of icons
    */
    constructor(params) {
      super(params);
      this.params = params || [];
    }

    /**
    * Set game container when component did mount
    * @memberof Bingo37
    */
    componentDidMount() {
      this.bingo37Container = this.el;
      this.load();
    }

    /**
    * Update params when Bingo37 recieves new props
    * @memberof Bingo37
    */
    shouldComponentUpdate(newProps) {
      console.log('new props', newProps);

      this.translate.gameName.innerHTML = this.props.t('bingo_37_title');
      this.translate.reconnect.innerHTML = this.props.t('reconnect');

      this.translate.bet.innerHTML = this.props.t('bet');
      this.translate.win.innerHTML = this.props.t('win');

     this.translate.line1.innerHTML = this.props.t('line1');
          this.translate.line2.innerHTML = this.props.t('line2');
        this.translate.line3.innerHTML = this.props.t('line3');
        this.translate.cell37.innerHTML = this.props.t('cell37');

          this.translate.repeat.innerHTML = this.props.t('repeat');
        this.translate.buttonX2.innerHTML = this.props.t('buttonX2');
        this.translate.buttonBack.innerHTML = this.props.t('buttonBack');
        this.translate.buttonClear.innerHTML = this.props.t('buttonClear');

        this.translate.betYou.innerHTML = this.props.t('betYou');
        this.translate.winYou.innerHTML = this.props.t('winYou');

      if (this.translate.insufficient)  this.translate.insufficient.innerHTML = this.props.t('insufficient');
      if (this.translate.moreThen)  this.translate.moreThen.innerHTML = this.props.t('moreThen');


      this.params = newProps;
      this.updateBalance();
      if (!this.params.demo) {
        this.translate.balance.innerHTML = this.props.t('balance');
        this.translate.balanceYou.innerHTML = this.props.t('balanceYou');
        this.infoBlocks.balance.innerHTML = this.params.balance;
      }
      return true;
    }

    /**
    * Remove handlers when component will unmount
    * @memberof Bingo37
    * @params {Object} params - object with array of chips and object of icons
    */
    componentWillUnmount() {
      this.removeHandlers();
      this.socket.disconnect();
      console.log("disconnect")
      if (this.winAudio) this.winAudio.pause();
      if (this.params.balance) {
        let newBalance = this.params.realBalance;
        this.params.updateBalance(newBalance);
      }
      this.finalArrayOfBets = [];
      this.syncFinalArrayAndTable()
    }

    /**
    * Loads all the necessary functions for the game
    * @memberof Bingo37
    * @returns {void}
    */
    load() {
      this.generateMobileException();
      this.generateMainContainerForTableAndControllers();
      this.generateContainerModals();
      this.generateContainerNotify();
      this.generateContainerReconnect();
      this.generateTimeLine();
      // MOBILE
      this.generateRoundInfoMobile();
      // / MOBILE
      this.generateTable();
      this.generateControls();
      this.generateSidebar();
      // MOBILE
      this.generateSidebarMobile();
      // / MOBILE
      this.generateFellOutNumbers();
      this.setTableHandlers();
      this.setSidebarHandlers();
      this.sockets();

      this.params.componentMounted();
    }

    /**
    * Getter, returns current bets on the table
    * @memberof Bingo37
    * @returns {Array} finalArrayOfBets
    */
    get getBets() {
      return this.finalArrayOfBets;
    }


    /* == HELPERS == */

    /**
    * Comparison of two arrays for equivalence
    * @method compare
    * @memberof Bingo37
    * @param {Array} a1 - The first array
    * @param {Array} a2 - The second array
    * @returns {boolean} Are the two arrays equivalent
    */
    compare(a1, a2) {
      return a1.length == a2.length && a1.every((v, i) => v === a2[i])
    }
    /**
    * Finding parent element with class
    * @method findParent
    * @memberof Bingo37
    * @param {NodeElement} el - NodeElement
    * @param {String} cls - Class of parent
    * @returns {NodeElement} Parent NodeElement
    */
    findParent(el, cls) {
      while ((el = el.parentElement) && !el.classList.contains(cls));
      return el;
    }


    /* == GENERATE == */

    /**
    * This function creates a new DOM element with mobile exception "Rotate your device"
    * @method generateMobileException
    * @memberof Bingo37
    * @returns {void}
    */
    generateMobileException() {
      this.bingo37Container.insertAdjacentHTML('afterbegin', '<div class="Mobile"><div class="phone-icon"></div><span>Flip your device</span></div>');
    }

    /**
    * This function creates a new DOM element with container for table and controllers
    * @method generateMainContainerForTableAndControllers
    * @memberof Bingo37
    * @returns {void}
    */
    generateMainContainerForTableAndControllers() {
      this.bingo37Container.insertAdjacentHTML('beforeend', '<div class="Main"></div>');
      this.mainContainerDOM = this.bingo37Container.querySelector('.Main');
      this.mainContainerDOM.insertAdjacentHTML('beforeend', '<div class="Main__GameContainer"></div>');
      this.mainGameContainerDOM = this.bingo37Container.querySelector('.Main__GameContainer');
      this.mainContainerDOM.insertAdjacentHTML('afterbegin', '<div class="previous_fell-out__number"></div>');
    }


    /**
    * This function creates a new DOM element with modal
    * @method generateContainerModals
    * @memberof Bingo37
    * @returns {void}
    */
    generateContainerModals() {
      this.bingo37Container.insertAdjacentHTML('beforeend', '<div class="Modal__container"></div>');
      this.modalContainer = this.bingo37Container.querySelector('.Modal__container');
      this.modalContainer.insertAdjacentHTML('beforeend', '<div class="Modal"><h2></h2><p></p></div>');
      this.modalInfo = {
        title: this.modalContainer.querySelector(".Modal h2"),
        text: this.modalContainer.querySelector(".Modal p"),
      }

      this.bingo37Container.insertAdjacentHTML('beforeend', '<div class="ModalVideo__container"></div>');
      this.modalVideoContainer = this.bingo37Container.querySelector('.ModalVideo__container');
      this.modalVideoContainer.insertAdjacentHTML('beforeend', '<div class="ModalVideo"><img src="' + ENVIRONMENT.bingo37Video + '" class="VideoStream" alt="" ><button class="ModalVideo__close"><img src="' + this.params.icons.cross + '"  class="close__img" /></button></div>');
      this.modalVideoContainer.onclick = (e) => {
        if (e.target.className == "ModalVideo__container") this.modalVideoContainer.style.display = "none";
        if ((e.target.className == "ModalVideo__close") || (e.target.className == "close__img")) this.modalVideoContainer.style.display = "none";
      }
    }
    // !!!
    generateContainerNotify() {
      this.bingo37Container.insertAdjacentHTML('afterbegin', '<div class="Notify__container"></div>');
      this.notifyContainer = this.bingo37Container.querySelector('.Notify__container');
      this.notifyContainer.style.display = "none";
    }

    generateContainerReconnect() {
      this.bingo37Container.insertAdjacentHTML('afterbegin', '<div class="Reconnect__container"><p>Reconnecting in progress</p><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>');
      this.translate.reconnect = this.bingo37Container.querySelector(".Reconnect__container p");
      this.reconnectContainer = this.bingo37Container.querySelector('.Reconnect__container');
      this.reconnectContainer.style.display = "none";
    }


    /**
    * This function creates a new DOM element with time line
    * @method generateTimeLine
    * @memberof Bingo37
    * @returns {void}
    */
    generateTimeLine() {
      this.mainGameContainerDOM.insertAdjacentHTML('beforeend', '<div class="Bingo37__TimeLine"></div>');
      this.timeLineDOM = this.mainGameContainerDOM.querySelector('.Bingo37__TimeLine');
      this.timeLineDOM.insertAdjacentHTML('afterbegin', '<span class="game_Step"></span><div class="Progress_Bar"><div class="Progress_Bar-inner"></div></div>')

      this.timeLineDOM.insertAdjacentHTML('beforeend', '<div class="confetti__main"><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div></div>')
      this.confetti = this.timeLineDOM.querySelector('.confetti__main');

      this.timeLine = {
        time: this.timeLineDOM.querySelector(".Progress_Bar-inner"),
        step: this.timeLineDOM.querySelector(".game_Step")
      }
    }


    /**
    * This function creates a new DOM element with mobile round info
    * @method generateRoundInfoMobile
    * @memberof Bingo37
    * @returns {void}
    */
    generateRoundInfoMobile() {
      this.mainGameContainerDOM.insertAdjacentHTML('beforeend', '<div class="Bingo37__RoundInfo_Mobile"></div>');
      this.roundInfoDOM = this.mainGameContainerDOM.querySelector('.Bingo37__RoundInfo_Mobile');

      this.roundInfoDOM.insertAdjacentHTML('beforeend', '<div class="confetti__mobile"><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div><div class="confetti-piece"></div></div>')
      this.confettiMobile = this.roundInfoDOM.querySelector('.confetti__mobile');

      // bet & win
      this.roundInfoDOM.insertAdjacentHTML('beforeend', '<div class="chipsInfo_Mobile"><div class="Bet_Mobile"><span class="Bet_span">Bet</span><span class="Bet__content_Mobile">0</span></div><div class="Win_Mobile"><span class="Win_span">Win</span><span class="Win__content_Mobile">0</span></div></div>');
      
      this.translate.bet = this.roundInfoDOM.querySelector(".Bet_span");
      this.translate.win = this.roundInfoDOM.querySelector(".Win_span");

      // balance
      console.log("--this.params.balance", this.params.balance);
      if (!this.params.demo) {
        console.log("NO DEMO");
        this.roundInfoDOM.insertAdjacentHTML('beforeend', '<div class="Balance_Mobile"><span class="Balance__content_Mobile">'+ this.params.balance +'</span><span class="Balance_span">Balance</span></div>');
        this.translate.balance = this.roundInfoDOM.querySelector(".Balance_span");
      } else {
        console.log("DEMO");
      }
      // timer
      this.roundInfoDOM.insertAdjacentHTML('beforeend',
        '<div class="Timing_Mobile"> <span class="Step__content_Mobile"></span> <span class="Time__content_Mobile">00:30</span> <div class="Progress_Bar_Mobile"><div class="Progress_Bar-inner_Mobile"></div></div> </div>'
        );

      // close
      this.roundInfoDOM.insertAdjacentHTML('beforeend', '<a href="/" class="cross__btn"><img src="' + this.params.icons.crossBtn + '"></a>');

      this.timeLine.timeMobile = this.roundInfoDOM.querySelector(".Progress_Bar-inner_Mobile");
      this.timeLine.stepMobile = this.roundInfoDOM.querySelector(".Step__content_Mobile");


      this.infoBlocks.betMobile = this.roundInfoDOM.querySelector(".Bet__content_Mobile");
      this.infoBlocks.winMobile = this.roundInfoDOM.querySelector(".Win__content_Mobile");
      this.infoBlocks.timeMobile = this.roundInfoDOM.querySelector(".Time__content_Mobile");
      this.infoBlocks.balanceMobile = this.roundInfoDOM.querySelector(".Balance__content_Mobile");
    }


    /**
    * This function creates a new DOM element with table
    * @method generateTable
    * @memberof Bingo37
    * @returns {void}
    */
    generateTable() {
      this.mainGameContainerDOM.insertAdjacentHTML('beforeend', '<div class="Bingo37__Table"><div class="Table-inner"></div></div>');
      let gameTable = this.mainGameContainerDOM.querySelector('.Bingo37__Table .Table-inner');

        this.mainGameContainerDOM.querySelector('.Bingo37__Table').insertAdjacentHTML('beforeend', '<div class="yorWon__container"><span>You have won!</span></div>');
        this.youWonContainer =  this.mainGameContainerDOM.querySelector('.Bingo37__Table').querySelector('.yorWon__container');

        if (this.props.demo) this.mainGameContainerDOM.querySelector('.Bingo37__Table').insertAdjacentHTML('beforeend', '<div class="demo">Demo</div>');

         // first cell
         gameTable.insertAdjacentHTML('afterbegin', '<div class="Bingo Cell" data-value="37"><span class="cell_37">Bingo37</span></div>');

         for (let i = 0; i <= 24; i = i + 12) {
            // append HolderNumber
            gameTable.insertAdjacentHTML('beforeend', '<div class="HolderNumber"></div>');
            let key = i === 0 ? 0 : i === 12 ? 1 : i === 24 ? 2 : null;
            let holderNumber = gameTable.querySelectorAll('.HolderNumber')[key];
            for (let j = 1; j <= 12; j++) {
              holderNumber.insertAdjacentHTML('beforeend', '<div class="Cell" data-value="' + (j + i) + '"><span>' + (j + i) + '</span></div>');
            }
            // append HolderLine
            holderNumber.insertAdjacentHTML('afterend', '<div class="HolderLine"</div>');
            let holderLine = gameTable.querySelectorAll('.HolderLine')[key];
            for (let j = 1; j <= 3; j++) {
              holderLine.insertAdjacentHTML('afterbegin', '<div class="Cell" data-value="[' + [j + i, j + i + 3, j + i + 6, j + i + 9] + ']"></div>');
            }
          }
        // append Lines
        gameTable.insertAdjacentHTML('beforeend', '<div class="Lines"></div>');
        let lines = gameTable.querySelector('.Lines');
        for (let i = 0; i < 3; i++) {
          if (i == 0) lines.insertAdjacentHTML('beforeend',
            '<div class="Cell" data-value="[3,6,9,12,15,18,21,24,27,30,33,36]"><span class="span_line_1">line 1</span></div>');
            if (i == 1) lines.insertAdjacentHTML('beforeend',
              '<div class="Cell" data-value="[2,5,8,11,14,17,20,23,26,29,32,35]"><span class="span_line_2">line 2</span></div>');
              if (i == 2) lines.insertAdjacentHTML('beforeend',
                '<div class="Cell" data-value="[1,4,7,10,13,16,19,22,25,28,31,34]"><span class="span_line_3">line 3</span></div>');
            }
        // append HolderGroup
        gameTable.insertAdjacentHTML('beforeend', '<div class="HolderGroup"></div>');
        let holderGroup = gameTable.querySelector('.HolderGroup');
        for (let i = 0; i < 3; i++) {
          if (i == 0) holderGroup.insertAdjacentHTML('beforeend',
            '<div class="Cell" data-value="[1,2,3,4,5,6,7,8,9,10,11,12]"><span>1 - 12</span></div>');
            if (i == 1) holderGroup.insertAdjacentHTML('beforeend',
              '<div class="Cell" data-value="[13,14,15,16,17,18,19,20,21,22,23,24]"><span>13 - 24</span></div>');
              if (i == 2) holderGroup.insertAdjacentHTML('beforeend',
                '<div class="Cell" data-value="[25,26,27,28,29,30,31,32,33,34,35,36]"><span>25 - 36</span></div>');
            }
        // append HolderGroupLastRow
        gameTable.insertAdjacentHTML('beforeend', '<div class="HolderGroupLastRow"></div>');
        let holderGroupLastRow = gameTable.querySelector('.HolderGroupLastRow');
        for (let i = 0; i < 2; i++) {
          if (i == 0) holderGroupLastRow.insertAdjacentHTML('beforeend',
            '<div class="Cell" data-value="[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]"><span>1-18</span></div>');
            if (i == 1) holderGroupLastRow.insertAdjacentHTML('beforeend',
              '<div class="Cell" data-value="[19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36]"><span>19-36</span></div>');
          }
        

        // export
        this.tableDOM = gameTable;

         this.translate.line1 = this.tableDOM.querySelector(".span_line_1");
          this.translate.line2 = this.tableDOM.querySelector(".span_line_2");
          this.translate.line3 = this.tableDOM.querySelector(".span_line_3");
          this.translate.cell37 = this.tableDOM.querySelector(".cell_37");
      }

    /**
    * This function creates a new DOM element with game controls (chips, buttons)
    * @method generateControls
    * @memberof Bingo37
    * @returns {void}
    */
    generateControls() {
      let controlsContainer = document.createElement('div');
      controlsContainer.className = "Bingo37__Controls";

        // container for Repeat and X2 buttons
        let controlsRepeadAndX2Container = document.createElement('div');
        controlsRepeadAndX2Container.className = "repeatAndX2Buttons";
        // create Repeat Last Bet button
        let buttonRepeatLastBet = document.createElement('button');
        buttonRepeatLastBet.className = "repeatButton";
        buttonRepeatLastBet.innerHTML = 'Repeat';
        buttonRepeatLastBet.onclick = () => this.buttonRepeatLastBetOnClick();
        controlsRepeadAndX2Container.appendChild(buttonRepeatLastBet);
        // create X2 button
        let buttonX2 = document.createElement('button');
        buttonX2.className = "buttonX2";
        buttonX2.innerHTML = 'Double';
        buttonX2.onclick = () => this.buttonX2OnClick();
        controlsRepeadAndX2Container.appendChild(buttonX2);


        // container for chips
        let controlsChipsContainer = document.createElement('div');
        controlsChipsContainer.className = "chips";

        this.params.chips.forEach((item, i) => {
          // create chip image
          let chip = new Image();
          chip.src = item.src;
          chip.setAttribute('data-chip-price', item.price);
          chip.setAttribute('data-chip-number', i);

          if (i === 0) {
            this.currentChip = chip;
            chip.classList.add('active');
          }

          this.chips.push(chip);
          // set click listner
          chip.onclick = (e) => this.chipControlsOnClick(e);
          controlsChipsContainer.appendChild(chip);
        })


        // container for buttons
        let controlsButtonContainer = document.createElement('div');
        controlsButtonContainer.className = "buttons";

        // create UnDo button
        let buttonUndo = document.createElement('button');
        buttonUndo.className = "buttonBack";
        buttonUndo.innerHTML = 'Back';
        buttonUndo.onclick = () => this.buttonUndoOnClick();
        controlsButtonContainer.appendChild(buttonUndo);
        this.buttonUndo = buttonUndo;

        // create Clear button
        let buttonClear = document.createElement('button');
        buttonClear.className = "buttonClear";
        buttonClear.innerHTML = 'Clear';
        buttonClear.onclick = () => this.buttonClearOnClick();
        controlsButtonContainer.appendChild(buttonClear);
        this.buttonClear = buttonClear;

        // append to controlsDiv
        controlsContainer.appendChild(controlsRepeadAndX2Container);
        controlsContainer.appendChild(controlsChipsContainer);
        controlsContainer.appendChild(controlsButtonContainer);

        // draw DOM elements in game-container
        this.mainGameContainerDOM.appendChild(controlsContainer);

        // export
        this.controlsContainerDOM = controlsContainer;

        this.translate.repeat = this.controlsContainerDOM.querySelector(".repeatButton");
        this.translate.buttonX2 = this.controlsContainerDOM.querySelector(".buttonX2");
        this.translate.buttonBack = this.controlsContainerDOM.querySelector(".buttonBack");
        this.translate.buttonClear = this.controlsContainerDOM.querySelector(".buttonClear");
      }


    /**
    * This function creates a new DOM element with mobile game sidebar (fell out numbers and previous fell out number)
    * @method generateSidebarMobile
    * @memberof Bingo37
    * @returns {void}
    */
    generateSidebarMobile() {
      this.bingo37Container.insertAdjacentHTML('afterbegin', '<div class="Bingo37__Sidebar_Mobile"></div>');
      let sidebarMobile = this.bingo37Container.querySelector('.Bingo37__Sidebar_Mobile');

      sidebarMobile.insertAdjacentHTML('afterbegin', '<div class="Bingo37__Sidebar-content_Mobile"></div>');

      let sidebarMobileContent = sidebarMobile.querySelector('.Bingo37__Sidebar-content_Mobile');

      sidebarMobileContent.insertAdjacentHTML('beforeend',
        '<div class="fell-out__number_Mobile"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>');
      sidebarMobileContent.insertAdjacentHTML('afterbegin', '<div class="previous_fell-out__number_Mobile"></div>');

      this.infoBlocks.lastNumbersMobile = sidebarMobileContent.querySelector(".previous_fell-out__number_Mobile");
      this.infoBlocks.currentNumberMobile = this.bingo37Container.querySelector(".fell-out__number_Mobile");
    }


    /**
    * This function creates a new DOM element with game sidebar
    * @method generateSidebar
    * @memberof Bingo37
    * @returns {void}
    */
    generateSidebar() {

      this.bingo37Container.insertAdjacentHTML('afterbegin', '<div class="Bingo37__Sidebar"></div>');
      let sidebar = this.bingo37Container.querySelector('.Bingo37__Sidebar');

      sidebar.insertAdjacentHTML('afterbegin', '<div class="Bingo37__Sidebar-content"></div>');
      let sidebarContent = sidebar.querySelector('.Bingo37__Sidebar-content');
      

      sidebarContent.insertAdjacentHTML('beforeend',
        '<div class="Holder-time"><h3>Bingo 37</h3><div class="Holder-time__content"><span class="Step__content">Before game</span><span class="Time__content">00:30</span></div></div>'
        );

      this.translate.gameName = sidebarContent.querySelector(".Holder-time h3");

      if (!this.props.demo) sidebarContent.insertAdjacentHTML('beforeend', '<div class="Balance"><span class="Balance_span">Your balance</span><span class="Balance__content">'+this.props.balance+'</span></div>');
      sidebarContent.insertAdjacentHTML('beforeend', '<div class="Bet"><span class="betYou">Your bet</span><span class="Bet__content">0</span></div>');
      sidebarContent.insertAdjacentHTML('beforeend', '<div class="Win"><span class="winYou">Your win</span><span class="Win__content">0</span></div>');
      sidebarContent.insertAdjacentHTML('beforeend',
        '<div class="fell-out__number"><div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>');
      sidebarContent.insertAdjacentHTML('afterbegin', '<div class="Video"><img src="' + ENVIRONMENT.bingo37Video + '" alt="" class="Video__stream"><img src="' + this.params.img.machine + '" alt="" class="Video__img"></div>');
      this.videoContainer = sidebarContent.querySelector('.Video__stream');
      this.videoImg = sidebarContent.querySelector('.Video__img');
      this.videoContainer.onclick = () => {
        this.modalVideoContainer.style.display = "flex";
      }

        // export
        this.infoBlocks.balance = sidebarContent.querySelector(".Balance__content");
        this.infoBlocks.bet = sidebarContent.querySelector(".Bet__content");
        this.infoBlocks.win = sidebarContent.querySelector(".Win__content");
        this.infoBlocks.time = sidebarContent.querySelector(".Time__content");
        this.infoBlocks.step = sidebarContent.querySelector(".Step__content");

        this.translate.balanceYou = sidebarContent.querySelector(".Balance_span");
        this.translate.betYou = sidebarContent.querySelector(".betYou");
        this.translate.winYou = sidebarContent.querySelector(".winYou");
      }


    /**
    * This function creates a new DOM element with fell out numbers
    * @method generateFellOutNumbers
    * @memberof Bingo37
    * @returns {void}
    */
    generateFellOutNumbers() {
      let fellOutNumbers = this.bingo37Container.querySelector('.previous_fell-out__number');
      this.infoBlocks.lastNumbers = fellOutNumbers;
      this.infoBlocks.currentNumber = this.bingo37Container.querySelector(".fell-out__number");
    }

    /**
    * This function set game table handler onclick and determines where the user wants to put the chip
    * @method setTableHandlers
    * @memberof Bingo37
    * @returns {void}
    */
    setTableHandlers() {
      this.tableDOM.onclick = (e) => {
        if (this.tableIsBlocked) return false;
        //console.log('this.params.balance', this.params.balance);
        if(this.params.balance) {
          // !!!
          if ((!this.props.demo) && (+this.infoBlocks.bet.innerHTML + +this.currentChip.dataset.chipPrice > this.params.realBalance)) {
            this.notifyContainer.innerHTML = '<span class="insufficient">' + this.props.t('insufficient') + '</span>';
            this.notifyContainer.style.display = "flex";
            setTimeout(() => {
              this.notifyContainer.style.display = "none";
            }, 2000)
            return false;
          }

        }
        if (+this.infoBlocks.bet.innerHTML + +this.currentChip.dataset.chipPrice > 2000) {
          this.notifyContainer.innerHTML = '<span class="moreThen">' + this.props.t('moreThen') + '</span>';
          //this.translate.moreThen = this.notifyContainer.querySelector(".moreThen");
          this.notifyContainer.style.display = "flex";
          setTimeout(() => {
            this.notifyContainer.style.display = "none";
          }, 2000)
          return false;
        }

        let cell = e.target.classList.contains("Cell") ? e.target : this.findParent(e.target, 'Cell');
        if (!cell) return false;

        this.chipAudio.play();

        let target = cell.getBoundingClientRect();
        let width = target.width;
        let height = target.height;
        let x = e.clientX - target.left;
        let y = e.clientY - target.top;

        let currentBet = [],
        offsetX, offsetY;
        let isFixedPosition = false;

        let cellValue = JSON.parse(cell.dataset.value);
        if (typeof(cellValue) == 'object') {
          currentBet = cellValue;
          isFixedPosition = true;
        } else {
          currentBet.push(cellValue);

          if (x <= width / 4) {
            // clicked to left
            let additionalValue = this.getCellValueOnThe_left(cellValue);
            if (additionalValue) {
              currentBet.push(additionalValue);
              offsetX = "left";
            }
          }
          if (x >= (width / 4) * 3) {
            // clicked to right
            let additionalValue = this.getCellValueOnThe_right(cellValue);
            if (additionalValue) {
              currentBet.push(additionalValue);
              offsetX = "right";
            }
          }
          if (y <= height / 4) {
            // clicked to top
            let additionalValue = this.getCellValueOnThe_top(cellValue);
            if (additionalValue) {
              currentBet.push(additionalValue);
              offsetY = "top";
            }
          }
          if (y >= (height / 4) * 3) {
            // clicked to bottom
            let additionalValue = this.getCellValueOnThe_bottom(cellValue);
            if (additionalValue) {
              currentBet.push(additionalValue);
              offsetY = "bottom";
            }
          }

          if (currentBet.length === 3) {
            let additionalValue = this.findTheFourthCell(
              cellValue,
              offsetX,
              offsetY
              );
            if (additionalValue) currentBet.push(additionalValue);
          }
        }
        console.log("currentBet", currentBet);
        currentBet.sort((a, b) => a - b);

        // put chip to game table
        //this.putChip(currentBet, offsetX, offsetY, isFixedPosition, cell);

        let chip = this.currentChip.cloneNode(true);
        let price = +chip.dataset.chipPrice;
        this.addToFinalArray(currentBet, price);
        this.syncFinalArrayAndTable();
        
      };
    }

    /**
    * This function returns the value of the cell at the top (if any)
    * @method getCellValueOnThe_top
    * @memberof Bingo37
    * @param {Number} cellValue - The value of cell
    * @returns {Number} CellValue
    */
    getCellValueOnThe_top(cellValue) {
      console.log("cellValue", cellValue);
      return cellValue % 3 !== 0 && cellValue !== 37 ? cellValue + 1 : null;
    }

    /**
    * This function returns the value of the cell at the bottom (if any)
    * @method getCellValueOnThe_top
    * @memberof Bingo37
    * @param {Number} cellValue - The value of cell
    * @returns {Number} CellValue
    */
    getCellValueOnThe_bottom(cellValue) {
      console.log("cellValue", cellValue);
      return cellValue % 3 !== 1 ? cellValue - 1 : null;
    }

    /**
    * This function returns the value of the cell at the left (if any)
    * @method getCellValueOnThe_left
    * @memberof Bingo37
    * @param {Number} cellValue - The value of cell
    * @returns {Number} CellValue
    */
    getCellValueOnThe_left(cellValue) {
      console.log("cellValue", cellValue);
      return cellValue % 12 !== 1 && cellValue % 12 !== 2 && cellValue % 12 !== 3 ? cellValue - 3 : null;
    }

    /**
    * This function returns the value of the cell at the right (if any)
    * @method getCellValueOnThe_right
    * @memberof Bingo37
    * @param {Number} cellValue - The value of cell
    * @returns {Number} CellValue
    */
    getCellValueOnThe_right(cellValue) {
      console.log("cellValue", cellValue);
      return cellValue % 12 !== 0 &&
      cellValue % 12 !== 10 &&
      cellValue % 12 !== 11 ? cellValue + 3 : null;
    }

    /**
    * This function returns the value of the fourth cell (when you now clicked cell and offsets)
    * @method findTheFourthCell
    * @memberof Bingo37
    * @param {Number} cellValue - The value of cell
    * @param {String} offsetX - Left or right indent
    * @param {String} offsetY - Top or bottom indent
    * @returns {Number} CellValue
    */
    findTheFourthCell(cellValue, offsetX, offsetY) {
      return offsetX == "left" && offsetY == "top" ? cellValue - 2 : offsetX == "left" && offsetY == "bottom" ? cellValue - 4 : offsetX == "right" &&
      offsetY == "top" ? cellValue + 4 : offsetX == "right" && offsetY == "bottom" ? cellValue + 2 : null;
    }



    /**
    * This function adding new bet to finalArrayOfBets
    * @method addToFinalArray
    * @memberof Bingo37
    * @param {Array} cellValue - cell for chip
    * @param {Number} price - price of chip
    * @param {Boolean} log - do we need to log this adding?
    * @returns {void}
    */
    addToFinalArray(cellValue, price, log = true) {
      if(log) this.betsLog.push(cellValue);
      let hasInFinalArray = false;
      this.finalArrayOfBets.forEach((betItem, id) => {
        if (this.compare(betItem.bet, cellValue)) {
          hasInFinalArray = true;
          betItem.money.push(price);
          betItem.newOne = true;
        }
      })
      if(!hasInFinalArray) {
        this.finalArrayOfBets.push({
          bet: cellValue,
          money: [price],
          ids: [],
          newOne: true
        });
      }
    }



    /**
    * This function sync finalArrayOfBets with game table
    * @method syncFinalArrayAndTable
    * @memberof Bingo37
    * @returns {void}
    */
    syncFinalArrayAndTable() {
      if(!this.finalArrayOfBets.length) {
        [].forEach.call(document.querySelectorAll('[data-chip-uid]'), function (el) {
          el.remove();
        });
      }
      this.finalArrayOfBets.forEach((betItem, id) => {
        if(betItem.newOne) {
          betItem.newOne = false;

          // rearrange all the chips of this bet
          let sum = betItem.money.reduce((a, b) => a + b, 0);
          betItem.ids.forEach((item) => {
            try {
              this.tableDOM.querySelector('[data-chip-uid="' + item + '"]').remove();
            } catch(e) {}
          })
          betItem.ids = [];

          // defining the chip position
          let mainCellNode = this.tableDOM.querySelector('[data-value="' + betItem.bet[0] + '"]');
          let offsetY, offsetX;

          if(betItem.bet.length === 4) {
            if(betItem.bet[0]+1 === betItem.bet[1]) { offsetY = "top"; offsetX = "right"; }
            if(betItem.bet[0]+3 === betItem.bet[1]) mainCellNode = this.tableDOM.querySelector('[data-value="' + JSON.stringify(betItem.bet) + '"]');
          }

          if(betItem.bet.length === 2) {
            if(betItem.bet[0]+1 === betItem.bet[1]) offsetY = "top";
            if(betItem.bet[0]-1 === betItem.bet[1]) offsetY = "bottom";
            if(betItem.bet[0]+3 === betItem.bet[1]) offsetX = "right";
            if(betItem.bet[0]-3 === betItem.bet[1]) offsetX = "left";

            if(betItem.bet[0] === 35 && betItem.bet[1] === 37) {offsetX = "right"; offsetY = "";}
            if(betItem.bet[0] === 34 && betItem.bet[1] === 37) {offsetX = "right"; offsetY = "";}
            if(betItem.bet[0] === 36 && betItem.bet[1] === 37) {offsetX = "right"; offsetY = ""; }
          }

          if(betItem.bet.length === 3) {
            offsetY = "top";
            offsetX = "right";
          }

          if(betItem.bet.length > 4) mainCellNode = this.tableDOM.querySelector('[data-value="' + JSON.stringify(betItem.bet) + '"]');

          let n, newTop = offsetY == 'top' ? -25 : 25;
          for (let i = this.params.chips.length - 1; i >= 0; i--) {
            // get bigger 
            n = Math.floor(sum / this.params.chips[i].price);
            sum -= this.params.chips[i].price * n;
            for (; n > 0; n--) {
              let CloneChip = this.chips[i].cloneNode(true);
              CloneChip.setAttribute('data-chip-uid', ++this.uidChip);
              if (offsetX) CloneChip.classList.add(offsetX);
              if (offsetY) CloneChip.classList.add(offsetY);
              CloneChip.style.top = newTop + "%";

              betItem.ids.push(this.uidChip);
              // draw chip on the table
              mainCellNode.append(CloneChip);
              newTop -= 3;
            }
          } //end for

        }
      })

      let allBetsSum = 0;
      this.finalArrayOfBets.forEach((betItem, id) => {
        let betSum = betItem.money.reduce((a, b) => a + b, 0);
        allBetsSum += betSum;
      })
      this.infoBlocks.bet.innerHTML = allBetsSum;
      this.infoBlocks.betMobile.innerHTML = allBetsSum;
      if (!this.params.demo) {
        let newBalance = +this.params.realBalance - +allBetsSum;
        //this.gameBalance = newBalance;
        if (this.infoBlocks.balance) this.infoBlocks.balance.innerHTML = newBalance;
        this.params.updateBalance(newBalance);
      }
    }



    /**
    * This function set game sidebar handlers and responsible for opening and hiding the sidebar
    * @method setSidebarHandlers
    * @memberof Bingo37
    * @returns {void}
    */
    setSidebarHandlers() {
      // EMPTY
    }


    /**
    * This function changes current chip when user clicked on contorls chips
    * @method chipControlsOnClick
    * @memberof Bingo37
    * @returns {void}
    */
    chipControlsOnClick = (e) => {
      this.currentChip.classList.remove('active');
      this.currentChip = e.target;
      this.currentChip.classList.add('active');
    }

    /**
    * Click handler for button repeat last bet
    * @method buttonRepeatLastBetOnClick
    * @memberof Bingo37
    * @returns {void}
    */
    buttonRepeatLastBetOnClick = () => {
      if (this.tableIsBlocked) return false;
      if (this.finalArrayOfBets.length) return false;
      this.chipAudio.play();
      this.finalArrayOfBets = this.previousFinalArrayOfBets.slice(0);
      this.finalArrayOfBets.forEach((betItem) => {
        betItem.newOne = true;
      })
      this.previousFinalArrayOfBets = [];
      this.betsLog = ["repeat"];
      this.syncFinalArrayAndTable();
    }

    /**
    * Click handler for button X2
    * @method buttonX2OnClick
    * @memberof Bingo37
    * @returns {void}
    */
    buttonX2OnClick = () => {
      if (this.tableIsBlocked) return false;

      if (+this.infoBlocks.bet.innerHTML*2 > 2000) {
          this.notifyContainer.innerHTML = '<span class="moreThen">' + this.props.t('moreThen') + '</span>';
          this.notifyContainer.style.display = "flex";
          setTimeout(() => {
            this.notifyContainer.style.display = "none";
          }, 2000)
          return false;
        }
        if ((!this.props.demo) && (+this.infoBlocks.bet.innerHTML*2 > this.params.realBalance)) {
            this.notifyContainer.innerHTML = '<span class="insufficient">' + this.props.t('insufficient') + '</span>';
            this.notifyContainer.style.display = "flex";
            setTimeout(() => {
              this.notifyContainer.style.display = "none";
            }, 2000)
            return false;
          }
          this.chipAudio.play();
      this.finalArrayOfBets.forEach((betItem, index) => {
        let betIncrease = betItem.money.reduce((a, b) => a + b, 0);
        betItem.money.forEach(price => this.addToFinalArray(betItem.bet, price, false));
      });
      this.betsLog.push("x2");
      this.syncFinalArrayAndTable();
    }

    /**
    * Click handler for button clear
    * @method buttonClearOnClick
    * @memberof Bingo37
    * @returns {void}
    */
    buttonClearOnClick = () => {
      if (this.tableIsBlocked) return false;
      this.finalArrayOfBets = [];
      this.syncFinalArrayAndTable();
      this.betsLog = [];
    }


    clearFinalList = () => {
      this.previousFinalArrayOfBets = this.finalArrayOfBets.slice(0);
      this.finalArrayOfBets = [];
      this.syncFinalArrayAndTable();
      this.betsLog = [];
    }

    /**
    * Click handler for undo button
    * @method buttonUndoOnClick
    * @memberof Bingo37
    * @returns {void}
    */
    buttonUndoOnClick = () => {
      if (this.tableIsBlocked) return false;
      if (!this.betsLog.length) return false;

      let lastBet = this.betsLog.pop();
      if(lastBet === "repeat") {
        this.finalArrayOfBets = [];
        this.syncFinalArrayAndTable();
        return true;
      }
      this.finalArrayOfBets.forEach((betItem, index) => {
        if(lastBet === "x2") {
          betItem.money.splice(betItem.money.length/2, betItem.money.length/2);
          betItem.newOne = true;
        }
        if(this.compare(betItem.bet, lastBet)) {
          betItem.money.pop();
          betItem.newOne = true;
        }
      })
      this.syncFinalArrayAndTable();
    }

    /**
    * This function removes all handlers
    * @method removeHandlers
    * @memberof Bingo37
    * @returns {void}
    */
    removeHandlers() {
      this.tableDOM.onclick = null;
      this.chips.forEach(item => {
        item.onlick = null;
      })
      this.buttonClear.onclick = null;
      this.buttonUndo.onclick = null;
    }

        /**
    * This function гpdates the progress bar of the game step
    * @method timeLineProgress
    * @memberof Bingo37
    * @returns {void}
    */
    timeLineProgress(stepDuration, timeLeft){
      console.log(stepDuration + " " +  timeLeft);
      clearInterval(this.timerId);
      this.timeLine.time.style.width = timeLeft/stepDuration*100 + '%';
      this.timeLine.timeMobile.style.width = timeLeft/stepDuration*100 + '%';
      let speed = 10/stepDuration; 
      this.timerId = setInterval(() => {
        let currentWidth = this.timeLine.time.style.width;
        currentWidth = currentWidth.substring(0, currentWidth.length - 1) - speed;
        this.timeLine.time.style.width = currentWidth + '%';
        this.timeLine.timeMobile.style.width = currentWidth + '%';
      }, 100);
    }


    /**
    * This function updates balance after getting new props
    * @method updateBalance
    * @memberof Bingo37
    * @return {void}
    */
    updateBalance() {
      if(!this.params.demo) this.roundInfoDOM.querySelector(".Balance__content_Mobile").innerHTML = this.params.balance;
    }


    /**
    * This function works with sockets (data exchange with the server)
    * @method sockets
    * @memberof Bingo37
    * @return {void}
    */
    sockets() {
      const socket = io(ENVIRONMENT.bingo37, {
        reconnectionDelayMax: 10000,
        forceNew: true,
        withCredentials: 'true',
      });
      this.socket = socket;
      let firstData = false;
      console.log("this", this.reconnectContainer)
        // on connect send socket id
        socket.on('connect', () => {
          let socketID = socket.id;
          let userKey;
          if (localStorage.getItem('userKeySocket')) {
            userKey = localStorage.getItem('userKeySocket');
          } else {
            userKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            localStorage.setItem('userKeySocket', userKey);
          }
          socket.emit('setSocketId', {
            socketID: socketID,
            userKey: userKey,
            demo: this.params.demo,
          });
          if (!this.winAudio) this.winAudio = new Audio(this.params.sound.win);
          if (!this.chipAudio) this.chipAudio = new Audio(this.params.sound.chip);
        });



        let visibilityChange = (reconnectContainer, thisValue) => {
          document.addEventListener("visibilitychange", function() {
            if (document.hidden) {
              if (this.winAudio) this.winAudio.pause();
             socket.disconnect();
             console.log("disconnect")
             firstData = false;
           } else {
            reconnectContainer.style.display = "flex";
            socket.connect();
            for (let i =1; i <= 37; i++) {
              thisValue.tableDOM.querySelector('[data-value="' + i + '"]').style.border = null;
              thisValue.tableDOM.querySelector('[data-value="' + i + '"]').classList.remove('current-raffle-number');
            }
            thisValue.videoContainer.style.display = "none";
            thisValue.modalVideoContainer.style.display = "none";
            thisValue.videoImg.style.display = "block";
            console.log("connect");

          }
        });
        }
        visibilityChange(this.reconnectContainer, this);

        let event = "bingo37_Game";
        socket.prependAny((event, data) => {
          firstData = true;
          this.reconnectContainer.style.display = "none";
        });

        socket.on('bingo37_Game fell-out-last', (msg) => {
          console.log('fell-out-last', msg.nums);
          let lastNumbers = '';

          if (this.tableIsBlocked) {
            for (let i = 0; i < msg.nums.length; i++) {
              lastNumbers += '<span>' + msg.nums[i] + '</span>';
            }
          } else {
            this.infoBlocks.currentNumber.innerHTML = '<span>' + msg.nums[0] + '</span>';
            this.infoBlocks.currentNumberMobile.innerHTML = '<span>' + msg.nums[0] + '</span>';
            for (let i = 1; i < msg.nums.length; i++) {
              lastNumbers += '<span>' + msg.nums[i] + '</span>';
            }
          }

          this.infoBlocks.lastNumbers.innerHTML = lastNumbers;
          this.infoBlocks.lastNumbersMobile.innerHTML = lastNumbers;
        })



        socket.on('bingo37_Game raffle-is-completed', (msg) => {
          console.log(msg);
          if(!this.timerId) this.timeLineProgress(msg.stepLimits, msg.timeLeft);
          this.infoBlocks.step.innerHTML = this.props.t('result');
          this.timeLine.step.innerHTML = this.props.t('result');
          this.timeLine.stepMobile.innerHTML = this.props.t('result');
          this.infoBlocks.time.innerHTML = " ";
          this.infoBlocks.timeMobile.innerHTML = " ";
          this.infoBlocks.currentNumber.innerHTML = '<div class="square"><span>' + msg.num + '</span></div>';
          this.infoBlocks.currentNumberMobile.innerHTML = '<div class="square"><span>' + msg.num + '</span></div>';


          let currentNumberPosition = this.tableDOM.querySelector('[data-value="' + msg.num + '"]');
          currentNumberPosition.style.border = "3px solid #FF2E00";
          currentNumberPosition.classList.add('current-raffle-number');
        })

        socket.on('bingo37_Game last-number', (msg) => {
          console.log(msg);
          this.infoBlocks.currentNumber.innerHTML = '<div class="square"><span>' + msg.num + '</span></div>';
          this.infoBlocks.currentNumberMobile.innerHTML = '<div class="square"><span>' + msg.num + '</span></div>';
        })


        socket.on('bingo37_Game drawingInProcess', (msg) => {
          this.confetti.style.display = "none";
          this.confettiMobile.style.display = "none";
          this.videoContainer.style.display = "block";
          this.videoImg.style.display = "none";
          console.log(msg);
          this.timeLineProgress(msg.stepLimits, msg.timeLeft);
          this.infoBlocks.step.innerHTML = this.props.t('drawingInProcess');
          this.timeLine.step.innerHTML = this.props.t('drawingInProcess');
          this.timeLine.stepMobile.innerHTML = this.props.t('drawingInProcess');
          this.infoBlocks.time.innerHTML = "00:" + (Math.floor(+msg.timeLeft/10)==0 ? '0'+msg.timeLeft : msg.timeLeft);
          this.infoBlocks.timeMobile.innerHTML = "00:" + (Math.floor(+msg.timeLeft/10)==0 ? '0'+msg.timeLeft : msg.timeLeft);
          this.tableIsBlocked = true;

            // add current num to last

            if (this.infoBlocks.currentNumber.querySelector('.square')) {
              this.infoBlocks.lastNumbers.insertAdjacentHTML('afterbegin', this.infoBlocks.currentNumber.querySelector('.square').innerHTML);
              this.infoBlocks.lastNumbersMobile.insertAdjacentHTML('afterbegin', this.infoBlocks.currentNumberMobile.querySelector('.square').innerHTML);
              this.infoBlocks.currentNumber.innerHTML = '<span class="load"></span>';
              this.infoBlocks.currentNumberMobile.innerHTML = '<span class="load__Mobile"></span>';
              this.load = this.bingo37Container.querySelector('.load');
              this.loadMobile = this.bingo37Container.querySelector('.load__Mobile');
              setInterval(()=> {
                let nummm = Math.round(1 - 0.5 + Math.random() * (37 - 1 + 1));
                this.load.innerHTML = nummm;
                this.loadMobile.innerHTML = nummm;
              }, 50)
                //this.infoBlocks.lastNumbers.removeChild(this.infoBlocks.lastNumbers.lastElementChild);
              }

            })

        socket.on('bingo37_Game drawingStarts', (msg) => {
          this.confetti.style.display = "none";
          this.confettiMobile.style.display = "none";

          this.lastBalance = this.props.demo ? null : this.props.realBalance;
          this.videoContainer.style.display = "block";
          this.videoImg.style.display = "none";
          console.log(msg);
          this.infoBlocks.step.innerHTML = this.props.t('DrawStarted');
          this.timeLine.step.innerHTML = this.props.t('DrawStarted');
          this.timeLine.stepMobile.innerHTML = this.props.t('DrawStarted');
          this.timeLineProgress(msg.stepLimits, msg.timeLeft);
          this.infoBlocks.time.innerHTML = "00:" + (Math.floor(+msg.timeLeft/10)==0 ? '0'+msg.timeLeft : msg.timeLeft);
          this.infoBlocks.timeMobile.innerHTML = "00:" + (Math.floor(+msg.timeLeft/10)==0 ? '0'+msg.timeLeft : msg.timeLeft);
            // block table
            this.tableIsBlocked = true;
            // send bets
            socket.emit('bingo37_Game send-bets', {bets: this.getBets, demo: this.params.demo});

            // add current num to last
            if (this.infoBlocks.currentNumber.querySelector('.square')) {
              this.infoBlocks.lastNumbers.insertAdjacentHTML('afterbegin', this.infoBlocks.currentNumber.querySelector('.square').innerHTML);
              this.infoBlocks.lastNumbersMobile.insertAdjacentHTML('afterbegin', this.infoBlocks.currentNumberMobile.querySelector('.square').innerHTML);
            } else {
               this.infoBlocks.lastNumbers.insertAdjacentHTML('afterbegin',  this.infoBlocks.currentNumber.innerHTML);
              this.infoBlocks.lastNumbersMobile.insertAdjacentHTML('afterbegin',  this.infoBlocks.currentNumberMobile.innerHTML);
            }
            
            this.infoBlocks.currentNumber.innerHTML = '<span class="load"></span>';
            this.infoBlocks.currentNumberMobile.innerHTML = '<span class="load__Mobile"></span>';
            this.load = this.bingo37Container.querySelector('.load');
            this.loadMobile = this.bingo37Container.querySelector('.load__Mobile');
            setInterval(()=> {
              let nummm = Math.round(1 - 0.5 + Math.random() * (37 - 1 + 1));
              this.load.innerHTML = nummm;
              this.loadMobile.innerHTML = nummm;
            }, 50)
            this.params.onWinGetBalance();
          })

        socket.on('bingo37_Game acceptingBidsComingToEnd', (msg) => {
          this.confetti.style.display = "none";
          this.confettiMobile.style.display = "none";
          console.log(msg);
          this.tableIsBlocked = false;
          this.timeLineProgress(msg.stepLimits, msg.timeLeft);
          this.infoBlocks.step.innerHTML = this.props.t('BetsEnd');
          this.timeLine.step.innerHTML = this.props.t('BetsEnd');
          this.timeLine.stepMobile.innerHTML = this.props.t('BetsEnd');
          this.infoBlocks.time.innerHTML = "00:" + (Math.floor(+msg.timeLeft/10)==0 ? '0'+msg.timeLeft : msg.timeLeft);
          this.infoBlocks.timeMobile.innerHTML = "00:" + (Math.floor(+msg.timeLeft/10)==0 ? '0'+msg.timeLeft : msg.timeLeft);
        })

        socket.on('bingo37_Game error', (msg) => {
          console.log(msg);
          console.log("bingo37_Game error");
          this.tableIsBlocked = true;
          this.modalInfo.title.innerHTML = msg.title;
          this.modalInfo.text.innerHTML = msg.text;
          this.modalContainer.style.display = "flex";

          this.videoContainer.style.display = "none";
          this.modalVideoContainer.style.display = "none";
          this.videoImg.style.display = "block";

        })

        socket.on('bingo37_Game acceptingBidsInProcess', (msg) => {
          this.confetti.style.display = "none";
          this.confettiMobile.style.display = "none";
          console.log(msg);
          this.tableIsBlocked = false;
          this.timeLineProgress(msg.stepLimits, msg.timeLeft);
          this.infoBlocks.step.innerHTML = this.props.t('AcceptingBets');
          this.timeLine.step.innerHTML = this.props.t('AcceptingBets');
          this.timeLine.stepMobile.innerHTML = this.props.t('AcceptingBets');
          this.infoBlocks.time.innerHTML = "00:" + (Math.floor(+msg.timeLeft/10)==0 ? '0'+msg.timeLeft : msg.timeLeft);
          this.infoBlocks.timeMobile.innerHTML = "00:" + (Math.floor(+msg.timeLeft/10)==0 ? '0'+msg.timeLeft : msg.timeLeft);
          this.videoContainer.style.display = "none";
          this.modalVideoContainer.style.display = "none";
          this.videoImg.style.display = "block";
        })

        socket.on('bingo37_Game acceptingBidsStarts', (msg) => {
          console.log(msg);
          this.timeLineProgress(msg.stepLimits, msg.timeLeft);
            // block table
            this.tableIsBlocked = false;
            if (this.tableDOM.querySelector('.current-raffle-number')) {
              this.tableDOM.querySelector('.current-raffle-number').style.border = null;
              this.tableDOM.querySelector('.current-raffle-number').classList.remove('current-raffle-number');
            }

            this.confetti.style.display = "none";
            this.confettiMobile.style.display = "none";

            this.videoContainer.style.display = "none";
            this.modalVideoContainer.style.display = "none";
            this.videoImg.style.display = "block";

            this.infoBlocks.win.innerHTML = '0';
            this.infoBlocks.winMobile.innerHTML = '0';

            this.clearFinalList();
            this.infoBlocks.step.innerHTML = this.props.t('BettingBegun');
            this.timeLine.step.innerHTML = this.props.t('BettingBegun');
            this.timeLine.stepMobile.innerHTML = this.props.t('BettingBegun');
            this.infoBlocks.time.innerHTML = "00:" + (Math.floor(+msg.timeLeft/10)==0 ? '0'+msg.timeLeft : msg.timeLeft);
            this.infoBlocks.timeMobile.innerHTML = "00:" + (Math.floor(+msg.timeLeft/10)==0 ? '0'+msg.timeLeft : msg.timeLeft);

            if (!this.params.demo) this.infoBlocks.balance.style.color = "#FCFCFC";
            this.infoBlocks.win.style.color = "#FCFCFC";
            if (!this.params.demo) this.infoBlocks.balanceMobile.style.color = "#FCFCFC";
            this.infoBlocks.winMobile.style.color = "#FCFCFC";
            this.youWonContainer.style.animation = "none";
            this.youWonContainer.style.display = "none";
            this.youWonContainer.querySelector("span").style.animation = "none";

          })

        socket.on('bingo37_Game your-win', (msg) => {
          this.winAudio.play();
          console.log(msg);
          this.params.onWinGetBalance();
          this.infoBlocks.win.innerHTML = msg.win;
          this.infoBlocks.winMobile.innerHTML = msg.win;
          if (msg.win > 0) {
            this.youWonContainer.style.animation = "show-won-block 2.5s linear forwards";
            this.youWonContainer.style.display = "flex";
            this.youWonContainer.querySelector("span").style.animation = "show-won-span 2.5s linear forwards";
            this.confetti.style.display = "flex";
            this.confettiMobile.style.display = "flex";
          }
          if (this.infoBlocks.balance) this.infoBlocks.balance.innerHTML = +this.infoBlocks.balance.innerHTML + +msg.win;
          if (!this.params.demo) {
            if ((msg.win > 0) && (this.lastBalance < +this.infoBlocks.balance.innerHTML)) {
              this.infoBlocks.balance.style.color = "rgba(34, 139, 34, 1)";
              this.infoBlocks.balanceMobile.style.color = "greenyellow";
              this.infoBlocks.win.style.color = "rgba(34, 139, 34, 1)";
              this.infoBlocks.winMobile.style.color = "greenyellow";
            }
            if ((msg.win > 0) && (this.lastBalance > +this.infoBlocks.balance.innerHTML)) {
              this.infoBlocks.balance.style.color = "red";
              this.infoBlocks.balanceMobile.style.color = "red";
              this.infoBlocks.win.style.color = "rgba(34, 139, 34, 1)";
              this.infoBlocks.winMobile.style.color = "greenyellow";
            }
            if ((msg.win > 0) && (this.lastBalance == +this.infoBlocks.balance.innerHTML)) {
              this.infoBlocks.winMobile.style.color = "greenyellow";
              this.infoBlocks.win.style.color = "rgba(34, 139, 34, 1)";
            }
            if ((msg.win === 0) && (this.lastBalance > +this.infoBlocks.balance.innerHTML)) {
              this.infoBlocks.win.style.color = "red";
              this.infoBlocks.winMobile.style.color = "red";
              this.infoBlocks.balanceMobile.style.color = "red";
              this.infoBlocks.balance.style.color = "red";
            }
            this.lastBalance = +this.infoBlocks.balance.innerHTML
          } else {
            if (msg.win > 0) {
              this.infoBlocks.win.style.color = "rgba(34, 139, 34, 1)";
              this.infoBlocks.winMobile.style.color = "greenyellow";
            }
          }
        })
      }


      render() {
        return <div id = "Bingo37" ref = {el => this.el = el} />;
      }

    }

    export default hoistStatics(withTranslation()(Bingo37), Bingo37);