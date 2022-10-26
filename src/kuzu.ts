type Reclaimable<T> = T & { reclaim: (t: T) => void, __generation: number };

function isReclaimable<T>(o: object): o is Reclaimable<T> {
  return '__generation' in o;
}

export default class Pool<T> {
  objects: Array<Reclaimable<T>>;

  constructor() {
    this.objects = [];
  }

  // Reclaim recursively
  reclaim(obj: any) {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        if (isReclaimable(obj[key])) {
          obj[key].reclaim();
        } else {
          this.reclaim(obj[key]);
        }
      }
    }

    if ('__generation' in obj) {
      obj['__generation'] += 1;
      this.objects.push(obj);
    }
  }

  new(...args: any[]): Reclaimable<T> {
    let maybeObj = null;
    let generation = 0;
    const pool = this;

    if (this.objects.length > 0) {
      maybeObj = this.objects.pop() as Reclaimable<T>;
      generation = maybeObj.__generation;
    }

    const obj: Reclaimable<T> = this.initializer(maybeObj, ...args);
    obj.__generation = generation;

    return new Proxy<Reclaimable<T>>(obj, {
      get: (t: Reclaimable<T>, p: string | symbol) => {
        if (t.__generation !== generation) {
          throw new Error('WRONG GENERATION');
        }

        if (p === 'reclaim') {
          return () => pool.reclaim(t);
        } else {
          return t[p as keyof Reclaimable<T>];
        }
      }
    })
  }

  initializer(obj: Reclaimable<T> | null, ...args: any[]): Reclaimable<T> {
    throw new Error('Unimplemented initializer');
  }
}
