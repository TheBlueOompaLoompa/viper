import type { MongoClient } from 'mongodb';
import { MongoClient as MClient } from 'mongodb';


export default class {
	private client: MongoClient;

	constructor(uri: string) {
		this.client = new MClient(uri);
	}
}