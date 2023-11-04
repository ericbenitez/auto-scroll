import * as vscode from "vscode";
import { OnDestroy, OnInit, Service } from "../core/service";
import { Connection } from "../modules/signal";
import { Trove } from "../modules/trove";

export default class ScrollService extends Service implements OnInit, OnDestroy {
	private trove: Trove;
	private connection: Connection;

	onInit(): void {
		this.trove = new Trove();
		this.connectEvents();
	}

	private connectEvents(): void {
		this.connection = this.state.onEnabledChanged.connect((isEnabled) => this.onEnabledChanged(isEnabled));
		this.onEnabledChanged(this.state.isEnabled());
	}

	private onEnabledChanged(isEnabled: boolean) {
		this.trove.clean();
		if (isEnabled) {
			const connection = vscode.window.onDidChangeTextEditorSelection((event) => {
				this.centerCursorInView(event);
			});

			this.trove.add(() => {
				connection.dispose();
			});
		}
	}

	private centerCursorInView(event: vscode.TextEditorSelectionChangeEvent): void {
		const notMouse = event.kind !== vscode.TextEditorSelectionChangeKind.Mouse;
		const textEditor = event.textEditor;
		const length = event.selections.length;

		if (notMouse && textEditor && length) {
			const centerOfViewport = vscode.TextEditorRevealType.InCenter;
			const range = new vscode.Range(event.selections[0].start, event.selections[0].end);
			event.textEditor.revealRange(range, centerOfViewport);
		}
	}

	onDestroy(): void {
		this.trove.clean();
		this.connection.disconnect();
	}
}
