
export class PerformanceTracker {

    tracked: {[name: string]: number};

    constructor() {
        this.tracked = {};
    }

    clearTracker() {
        this.tracked = {};
    }

    timer(name: string) {
        return (func: Function, context) => {
            let tracker = this;
            return function wraps(...args) {
                let startTime: number = new Date().getTime();
                let result = func.apply(context, args);
                let elapsed: number = new Date().getTime() - startTime;
                tracker.tracked[name] = elapsed;
                return result;
            }
        }
    }
}


