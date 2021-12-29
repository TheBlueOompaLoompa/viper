export type User = {
	uid: string,
	display: string,
	username: string,
	created: number,
	modified: number
};

export default {
    getUser: async (uid: string) => {
        const resp = await fetch(`/api/user?uid=${uid}`, {method: 'GET'});
        return await resp.json();
    },
    setupUser: async (uid: string, username: string, display: string): Promise<Number> => {
        const resp = await fetch(`/api/user?uid=${uid}&display=${encodeURIComponent(display)}&username=${encodeURIComponent(username)}`, {method: 'POST'});
        return parseInt(await resp.text());
    }
};