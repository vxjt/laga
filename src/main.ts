import './style.css'
import { logit } from './app.ts'

const OOPS = 'RGAPI-fa566516-6742-4340-9c52-d9f0e34104b0'
const search = document.querySelector('#search') as HTMLElement;
const app = document.querySelector('#app') as HTMLElement;
const headrc = {
  headers: {
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    "X-Riot-Token": OOPS
  }
};

let temphtml = ``

function init(): void {
  search.addEventListener('keydown', bigsearch);
  app.innerHTML = `<center>welcome friendo</center>`
}

async function bigsearch(event: KeyboardEvent) {
  if (event.key == "Enter") {
    let val = (event.target as HTMLInputElement).value
    if (val.length > 3) {
      let resp = await fetch(`http://localhost:5173/rcna1/lol/summoner/v4/summoners/by-name/${val}`, headrc)
      const suminfo = await resp.json()
      resp = await fetch(`http://localhost:5173/rcam/lol/match/v5/matches/by-puuid/${suminfo.puuid}/ids?start=0&count=10`, headrc)
      const matches = await resp.json()
      resp = await fetch(`http://localhost:5173/rcam/lol/match/v5/matches/${matches[0]}`, headrc)
      const rjson2 = await resp.json()
      renderjson(rjson2)
    }
  }
}

function renderjson(json: any) {
  app.innerHTML = ``
  rrender(json)
  console.log(json)
  app.innerHTML = temphtml
}

function rrender(json: any) {
  for (const prop in json) {
    switch (typeof json[prop]) {
      case 'object':
        temphtml += `<details><summary>${prop}</summary>`
        rrender(json[prop])
        temphtml += `</details>`
        break;
      case 'string':
        temphtml += `&emsp;${prop}: "${json[prop]}"<br>`
        break;
      case 'number':
        temphtml += `&emsp;${prop}: ${json[prop]}<br>`
        break;
      case 'boolean':
        temphtml += `&emsp;${prop}: ${json[prop]}<br>`
        break;
      default:
        console.log('error:', typeof json[prop])
    }
  }
}

init()