import './style.css'
import { rrender } from './app.ts'

const search = document.querySelector('#search') as HTMLInputElement;
const app = document.querySelector('#app') as HTMLElement;
const dev = document.querySelector('#dev') as HTMLElement;
const clear = document.querySelector('button.clear') as HTMLElement;
const html = { raw: {}, str: `` }
const apis: any = {
  global: {
    rpc: 1200
  },
  rcam: {
    name: 'rcam',
    ready: 0,
    output: {}
  },
  rcna1: {
    name: 'rcna1',
    ready: 0,
    output: {}
  }
}

const headrc = {
  headers: {
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Riot-Token": import.meta.env.VITE_OOPS
  }
}

let bigdata = {}

function init(): void {
  search.addEventListener('keydown', kblisten)
  search.addEventListener('input', inputlisten)
  clear.addEventListener('click', clicklisten)
  app.innerHTML = `<center>..hey</center>`
}

function method2(v: string) {
  apis.rcna1.output[`/lol/summoner/v4/summoners/by-name/${v}`] = {}
  console.log(`hey ${v}`)
  return
}

async function method1(v: string) {
  const resp1 = await fetch(`http://localhost:5173/rcna1/lol/summoner/v4/summoners/by-name/${v}`, headrc)
  const suminfo = await resp1.json()
  if (suminfo.puuid) {
    const resp2 = await fetch(`http://localhost:5173/rcam/lol/match/v5/matches/by-puuid/${suminfo.puuid}/ids?start=0&count=5`, headrc)
    const matches = await resp2.json()
    const resp3 = await fetch(`http://localhost:5173/rcam/lol/match/v5/matches/${matches[0]}`, headrc)
    const rjson = await resp3.json()
    Object.assign(bigdata, rjson)
    /*
    for (const i in matches) {
      apis.rcam.output[`/lol/match/v5/matches/${matches[i]}`] = null
    }
    */
  } else {
    Object.assign(bigdata, suminfo)
  }
  fillbigdata(bigdata)
}

function inputlisten(event: Event) {
  let val = (event.target as HTMLInputElement).value
  if (val) {
    clear.style.display = "block"
  } else {
    clear.style.display = "none"
  }
}

function kblisten(event: KeyboardEvent) {
  //debounce, enter pressed
  if (event.key == "Enter") {
    //loading event, 'sec' rendered
    app.innerHTML = `<center>sec</center>`
    let val = (event.target as HTMLInputElement).value
    //sanitize, longer than 3 letters
    if (val.length > 3) {
      method2(val)
      method1(val)
    }
  }
}

function clicklisten() {
  search.value = ""
  clear.style.display = "none"
}

/*
function runqueue(api: any) {
  async (value: any, key: any) => {
    if (value) {
      console.log(`already had ${key} ${value}`)
    } else {
      console.log(`calling out for ${key} ${value}`)
      const tf = await fetch(`http://localhost:5173/${api.name}${key}`, headrc)
      api.output.set(key, await tf.json())
      api.ready = Date.now() + apis.global.rpc
    }
  }
}
*/

async function fillbigdata(pd: any): Promise<void> {
  html.raw = pd
  html.str = rrender(html)
  dev.innerHTML = html.str
  app.innerHTML = `<center>extreme</center>`
}

init()