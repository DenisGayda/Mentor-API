import { Property } from '@tsed/common';

export class Test {
	@Property()
	question: string;
	
	@Property()
	answers: string[];
	
	@Property()
	id: string;
}
