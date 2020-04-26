module.exports = function (autorun, queue) {
    this.running = false;
    this.autorun = autorun ? autorun : true;
    this.queue = queue ? queue : [];
    this.previousValue = undefined;
    this.add = function (cb) {
        this.queue.push(() => {
            const finished = new Promise((resolve, reject) => {
                const callbackResponse = cb();
                if (callbackResponse !== false) {
                    resolve(callbackResponse);
                } else {
                    reject(callbackResponse);
                }
            });

            finished.then(this.dequeue.bind(this), (() => { }));
        });

        if (this.autorun && !this.running) {
            this.dequeue();
        }

        return this;
    }

    this.dequeue = function () {
        this.running = this.queue.shift();

        if (this.running) {
            this.running();
        }

        return this.running;
    }

    this.queueLenght = function () {
        return this.queue.length;
    }

    this.next = function () {
        return this.dequeue;

    }
}

