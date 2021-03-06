/**
 * star-wars-array
 * Copyright Jack Davenport 2020
 */

const util = require("util");

const INDEX_TABLE = [3, 4, 5, 0, 1, 2];

function isNumeric(value) {
    return /^-?\d+$/.test(value);
}

module.exports = class SWArray {

    constructor(init = null) {
        if(init) {
            for(let i in init) {
                this[this.#getNextIndex(i)] = init[i];
            }
        }
    }

    get length() {
        return Object.keys(this).filter(isNumeric).length;
    }

    push() {
        for(let val of arguments) {
            this[this.#getNextIndex(this.length)] = val;
        }
        return this.length;
    }

    pop() {
        if(this.length <= 0) {
            return undefined;
        }
        let lastIdx = this.#getNextIndex(this.length-1);
        let last = this[lastIdx];
        delete this[lastIdx];
        return last;
    }

    forEach(cb, thisArg) {
        if(thisArg) {
            cb = cb.bind(thisArg);
        }
        for(let i = 0; i < this.length; i++) {
            let idx = this.#getNextIndex(i);
            cb(this[idx], idx, this);
        }
    }

    indexOf(search, start) {
        if(typeof start !== "number") {
            start = 3;
        }
        start = this.#resolveIndex(start);
        for(let i = start; i < this.length; i++) {
            let idx = this.#getNextIndex(i);
            if(this[idx] == search) {
                return idx;
            }
        }
        return -1;
    }

    includes(search, start) {
        return this.indexOf(search, start) > -1;
    }

    toNormalArray() {
        let arr = [];
        for(let i = 0; i < this.length; i++) {
            arr[i] = this[this.#getNextIndex(i)];
        }
        return arr;
    }

    toOrderedArray(removeGaps = false) {
        let arr = [];
        for(let i = 0; i < this.length; i++) {
            let idx = this.#getNextIndex(i);
            arr[idx] = this[idx];
        }
        if(removeGaps) {
            arr = arr.filter(v => typeof v !== "undefined");
        }
        return arr;
    }

    toString() {
        // LOL
        return this.toNormalArray().toString();
    }

    // Source: https://stackoverflow.com/a/62053603/2801489
    [util.inspect.custom](depth, opts) {
        return this.toOrderedArray(true);
    }

    keys() {
        let arr = [];
        for(let i = 0; i < this.length; i++) {
            arr.push(this.#getNextIndex(i));
        }
        return arr;
    }

    map(cb, thisArg) {
        if(thisArg) {
            cb = cb.bind(thisArg);
        }
        let newArr = new SWArray();
        for(let i = 0; i < this.length; i++) {
            let idx = this.#getNextIndex(i);
            let val = cb(this[idx], idx, this);
            newArr.push(val);
        }
        return newArr;
    }

    #getNextIndex = (n) => { 
        if(n > 5) {
            return n;
        }
        return INDEX_TABLE[n];
    }

    #resolveIndex = (i) => {
        if(i > 5) {
            return i;
        }
        return INDEX_TABLE.indexOf(i);
    }

};