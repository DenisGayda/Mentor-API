import { BodyParams, Controller, Delete, Get, Post, Required } from '@tsed/common';
import { User } from '../models/User';
import { FirebaseService } from '../services/Firebase.service';
import { Collections } from '../config/collections.enum';
import { PasswordInterface } from '../config/password.interface';
import { Auth } from '../models/Auth';
import { RoleInterface } from '../config/role.interface';

@Controller("/user")
export class UserCtrl {
	constructor(private firebaseService: FirebaseService) {}
	
	@Get("/")
	async getUsers(): Promise<User[]> {
		return this.firebaseService.getItems<User>(Collections.USERS);
	}
	
	@Post("/")
	async createUser(@Required() @BodyParams("user") user: User): Promise<PasswordInterface> {
		const id = Date.now().toString(36).slice(-8);
		const password = Math.random().toString(36).slice(-8);
		const newUser: User = {
			...user,
			password,
			id,
		};
		
		return this.firebaseService.setItem<User>(Collections.USERS, id, newUser)
			.then(() => ({password}));
	}
	
	@Post("/auth")
	async auth(@Required() @BodyParams("auth") auth: Auth): Promise<RoleInterface | {}> {
		return this.firebaseService.getItems<User>(Collections.USERS).then((users: User[]) => {
			const user = users.find(({password, email}: User) => email === auth.email && password === auth.password);
			
			return Promise.resolve(user ? {role: user.role} : {})
		})
	}
	
	@Delete("/")
	async deleteItem(@BodyParams("user.id") @Required() id: string
	): Promise<{id: string}> {
		return this.firebaseService.deleteItem(Collections.USERS, id)
			.then(() => Promise.resolve({id}))
	}
}
