import SliderMain from './slider-main';
import SliderInfo from './slider-info';
import SliderStrategy from './slider-strategy';
import Tabs from './tabs';
import SliderDocs from './slider-docs';
import SliderTeam from './slider-team';
import SliderTabs from './slider-icon-tabs';
import SliderLogo from './slider-logos';
import SliderPeriod from './slider-period';
import SliderPress from './slider-press';
import SliderComment from './slider-comment';
import SliderPhoto from './slider-photo';
import SliderSimilar from './slider-similar';
import SliderFacilities from './slider-facilities';


export default {
	init() {
		
		new SliderMain();
		new SliderInfo();

		Tabs.init();
		SliderDocs.init();
		SliderTeam.init();
		SliderTabs.init();
		SliderComment.init();
		
		SliderLogo.init();
		SliderPeriod.init();
		SliderPress.init();
		SliderSimilar.init();
		SliderFacilities.init();
		new SliderStrategy();


	
			SliderPhoto.init();
		
	},
};
