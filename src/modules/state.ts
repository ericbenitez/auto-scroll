import { Signal } from "./signal";

export class State {
	private active: boolean;
	public readonly onActiveChanged: Signal<[isActive: boolean]>;

	constructor() {
		this.active = false;
		this.onActiveChanged = new Signal();
	}

	public isActive(): boolean {
		return this.active;
	}

	public toggleActive() {
		this.active = !this.active;
		this.onActiveChanged.fire(this.active);
	}
}
