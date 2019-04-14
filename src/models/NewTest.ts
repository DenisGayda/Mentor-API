import { MaxLength, MinLength, Property } from '@tsed/common';
import { Themes } from '../config/themes.enum';

export class NewTest {
	@Property()
	theme: Themes;
	
	@Property()
	question: string;
	
	@Property()
	correctAnswer: string;
	
	@Property()
	answers: string[];
	
	@MaxLength(13)
	@MinLength(13)
	id: string;
}
