import fs from 'fs'
import axios from 'axios'
import cheerio from 'cheerio'
import fetch from 'node-fetch'
import chalk from "chalk"
import { fileURLToPath } from "url"
import Function from "../system/lib/function.js"
const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)  

/** settings nomor **/
global.owner = ["6281398274790"]
global.pairingNumber = "62xxx" //isi dengan nomor bot mu
global.write_store = false

/** function to make it more practical **/
global.Func = await new (await import('../storage/script/functions.js')).default();
global.Uploader = await new (await import('../storage/script/uploader.js')).default();
global.UploaderV2 = (await import('../storage/script/uploaderV2.js')).default
global.scrap = await import('../storage/script/scraper.js')

/** tools **/
global.fs = fs
global.axios = axios
global.cheerio = cheerio
global.fetch = fetch
global.delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
global.readMore = readMore

global.multiplier = 1000 // The bigger it gets the harder it is to level up
global.max_upload = 70 // Maximum limit to send files
global.intervalmsg = 1800 // To avoid spam on first login
global.ram_usage = 2100000000 // Maximum 2GB ram, do the math yourself

global.prefix = /^[°•π÷×¶∆£¢€¥®™+✓_=|/~!?@#%^&.©^]/i
global.thumbnail = fs.readFileSync("./storage/media/thumbnail.jpg")
global.timeImage = Function.timeImage()
global.ucapan = Function.timeSpeech()
global.func = Function

/** apikey **/
global.ssa = 'https://api.ssateam.my.id'
global.key = 'isiajasendiri'

global.APIs = {
  ssa: 'https://api.ssateam.my.id',
  ana: 'https://anabot.my.id'
}

global.APIKeys = {
  'https://anabot.my.id/api': key
}

/** don't remove **/
global.opts = {
  qr: true,
  pairing: false
}

/** options setting **/  
global.set = {
  wm: `© yumi v3.0.1`,
  footer: 'Powered By SSA Team',
  version: 'v3.0.1',
  packname: 'Sticker By',
  author: '© Yumi'
}

/** buwat cenel nih **/
global.ch = {
  ssa: '120363193509141242@newsletter',
  ssaclone: '120363299429021187@newsletter'
}

/** buat kuki/api skreper di sini ae **/
global.api = {
  groq: 'isi ajaj sendiri',
  useragent: 'Mozilla/5.0 (Linux; Android 10; SM-A105G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Mobile Safari/537.36',
  bing: ''
}

/** options sosial media **/  
global.media = {
  sig: 'https://instagram.com/dims_t11',
  syt: 'https://www.youtube.com/@Dims_senpai',
  sgh: 'https://github.com/Im-Dims',
  sch: 'https://whatsapp.com/channel/0029VaDs0ba1SWtAQnMvZb0U',
  sr: 'https://replit.com/@DimasTriyatno',
  swa: 'https://wa.me/6281398274790',
  scm: '120363156080268565@g.us' // id comunity, wajib isi
}

/** settings your thumbnail is here **/
global.thumb = 'https://telegra.ph/file/17d5e88f8e49f27d57b4a.jpg'
global.thumb2 = 'https://telegra.ph/file/7ed5d31dd43ea5adb7e1b.jpg'

/** status message **/
global.status = Object.freeze({
  wait: Func.texted('bold', 'Processed . . .'),
  invalid: Func.texted('bold', 'URL is Invalid!'),
  wrong: Func.texted('bold', 'Wrong format!'),
  getdata: Func.texted('bold', 'Scraping metadata . . .'),
  fail: Func.texted('bold', 'Can\'t get metadata!'),
  error: Func.texted('bold', 'Error occurred!'),
  errorF: Func.texted('bold', 'Sorry this feature is in error.'),
  premium: Func.texted('bold', 'This feature only for premium user.'),
  limit: Func.texted('bold', 'Your daily limit has been exhausted, some commands cannot be accessed'),
  owner: Func.texted('bold', 'This command only for owner.'),
  god: Func.texted('bold', 'This command only for Master'),
  group: Func.texted('bold', 'This command will only work in groups.'),
  botAdmin: Func.texted('bold', 'This command will work when I become an admin.'),
  admin: Func.texted('bold', 'This command only for group admin.'),
  restrict: Func.texted('bold', 'This feature is disabled.'),
  private: Func.texted('bold', 'Use this command in private chat.'),
  reg: Func.texted('bold', 'Hello sensei, please register first to use this feature.'),
  quoted: Func.texted('bold', 'Reply to the message'),
  image: Func.texted('bold', 'Reply photos or send photos with captions'),
  sticker: Func.texted('bold', 'Reply sticker'),
  video: Func.texted('bold', 'Reply video or send video with caption'),
  audio: Func.texted('bold', 'Reply audio')
})

/** don't change it **/
global.adReply = {
  contextInfo: {
    externalAdReply: {
      title: set.wm,
      body: ucapan,
      description: set.author,
      previewType: "PHOTO",
      thumbnail: thumbnail,
      mediaUrl: media.syt,
      sourceUrl: media.syt
    }
  }
}

/** realod file **/
let file = fileURLToPath(import.meta.url)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright("Update config.js"))
  import(`${file}?update=${Date.now()}`)
})