import './style.css'
import { logit } from './app.ts'

const search = document.querySelector('#search') as HTMLElement;
const app = document.querySelector('#app') as HTMLElement;
const dev = document.querySelector('#dev') as HTMLElement;
const html = {raw: {}, str: ``}
const apis = {
  global: {
    rpc: 1200
  },
  rcam: {
    name: 'rcam',
    ready: 0,
    output: new Map()
  },
  rcna1: {
    name: 'rcna1',
    ready: 0,
    output: new Map()
  }
}

const headrc = {
  headers: {
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Riot-Token": import.meta.env.VITE_OOPS
  }
};

let bigdata = {}

function init(): void {
  search.addEventListener('keydown', bigsearch);
  app.innerHTML = `<center>..hey</center>`
}

async function bigsearch(event: KeyboardEvent) {
  if (event.key == "Enter") {
    app.innerHTML = `<center>sec</center>`
    let val = (event.target as HTMLInputElement).value
    if (val.length > 3) {
      //method 1 works
      const resp1 = await fetch(`http://localhost:5173/rcna1/lol/summoner/v4/summoners/by-name/${val}`, headrc)
      const suminfo = await resp1.json()
      //method 2 test
      apis.rcna1.output.set(`/lol/summoner/v4/summoners/by-name/${val}`, null)
      setTimeout(() => runqueue(apis.rcna1), apis.rcna1.ready)
      //end
      if (suminfo.puuid) {
        const resp2 = await fetch(`http://localhost:5173/rcam/lol/match/v5/matches/by-puuid/${suminfo.puuid}/ids?start=0&count=5`, headrc)
        const matches = await resp2.json()
        for (const i in matches) {
          apis.rcam.output.set(`/lol/match/v5/matches/${matches[i]}`, null)
        }
        const resp3 = await fetch(`http://localhost:5173/rcam/lol/match/v5/matches/${matches[0]}`, headrc)
        const rjson = await resp3.json()
        Object.assign(bigdata, rjson)
      } else {
        Object.assign(bigdata, suminfo)
      }
      fillbigdata(bigdata)
      console.log(apis)
    }
  }
}

function runqueue(api: any) {
  const testiter = api.output.entries()
  console.log(testiter.next().value)

  //const tester = api.output.find((test:any) => test)
  /*
  for (const a in api.output) {
    console.log(a)
  }*/
  //console.log(tester)
  /*
  async (value: any, key: any) => {
    if (value) {
      console.log(`already had ${key} ${value}`)
    } else {
      console.log(`calling out for ${key} ${value}`)
      const tf = await fetch(`http://localhost:5173/${api.name}${key}`, headrc)
      api.output.set(key, await tf.json())
      api.ready = Date.now() + apis.global.rpc
    }
  }*/
}

function rrender(rm: {raw: any}) {
  let ys = ``
  for (const p in rm.raw) {
    switch (typeof rm.raw[p]) {
      case 'object':
        ys += `<details><summary><span class="mono">${p}</span></summary>`
        ys += rrender({raw: rm.raw[p]})
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

async function fillbigdata(pd: any) {
  html.raw = pd
  html.str = rrender(html)
  dev.innerHTML = html.str
  app.innerHTML = `<center>extreme</center>`
}

init()