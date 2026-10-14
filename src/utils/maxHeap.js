// maxHeap.js — array-based binary max-heap keyed on `priority`
export class MaxHeap {
  constructor() { this.a = []; }
  size() { return this.a.length; }
  push(item) {            // item = { priority, ...anything }
    this.a.push(item);
    let i = this.a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.a[p].priority >= this.a[i].priority) break;
      [this.a[p], this.a[i]] = [this.a[i], this.a[p]];
      i = p;
    }
  }
  pop() {
    if (!this.a.length) return null;
    const top = this.a[0];
    const last = this.a.pop();
    if (this.a.length) {
      this.a[0] = last;
      let i = 0;
      for (;;) {
        let l = 2 * i + 1, r = l + 1, m = i;
        if (l < this.a.length && this.a[l].priority > this.a[m].priority) m = l;
        if (r < this.a.length && this.a[r].priority > this.a[m].priority) m = r;
        if (m === i) break;
        [this.a[m], this.a[i]] = [this.a[i], this.a[m]];
        i = m;
      }
    }
    return top;
  }
  // convenience: returns all items best-first
  toSortedArray() {
    const copy = new MaxHeap(); copy.a = [...this.a];
    const out = []; let x;
    while ((x = copy.pop())) out.push(x);
    return out;
  }
}
