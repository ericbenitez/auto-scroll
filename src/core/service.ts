import * as vscode from "vscode";
import { State } from "../modules/state";

export interface OnInit {
	onInit(): void;
}

export interface OnStart {
	onStart(): void;
}

export interface OnDestroy {
	onDestroy(): void;
}

export class Service {
	public readonly context: vscode.ExtensionContext;
	public readonly state: State;

	constructor(context: vscode.ExtensionContext, state: State) {
		this.context = context;
		this.state = state;
	}
}
