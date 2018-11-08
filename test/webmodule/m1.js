import { m2number } from "./m2.js";

export class m1 {
	constructor(data) {
		Object.assign(this, data);
		if (!this.id) {
			this.id = new Date().getTime().toString();
		}
	}
}

export let counter = 2;

export function count() {
	counter++;
}