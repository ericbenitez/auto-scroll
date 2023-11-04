import * as vscode from "vscode";
import { Service } from "./core/service";
import { State } from "./modules/state";
import CommandService from "./services/command";
import ScrollService from "./services/scroll";
import StatusBarService from "./services/statusBar";

const services: Service[] = [];

export async function activate(context: vscode.ExtensionContext) {
	const state = new State();

	services.push(new CommandService(context, state));
	services.push(new ScrollService(context, state));
	services.push(new StatusBarService(context, state));

	for (const service of services) {
		if ("onInit" in service && typeof service["onInit"] === "function") {
			service.onInit();
		}
	}

	services.forEach(async (service) => {
		if ("onStart" in service && typeof service["onStart"] === "function") {
			service.onStart();
		}
	});
}

export function deactivate() {
	services.forEach(async (service) => {
		if ("onDestroy" in service && typeof service["onDestroy"] === "function") {
			service.onDestroy();
		}
	});
}
