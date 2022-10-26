import Pool from './kuzu';

type BasicType = {
    holi: 12;
}

class BasicTypePool extends Pool<BasicType> {
    initializer(obj: (BasicType & { reclaim: (t: BasicType) => void; __generation: number; }) | null, ...args: any[]): BasicType & { reclaim: (t: BasicType) => void; __generation: number; } {
       if (!obj) {
           return {

           }
       }
    }
}

describe('Pool', () => {
    it('works', () => {
        const p = new Pool<
    })
})
