import { Signal } from "./signal";

export const onActiveChanged = new Signal<[isActive: boolean]>();
