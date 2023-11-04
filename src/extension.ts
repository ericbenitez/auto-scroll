import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { Service } from "./core/service";
import { State } from "./modules/state";

const services: Service[] = [];

export async function activate(context: vscode.ExtensionContext) {
	const servicesFolderPath = path.join(__dirname, "services");
	const state = new State();

	const files = fs.readdirSync(servicesFolderPath);
	for (const file of files) {
		if (file.endsWith(".js")) {
			const servicePath = new URL(`file://${path.join(__dirname, "services", file)}`).href;
			const serviceModule = await import(servicePath);
			const ServiceClass = serviceModule.default.default as typeof Service;
			const service = new ServiceClass(context, state);
			services.push(service);
		}
	}

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
