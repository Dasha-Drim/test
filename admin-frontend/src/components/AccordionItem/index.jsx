import {useState} from 'react';

const AccordionItem = (props) => {
	const [activeState, setActiveState] = useState(false);
	/* PROPS:
	props.title
	props.status
	props.content
	*/
	let toggleAccordion = () => {
		setActiveState(actual => !actual);
	}

	return (
		<div className="accordion-item">
			<h2 className="accordion-header" id="headingOne" onClick={() => toggleAccordion()}>
				<button className={"accordion-button "+ (!activeState ? "collapsed" : "")} type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
					<span>{props.title}</span>
					{props.status === "ok" ?
						<span className="ms-2 badge bg-success">Работает</span>
					:
						<span className="ms-2 badge bg-danger">Не работает</span>
					}
					
				</button>
			</h2>
			{activeState ?
				<div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
					<div className="accordion-body">
						{props.children}
					</div>
				</div>
			: ""}
		</div>
	);
}

export default AccordionItem;