import { Connection } from "./signal";

type Trackable = Connection | ((...args: unknown[]) => unknown) | Promise<unknown>;

interface Track {
	obj: Trackable;
	cleanup: string;
}

const FN_MARKER = "__trove_fn_marker__";
const PROMISE_MARKER = "__trove_promise_marker__";

export class Trove {
	private objects: Track[] = [];
	private cleaning = false;

	public add<T extends Trackable>(obj: T): T {
		if (this.cleaning) {
			throw new Error("Cannot add objects while cleaning");
		}

		const cleanup = this.getObjCleanupFn(obj);
		this.objects.push({ obj, cleanup });
		return obj;
	}

	private getObjCleanupFn<T extends Trackable>(obj: T): string {
		if (typeof obj === "function") {
			return FN_MARKER;
		} else if ("disconnect" in obj) {
			return "disconnect";
		} else if (obj instanceof Promise) {
			return PROMISE_MARKER;
		}
		throw new Error("Unsupported object type");
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

	private cleanupObj(track: Track) {
		if (track.cleanup === FN_MARKER) {
			(track.obj as () => void)();
		} else if (track.cleanup === PROMISE_MARKER && "cancel" in track.obj) {
			(track.obj as any).cancel();
		} else {
			(track.obj as any)[track.cleanup]();
		}
	}
}
