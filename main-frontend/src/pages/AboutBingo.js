import { useTranslation } from 'react-i18next'
// components
import HeadAboutGame from "../blocks/HeadAboutGame/HeadAboutGame";
import Description from "../blocks/Description/Description";
import TopWins from "../blocks/TopWins/TopWins";

import './AboutBingo.scss';

const AboutBingo = (props) => {
	// AUTH METHOD
	let auth = props.useAuth();
	// END OF AUTH METHOD
	const { t } = useTranslation()
	return (
		<div className="AboutBingo">
			<HeadAboutGame game="bingo37" title={t('bingo_37_title')} role={auth.userType}/>
			<div className="container-fluid">
				<div className="row m-0 px-1 px-md-4 py-5">
					<div className="col-12 col-lg-7">
						<div className="row m-0">
							<div className="col-12 p-0 mb-4">
								<Description title={t('description')} description={t('description_bingo_37')}/>
							</div>
							<div className="col-12 p-0 mb-4 mb-lg-0">
								<Description title={t('rules')} description={t('rules_bingo_37')} />
							</div>
						</div>
					</div>
					<div className="col-12 col-lg-5">
						<TopWins />
					</div>
				</div>
			</div>
		</div>
	);
};

export default AboutBingo;
