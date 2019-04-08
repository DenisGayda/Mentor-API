import { MaxLength, MinLength, Property } from '@tsed/common';

export class User {
	@Property()
	firstName: string;
	
	@Property()
	lastName: string;
	
	@Property()
	email: string;
	
	@MaxLength(8)
	@MinLength(8)
	password: string;
	
	@Property()
	role: string;
	
	@MaxLength(13)
	@MinLength(14)
	id: string;
}
