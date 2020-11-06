export { Grid };

import { Fmt } from './fmt.js';
import { Util } from './util.js';

/**
 * a two dimensional grid of objects
 */
class Grid {
    static defaultSize = 16;

    /**
     * create a new grid
     * @param {*} spec 
     * - width
     * - height
     * - entries
     * - dfltValue
     */
    constructor(spec={}) {
        this.width = Util.objKeyValue(spec, "width", Grid.defaultSize);
        this.height = Util.objKeyValue(spec, "height", Grid.defaultSize);
        this.properties = Util.objKeyValue(spec, "properties", {});
        this.dfltValue = spec.dfltValue;
        this.entries = new Array(this.width * this.height);
        if (spec.entries) {
            for (let j=0; j<this.height; j++) {
                for (let i=0; i<this.width; i++) {
                    let idx = this.index(i,j);
                    if (idx < spec.entries.length) {
                        this.set(spec.entries[idx], i, j);
                    }
                }
            }
        }
        this._count = 0;
    }

    get length() {
        return this._count;
    }

    /**
     * determine flat array index associated w/ x,y coords
     * @param {*} xorv - x coordinate or x,y object (vector)
     * @param {*} y - y coordinate
     */
    index(xorv, y) {
        if (typeof xorv === 'number') {
            if (xorv >= 0 && xorv<this.width && y>=0 && y<this.height) {
                return xorv + this.width * y;
            }
        } else if (('x' in xorv) && ('y' in xorv)) {
            if (xorv.x >= 0 && xorv.x<this.width && xorv.y>=0 && xorv.y<this.height) {
                return xorv.x + this.width * xorv.y;
            }
        }
        return -1;
    }

    /**
     * retrieve object at given x,y coords, return default value if index is out of range
     * @param {*} xorv - x coordinate or x,y object (vector)
     * @param {*} y - y coordinate
     * @param {*} dflt 
     */
    get(xorv, y, dflt=undefined) {
        let idx = this.index(xorv, y);
        if (idx == -1) return (dflt != undefined) ? dflt : this.dfltValue;
        return this.entries[idx];
    }

    /**
     * set object at given x,y coords
     * @param {*} v - value to set
     * @param {*} xorv - x coordinate or x,y object (vector)
     * @param {*} y - y coordinate
     */
    set(v, xorv, y) {
        let idx = this.index(xorv, y);
        if (idx != -1) this.entries[idx] = v;
        this._count++;
    }

    /**
     * remove any object at given x,y coords
     * @param {*} xorv - x coordinate or x,y object (vector)
     * @param {*} y - y coordinate
     */
    remove(xorv, y) {
        let idx = this.index(xorv, y);
        if (idx != -1) this.entries[idx] = undefined;
        this._count--;
    }

    // iterator
    *[Symbol.iterator]() {
        for (let i=0; i<this.entries.length; i++) {
            if (this.entries[i] !== undefined) {
                yield this.entries[i];
            }
        }
    }

    /**
     * iterate through all entries (not undefined) and call given fcn on each
     * @param {*} fcn 
     */
    walk(fcn) {
        for (let i=0; i<this.entries.length; i++) {
            if (this.entries[i] !== undefined) {
                fcn(this.entries[i]);
            }
        }
    }

    /**
     * return object as string
     */
    toString() {
        return Fmt.toString("Grid", this.width, this.height);
    }
}