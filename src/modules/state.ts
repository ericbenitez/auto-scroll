import * as vscode from "vscode";
import { Signal } from "./signal";

export class State {
	private context: vscode.ExtensionContext;
	public readonly onEnabledChanged: Signal<[isEnabled: boolean]>;
	private enabled: boolean;

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
		this.onEnabledChanged = new Signal();

		const configuration = vscode.workspace.getConfiguration("auto-scroll");
		this.enabled = configuration.get<boolean>("enabled")!; // assertion because default = true in package.json

		this.connectEvents();
	}

	private connectEvents(): void {
		const connection = vscode.workspace.onDidChangeConfiguration((event) => {
			if (event.affectsConfiguration("auto-scroll")) {
				this.onDidChangeConfiguration();
			}
		});

		this.context.subscriptions.push(connection);
	}

	private onDidChangeConfiguration() {
		const configuration = vscode.workspace.getConfiguration("auto-scroll");
		this.enabled = configuration.get<boolean>("enabled")!;
		this.onEnabledChanged.fire(this.enabled);
	}

	public isEnabled(): boolean {
		return this.enabled;
	}

	public toggleConfiguration() {
		const configuration = vscode.workspace.getConfiguration("auto-scroll");
		configuration.update("enabled", !this.enabled);
	}
}
