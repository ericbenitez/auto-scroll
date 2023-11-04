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
		this.connection = this.state.onActiveChanged.connect((isActive) => this.onActiveChanged(isActive));
	}

	private onActiveChanged(isActive: boolean) {
		this.trove.clean();
		if (isActive) {
			const currentEditor = vscode.window.activeTextEditor;
			if (currentEditor) {
				const mockEvent: vscode.TextEditorSelectionChangeEvent = {
					textEditor: currentEditor,
					kind: vscode.TextEditorSelectionChangeKind.Command,
					selections: currentEditor.selections,
				};

				this.centerCursorInView(mockEvent);
			}

			const connection = vscode.window.onDidChangeTextEditorSelection((event) => {
				this.centerCursorInView(event);
			});

			this.trove.add(() => {
				connection.dispose();
			});
		}
	}

	private centerCursorInView(event: vscode.TextEditorSelectionChangeEvent): void {
		if (event.kind === vscode.TextEditorSelectionChangeKind.Keyboard) {
			if (event.textEditor && event.selections.length) {
				const centerOfViewport = vscode.TextEditorRevealType.InCenter;
				const range = new vscode.Range(event.selections[0].start, event.selections[0].end);
				event.textEditor.revealRange(range, centerOfViewport);
			}
		}
	}

	onDestroy(): void {
		this.trove.clean();
		this.connection.disconnect();
	}
}
