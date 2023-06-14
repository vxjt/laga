import './style.css'
import { rrender } from './app.ts'

const search = document.querySelector('#search') as HTMLInputElement;
const app = document.querySelector('#app') as HTMLElement;
const dev = document.querySelector('#dev') as HTMLElement;
const clear = document.querySelector('#clear') as HTMLButtonElement;
const mag = document.querySelector('#mag') as HTMLButtonElement;
const regionb = document.querySelector("#region-button") as HTMLButtonElement;
const regionlist = document.querySelector("#region-dialog") as HTMLDialogElement;
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

const api2: any = {
  br1: {
    host: `br1.api.riotgames.com`,
    name: `Brazil`,
    region: `americas.api.riotgames.com`
  },
  eun1: {
    host: `eun1.api.riotgames.com`,
    name: `Europe Nordic & East`,
    region: `europe.api.riotgames.com`
  },
  euw1: {
    host: `euw1.api.riotgames.com`,
    name: `Europe West`,
    region: `europe.api.riotgames.com`
  },
  jp1: {
    host: `jp1.api.riotgames.com`,
    name: `Japan`,
    region: `asia.api.riotgames.com`
  },
  kr: {
    host: `kr.api.riotgames.com`,
    name: `Korea`,
    region: `asia.api.riotgames.com`
  },
  la1: {
    host: `la1.api.riotgames.com`,
    name: `Latin America North`,
    region: `americas.api.riotgames.com`
  },
  la2: {
    host: `la2.api.riotgames.com`,
    name: `Latin America South`,
    region: `americas.api.riotgames.com`
  },
  na1: {
    host: `na1.api.riotgames.com`,
    name: `North America`,
    region: `americas.api.riotgames.com`
  },
  oc1: {
    host: `oc1.api.riotgames.com`,
    name: `Oceania`,
    region: `sea.api.riotgames.com`
  },
  tr1: {
    host: `tr1.api.riotgames.com`,
    name: `Turkey`,
    region: `europe.api.riotgames.com`
  },
  ru: {
    host: `ru.api.riotgames.com`,
    name: `Russia`,
    region: `asia.api.riotgames.com`
  },
  ph2: {
    host: `ph2.api.riotgames.com`,
    name: `Philippines`,
    region: `sea.api.riotgames.com`
  },
  sg2: {
    host: `sg2.api.riotgames.com`,
    name: `Singapore`,
    region: `sea.api.riotgames.com`
  },
  th2: {
    host: `th2.api.riotgames.com`,
    name: `Thailand`,
    region: `sea.api.riotgames.com`
  },
  tw2: {
    host: `tw2.api.riotgames.com`,
    name: `Taiwan`,
    region: `asia.api.riotgames.com`
  },
  vn2: {
    host: `tw2.api.riotgames.com`,
    name: `Vietnam`,
    region: `sea.api.riotgames.com`
  }
}

const headrc = {
  headers: {
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Riot-Token": import.meta.env.VITE_OOPS
  }
}

let bigdata = {}
let curregion = `na1`


function init(): void {
  search.addEventListener(`keydown`, kblisten)
  search.addEventListener(`input`, inputlisten)
  clear.addEventListener(`click`, clicklisten)
  regionb.addEventListener(`click`, clicklisten)
  mag.addEventListener(`click`, clicklisten)
  let regionhtml = ``
  for (let ah in api2) {
    regionhtml += `<button class="region-list-button" value="${ah}">${api2[ah].name}</button><br />`
  }
  regionlist.innerHTML = regionhtml
  regionb.innerHTML = `${api2[curregion].name}`
  regionlist.style.bottom = `${Object.keys(api2).indexOf(curregion) - Object.keys(api2).length + 1}lh`
  var regionbuttons = document.getElementsByClassName(`region-list-button`)
  for (let bh in regionbuttons) {
    if (regionbuttons[bh].nodeName == `BUTTON`) {
      regionbuttons[bh].addEventListener("click", () => {
        curregion = (<HTMLButtonElement>regionbuttons[bh]).value
        regionb.innerHTML = `${api2[curregion].name}`
        regionlist.style.bottom = `${Object.keys(api2).indexOf(curregion) - Object.keys(api2).length + 1}lh`
        regionlist.close()
      });
    }
  }
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
    let val = search.value
    //sanitize, longer than 3 letters
    if (val.length > 3) {
      method2(val)
      method1(val)
    }
  }
}

function clicklisten(event: Event) {
  switch (event.target) {
    case clear:
      search.value = ""
      clear.style.display = "none"
      break;
    case regionb:
      regionlist.open ? regionlist.close() : regionlist.show()
      break;
    case mag:
      //loading event, 'sec' rendered
      app.innerHTML = `<center>sec</center>`
      let val = search.value
      //sanitize, longer than 3 letters
      if (val.length > 3) {
        method2(val)
        method1(val)
      }
      break;
    default:
      console.log(`clicklisten: ${event.target}`)
  }
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