import './Description.scss';

const Description = (props) => {
	return (
		<div className="Description p-3">
			<h4 className="mb-2">{props.title}</h4>
			<div className="Description__text" dangerouslySetInnerHTML={{ __html: props.description }}></div>
		</div>
	);
};

export default Description;
