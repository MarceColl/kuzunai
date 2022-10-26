"use strict";
function isReclaimable(o) {
    return '__generation' in o;
}
class Pool {
    constructor() {
        this.objects = [];
    }
    // Reclaim recursively
    reclaim(obj) {
        for (const key in obj) {
            if (typeof obj[key] === 'object') {
                if (isReclaimable(obj[key])) {
                    obj[key].reclaim();
                }
                else {
                    this.reclaim(obj[key]);
                }
            }
        }
        if ('__generation' in obj) {
            obj['__generation'] += 1;
            this.objects.push(obj);
        }
    }
    new(...args) {
        let maybeObj = null;
        let generation = 0;
        const pool = this;
        if (this.objects.length > 0) {
            maybeObj = this.objects.pop();
            generation = maybeObj.__generation;
        }
        const obj = this.initializer(maybeObj, ...args);
        obj.__generation = generation;
        return new Proxy(obj, {
            get: (t, p) => {
                if (t.__generation !== generation) {
                    throw new Error('WRONG GENERATION');
                }
                if (p === 'reclaim') {
                    return () => pool.reclaim(t);
                }
                else {
                    return t[p];
                }
            }
        });
    }
    initializer(obj, ...args) {
        throw new Error('Unimplemented initializer');
    }
}
