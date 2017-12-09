import {KomodiContext} from "./context";

const worker: Worker = <any>self;

const context: KomodiContext = new KomodiContext();

worker.addEventListener("message", (e: MessageEvent) => {
    context.module.clear();
    context.serializer.deserializeProgram(e.data);
    console.log('Deserialization OK');

    let moduleResult = context.module.getModuleList().userModule;
    console.log(`Module list is: ${moduleResult}`);
});
