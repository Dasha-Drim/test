import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import DropdownActionsModal from '../../utils/modal/DropdownActionsModal';

import ChevronDownIcon from './ChevronDownIcon';

import './index.scss';

const Dropdown = (props) => {

	/*
	props.variants [
		{action: function, name: string}
	]
    props.name
	*/


	const wrapperRef = useRef(null);
	const startRef = useRef(null);

    let [isDropdownOpen, setIsDropdownOpen] = useState(false);

    let showDropdown = () => {
    	setIsDropdownOpen(actual => !actual);
    }

    let closeDropdown = () => {
    	setIsDropdownOpen(false);
    }

    let handleClickOnVariantItem = (action) => {
    	action();
    	closeDropdown();
    }


	useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if ((wrapperRef.current && !wrapperRef.current.contains(event.target))
            	&& (startRef.current && !startRef.current.contains(event.target))) {
                console.log("close");
                closeDropdown();
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef, startRef]);


	return (
		<div className="Dropdown position-relative">
			<button ref={startRef} onClick={() => showDropdown()} className="select-start btn btn-secondary d-flex align-items-center">
				<span className="me-2">{props.name}</span>
				<ChevronDownIcon />
			</button>
			<div ref={wrapperRef} className={"select-list py-1 mt-2 position-absolute "+(isDropdownOpen ? "d-flex" : "d-none")}>
				{props.variants.map((item,key) =>
					<button key={key} onClick={() => handleClickOnVariantItem(item.action)} className="w-100 d-block text-start py-1 px-3 select-list__item">{item.name}</button>
				)}
			</div>
		</div>
	);
}

export default Dropdown;
// <span className={isDropdownOpen ? "rotate" : ""}><ChevronDownIcon /></span>