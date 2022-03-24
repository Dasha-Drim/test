import {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';

import './index.scss';


Modal.setAppElement('#root');

let DropdownActionsModal = (props) => {
  /* PROPS:
  {
    buttonTextTrue
    actionTrue
  }
  ACTIONS:
    openModal
  */

  const [modalIsOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(props.isOpen);
  }, [props.isOpen])

  let openModal = () => setIsOpen(true);
  let closeModal = () => {
    props.onCancel();
    setIsOpen(false);
  }

  return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Dropdown Actions Modal"
        overlayClassName="DropdownActionsModal__Overlay"
        className="DropdownActionsModal__Content p-4"
      >
          <button className="btn btn-primary">hg</button>
      </Modal>
  );
}

export default DropdownActionsModal;