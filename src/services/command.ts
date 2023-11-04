import * as vscode from "vscode";
import { OnInit, Service } from "../core/service";

export default class CommandService extends Service implements OnInit {
	onInit(): void {
		const disposable = vscode.commands.registerCommand("auto-scroll.toggle", () => {
			this.state.toggleEnabled();
		});

		this.context.subscriptions.push(disposable);
	}
}
