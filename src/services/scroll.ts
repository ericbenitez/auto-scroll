import * as vscode from "vscode";
import { OnDestroy, OnInit, Service } from "../core/service";
import { Trove } from "../modules/trove";

export default class ScrollService extends Service implements OnInit, OnDestroy {
	private trove: Trove;

	onInit(): void {
		this.trove = new Trove();
		this.connectEvents();
	}

	private connectEvents(): void {
		const connection = this.state.onActiveChanged.connect((isActive) => this.onActiveChanged(isActive));
		this.trove.add(() => {
			connection.disconnect();
		});
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

	private centerCursorInView(e: vscode.TextEditorSelectionChangeEvent): void {
		if (e.textEditor && e.selections.length) {
			const centerOfViewport = vscode.TextEditorRevealType.InCenter;
			const range = new vscode.Range(e.selections[0].start, e.selections[0].end);
			e.textEditor.revealRange(range, centerOfViewport);
		}
	}

	onDestroy(): void {
		this.trove.clean();
	}
}
