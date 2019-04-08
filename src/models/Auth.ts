import { Property } from '@tsed/common';

export class Auth {
	@Property()
	email: string;
	
	@Property()
	password: string;
}
