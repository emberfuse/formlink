import { arrayWrap, isArray, isFile, merge, cloneDeep } from '@/util';

describe('util', () => {
    test('wrap value if not an array', () => {
        expect(arrayWrap('foo')).toEqual(['foo']);
        expect(arrayWrap(['foo'])).toEqual(['foo']);
        expect(arrayWrap({ foo: 'bar' })).toEqual([{ foo: 'bar' }]);
    });

    test('determine if given variable is of type array', () => {
        const response = ['message'];
        expect(isArray(response)).toBeTruthy();
    });

    test('determine if given variable is a file', () => {
        const fileValue = new File([new Uint8Array(10)], { type: 'image/png' });
        expect(isFile(fileValue)).toBeTruthy();
    });

    test('Merge an object with another', () => {
        let objA = { foo: 'bar' };
        let objB = { bar: 'baz' };

        merge(objA, objB);

        expect(objA).toEqual({
            foo: 'bar',
            bar: 'baz',
        });
    });

    test('Make an exact clone of the original variable value', () => {
        const obj = { a: { b: { c: 1 } } };
        const copy = cloneDeep(obj);
        obj.a.b.c = 2;

        expect(copy.a.b.c).toBe(1);
        expect(copy).toEqual({ a: { b: { c: 1 } } });
    });
});
