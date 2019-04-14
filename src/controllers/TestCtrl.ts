import { BodyParams, Controller, Get, Post, QueryParams, Required } from '@tsed/common';
import { FirebaseService } from '../services/Firebase.service';
import { NewTest } from '../models/NewTest';
import { Themes } from '../config/themes.enum';
import { Test } from '../models/Test';
import { AnswerInterface } from '../config/answer.interface';

@Controller("/test")
export class TestCtrl {
	constructor(private firebaseService: FirebaseService) {}
	
	@Get("/")
	async getTest(@QueryParams('theme') theme: Themes): Promise<Test[]> {
		return this.firebaseService.getTest(theme);
	}
	
	@Post("/")
	async createTest(@Required() @BodyParams("test") test: NewTest): Promise<NewTest> {
		const id = Date.now().toString(36).slice(-8);
		const newTest: NewTest = {
			...test,
			id,
		};
		
		return this.firebaseService.setTest(newTest.theme, newTest)
	}
	
	@Post("/result")
	async auth(
		@Required() @QueryParams('theme') theme: Themes,
		@Required() @BodyParams("result") result: AnswerInterface,
	): Promise<{result: string}> {
		return this.firebaseService.getAnswers(theme)
			.then((answers: AnswerInterface) => {
				const resultList = Object.keys(result);
				const countCorrectAnswer = resultList.filter((id: string) => answers[id] === result[id]).length;
				
				console.log(result, answers, countCorrectAnswer);
				const percent = Math.round(100 / resultList.length * countCorrectAnswer);
			
			return Promise.resolve({result: percent + '%'})
		})
	}
}
