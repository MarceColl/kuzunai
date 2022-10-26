declare type Reclaimable<T> = T & {
    reclaim: (t: T) => void;
    __generation: number;
};
declare function isReclaimable<T>(o: object): o is Reclaimable<T>;
declare class Pool<T> {
    objects: Array<Reclaimable<T>>;
    constructor();
    reclaim(obj: any): void;
    new(...args: any[]): Reclaimable<T>;
    initializer(obj: Reclaimable<T> | null, ...args: any[]): Reclaimable<T>;
}
