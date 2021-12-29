import type { MongoClient, Db } from 'mongodb';
import { MongoClient as MClient } from 'mongodb';
import type { User } from './api';

export default class {
	private client: MongoClient;
	private db: Db;

	constructor(uri: string) {
		this.client = new MClient(uri);
		this.client.connect();
	}

	/*
	 * User functions
	*/

	async createUser(uid: string, username: string, display: string): Promise<number> {
		let code = 0;

		const cursor = this.db.collection('users').find({ $or: [{uid}, {username}]}); // Check for any existing values
		const resp = await cursor.toArray();

		resp.forEach(doc => {
			if(doc.uid == uid) {
				code = code | 0xb01;
			}
			if(doc.username == username) {
				code = code | 0xb10;
			}
		});

		return code;
	}

	async getUser(uid: string): Promise<User | undefined> {
		const resp = await this.db.collection('users').findOne({uid});
		return resp ? resp as User : undefined;
	}

	async updateUser(uid: string, data: any): Promise<void> {

	}
}