declare module "worker-loader?name=[name].js!*" {
    class WebpackWorker extends Worker {
        constructor();
    }

    export = WebpackWorker;
}
