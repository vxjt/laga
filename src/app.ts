export function logit() {
  return
}

export function rrender(rm: { raw: any }) {
  let ys = ``
  for (const p in rm.raw) {
    switch (typeof rm.raw[p]) {
      case 'object':
        ys += `<details><summary><span class="mono">${p}</span></summary>`
        ys += rrender({ raw: rm.raw[p] })
        ys += `</details>`
        break;
      case 'string':
        ys += `&emsp;<span class="mono">${p}: "${rm.raw[p]}"</span><br>`
        break;
      case 'number':
        ys += `&emsp;<span class="mono">${p}: <span class="num">${rm.raw[p]}</span></span><br>`
        break;
      case 'boolean':
        ys += `&emsp;<span class="mono">${p}: <span class="bool">${rm.raw[p]}</span></span><br>`
        break;
      default:
        ys += `&emsp;<span class="error">${typeof rm.raw[p]} & ${p}: ${rm.raw[p]}</span><br>`
    }
  }
  return ys
}