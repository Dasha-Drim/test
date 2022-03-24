import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import DropdownActionsModal from '../../utils/modal/DropdownActionsModal';
import { roleAdapter } from '../../packages/storage';

import ChevronDownIcon from './ChevronDownIcon';

import './index.scss';

const Header = (props) => {
	/* PROPS:
	props.useAuth
	*/

	const auth = props.useAuth();
	const navigate = useNavigate();

	const wrapperRef = useRef(null);
	const startRef = useRef(null);

    let [isDropdownOpen, setIsDropdownOpen] = useState(false);
    let [role, setRole] = useState(null)

    let showDropdown = () => {
    	setIsDropdownOpen(actual => !actual);
    }

    let closeDropdown = () => {
    	setIsDropdownOpen(false);
    }

	useEffect(() => {
        function handleClickOutside(event) {
            if ((wrapperRef.current && !wrapperRef.current.contains(event.target))
            	&& (startRef.current && !startRef.current.contains(event.target))) {
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

    useEffect(() => {
    	roleAdapter.getRole().then(result => {
	      	setRole(result)
	    })
    }, [])

	
	let logOut = () => {
		auth.signout(() => {
			navigate("/");
		})
	}

	return (
		<div className="Header row">
				<div className="col-12 py-2 d-flex justify-content-center justify-content-lg-between">
					<nav className="d-none d-lg-block" aria-label="breadcrumb">
						<ol className="breadcrumb">
							{props.breadcrumbs.map(({match, breadcrumb}, key, arr) => (
						    	<li key={match.pathname} className={"breadcrumb-item "+((key === arr.length-1) ? "active" : "")} aria-current={(key === arr.length-1) ? "page" : undefined}>
						    		{key !== arr.length-1 ?
						    		<Link to={match.pathname}>{breadcrumb}</Link>
						    		: breadcrumb }
						    	</li>
							))}
						</ol>
					</nav>
					<div className="position-relative">
						<button ref={startRef} onClick={() => showDropdown()}>	
							<span className="me-2">{role === "operator" ? "Оператор" : role === "manager" ? "Управляющий" : role === "franchisee" ? "Франчайзи" : ""}</span>
							<span className={isDropdownOpen ? "rotate" : ""}><ChevronDownIcon /></span>
						</button>
						<div ref={wrapperRef} className={"select-list py-1 mt-2 position-absolute "+(isDropdownOpen ? "d-flex" : "d-none")}>
							<button onClick={logOut} className="w-100 d-block text-start py-1 px-3 select-list__item">Выйти из аккаунта</button>
						</div>
					</div>
				</div>
			</div>
	);
}

export default Header;