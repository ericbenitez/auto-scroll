export type Connection = {
	disconnect: () => void;
};

export class Signal<T extends any[]> {
	private listeners: Array<(...args: T) => void> = [];

	private add(listener: (...args: T) => void) {
		this.listeners.push(listener);
	}

	private remove(listener: (...args: T) => void) {
		const index = this.listeners.indexOf(listener);
		if (index >= 0) {
			this.listeners.splice(index, 1);
		}
	}

	public fire(...args: T) {
		Promise.allSettled(
			this.listeners.map(async (listener) => {
				return Promise.resolve().then(() => listener(...args));
			}),
		);
	}

	public connect(callback: (...args: T) => void): Connection {
		this.add(callback);
		return {
			disconnect: () => this.remove(callback),
		};
	}
}
