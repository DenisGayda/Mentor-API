import { Service } from '@tsed/common';
import { firestore }  from 'firebase-admin';
import { Collections } from '../config/collections.enum';
import Firestore = firestore.Firestore;
import DocumentReference = firestore.DocumentReference;
import WriteResult = FirebaseFirestore.WriteResult;
import QuerySnapshot = firestore.QuerySnapshot;
import { Themes } from '../config/themes.enum';
import { NewTest } from '../models/NewTest';
import { AnswerInterface } from '../config/answer.interface';
import { Test } from '../models/Test';

@Service()
export class FirebaseService {
	private store: Firestore;

	constructor() {
		this.store = firestore();
	}
	
	public getItems<T>(collectionType: Collections): Promise<T[]> {
		return this.store.collection(collectionType).get().then((snapshot) => {
			const items = [];
			snapshot.forEach((doc) => items.push(doc.data()));
			
			return items;
		});
	}
	
	public getDoc<T>(collectionType: Collections, doc: string): Promise<T[]> {
		return this.store.collection(collectionType).doc(doc).get().then((doc) => {
			return Promise.resolve(<T[]>doc.data());
		});
	}
	
	public setTest(document: Themes, test: NewTest): Promise<NewTest> {
		const collections = Collections.TESTS;
		const ref: DocumentReference = this.store.collection(collections).doc(document);
		
		const answer: AnswerInterface = {
			[test.id]: test.correctAnswer
		};
		
		return ref.collection('items').doc(test.id).set(test)
			.then(() => ref.collection('answers').doc(test.id).set(answer))
			.then(() => Promise.resolve(test))
			.catch(() => Promise.reject('invalid'))
	}
	
	public getTest(theme: Themes, count = 3): Promise<Test[]> {
		const collections = Collections.TESTS;
		const ref: DocumentReference = this.store.collection(collections).doc(theme);
		
		return ref.collection('items').get().then((snapshot: QuerySnapshot) => {
			const items: Test[] = [];
			snapshot.forEach((doc) => {
				const {id, answers, question} = <NewTest>doc.data();

				items.push({id, answers, question})
			});
			
			return items.sort(() => Math.random() > 0.5 ? 1 : -1).slice(0, count);
		});
	}
	
	public getAnswers(theme: Themes): Promise<AnswerInterface> {
		const collections = Collections.TESTS;
		const ref: DocumentReference = this.store.collection(collections).doc(theme);
		
		return ref.collection('answers').get().then((snapshot: QuerySnapshot) => {
			let answers: AnswerInterface = {};
			snapshot.forEach((doc) => answers = {...answers, ...doc.data()});
			
			return answers;
		});
	}

	public setItem<T>(collectionType: Collections, id: string, item: T): Promise<T> {
		const ref: DocumentReference = this.store.collection(collectionType).doc(id);
		
		return ref.set(item)
			.then(() => Promise.resolve(item))
			.catch(() => Promise.reject('invalid'))
	}
	
	public deleteItem(collectionType: string, id: string): Promise<WriteResult> {
		return this.store.collection(collectionType).doc(id).delete();
	}
}
