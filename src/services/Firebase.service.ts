import { Service } from '@tsed/common';
import { firestore }  from 'firebase-admin';
import { Collections } from '../config/collections.enum';
import Firestore = firestore.Firestore;
import DocumentReference = firestore.DocumentReference;
import WriteResult = FirebaseFirestore.WriteResult;


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
	
	public setItem<T>(collectionType: Collections, id: string, item: T): Promise<T> {
		const ref: DocumentReference = this.store.collection(collectionType).doc(id);
		
		return ref.set(item)
			.then(() => Promise.resolve(item))
			.catch(() => Promise.reject('invalid'))
	}
	
	public deleteItem(collectionType: Collections, id: string): Promise<WriteResult> {
		return this.store.collection(collectionType).doc(id).delete();
	}
}
