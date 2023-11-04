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
		this.enabled = configuration.get<boolean>("enabled") ?? true;

		this.connectEvents();
	}

	private connectEvents(): void {
		const connection = vscode.workspace.onDidChangeConfiguration((event) => {
			if (event.affectsConfiguration("auto-scroll")) {
				this.onConfigurationChange();
			}
		});

		this.context.subscriptions.push(connection);
	}

	private onConfigurationChange() {
		const configuration = vscode.workspace.getConfiguration("auto-scroll");
		this.enabled = configuration.get<boolean>("enabled") ?? true;
		this.onEnabledChanged.fire(this.enabled);
	}

	public isEnabled(): boolean {
		return this.enabled;
	}

	public toggleEnabled() {
		this.enabled = !this.enabled;
		const configuration = vscode.workspace.getConfiguration("auto-scroll");
		configuration.update("enabled", this.enabled);
		this.onEnabledChanged.fire(this.enabled);
	}
}
