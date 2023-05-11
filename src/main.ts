import './style.css'
import { logit } from './app.ts'

const search = document.querySelector('#search') as HTMLElement;
const app = document.querySelector('#app') as HTMLElement;
const dev = document.querySelector('#dev') as HTMLElement;
const html = {raw: {}}

let ystring = ''

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
    let val = (event.target as HTMLInputElement).value
    if (val.length > 3) {
      const resp1 = await fetch(`http://localhost:5173/rcna1/lol/summoner/v4/summoners/by-name/${val}`, headrc)
      const suminfo = await resp1.json()
      if (suminfo.puuid) {
        const resp2 = await fetch(`http://localhost:5173/rcam/lol/match/v5/matches/by-puuid/${suminfo.puuid}/ids?start=0&count=5`, headrc)
        const matches = await resp2.json()
        const resp3 = await fetch(`http://localhost:5173/rcam/lol/match/v5/matches/${matches[0]}`, headrc)
        const rjson = await resp3.json()
        Object.assign(bigdata, rjson)
      } else {
        Object.assign(bigdata, suminfo)
      }
      fillbigdata(bigdata)
    }
  }
}

function rrender(rm: {raw: any}) {
  for (const p in rm.raw) {
    switch (typeof rm.raw[p]) {
      case 'object':
        ystring += `<details><summary><span class="mono">${p}</span></summary>`
        rrender({raw: rm.raw[p]})
        ystring += `</details>`
        break;
      case 'string':
        ystring += `&emsp;<span class="mono">${p}: "${rm.raw[p]}"</span><br>`
        break;
      case 'number':
        ystring += `&emsp;<span class="mono">${p}: <span class="num">${rm.raw[p]}</span></span><br>`
        break;
      case 'boolean':
        ystring += `&emsp;<span class="mono">${p}: <span class="bool">${rm.raw[p]}</span></span><br>`
        break;
      default:
        ystring += `&emsp;<span class="error">${typeof rm.raw[p]} & ${p}: ${rm.raw[p]}</span><br>`
    }
  }
}

async function fillbigdata(pd: any) {
  html.raw = pd
  ystring = ``
  rrender(html)
  dev.innerHTML = ystring
}

init()