type Callback = (...args: unknown[]) => unknown;

export class Trove {
	private objects: Callback[] = [];
	private cleaning = false;

	public add<T extends Callback>(obj: T): T {
		if (this.cleaning) {
			throw new Error("Cannot add objects while cleaning");
		}

		this.objects.push(obj);
		return obj;
	}

	public clean() {
		if (this.cleaning) return;
		this.cleaning = true;
		for (const track of this.objects) {
			this.cleanupObj(track);
		}
		this.objects = [];
		this.cleaning = false;
	}

	private cleanupObj(track: Callback) {
		track();
	}
}
