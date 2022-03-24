import './HeadBlock.scss';

const HeadBlock = (props) => {
	return (
		<div className="HeadBlock">
			<div className="container-fluid">
				<div className="row py-2 m-0">
					<div className="col-10 offset-1 py-6">
						<h2>{props.title}</h2>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HeadBlock;
