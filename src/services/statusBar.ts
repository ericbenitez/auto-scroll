import * as vscode from "vscode";
import { OnDestroy, OnInit, Service } from "../core/service";
import { Trove } from "../modules/trove";

export default class StatusBarService extends Service implements OnInit, OnDestroy {
	private statusBarItem: vscode.StatusBarItem;
	private trove: Trove;

	onInit(): void {
		this.trove = new Trove();

		this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
		this.statusBarItem.text = `Auto Scroll: ${this.state.isEnabled() ? "ON" : "OFF"}`;
		this.context.subscriptions.push(this.statusBarItem);

		this.statusBarItem.show();
		this.connectEvents();
	}

	private connectEvents(): void {
		const connection = this.state.onEnabledChanged.connect((isEnabled) => {
			this.statusBarItem.text = `Auto Scroll: ${isEnabled ? "ON" : "OFF"}`;
		});

		this.trove.add(() => {
			connection.disconnect();
		});
	}

	onDestroy(): void {
		this.trove.clean();
	}
}
