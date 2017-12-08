const context: Worker = <any>self;

context.addEventListener("message", (e: MessageEvent) => {
    console.log(`Worker received: ${e.data}`);
});
