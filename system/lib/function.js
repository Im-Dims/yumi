import fs from "fs"
import path from "path"
import Jimp from "jimp"
import axios from "axios"
import chalk from "chalk"
import cheerio from "cheerio"
import { format } from "util"
import { platform } from "os"
import term from "terminal-kit"
import mimes from "mime-types"
import FormData from "form-data"
import { exec } from "child_process"
import moment from "moment-timezone"
import baileys from "@whiskeysockets/baileys"
import { fileTypeFromBuffer } from "file-type"
import { fileURLToPath, pathToFileURL } from "url"

export default new (class Function {
   constructor() {
      this.axios = axios
      this.cheerio = cheerio
      this.fs = fs
      this.path = path
      this.baileys = baileys
      this.FormData = FormData
   }

   __filename(pathURL = import.meta, rmPrefix = platform() !== "win32") {
      const path = pathURL?.url || pathURL

      return rmPrefix ? /file:\/\/\//.test(path) ? fileURLToPath(path) : path : /file:\/\/\//.test(path) ? path : pathToFileURL(path).href
   }

   __dirname(pathURL) {
      const dir = this.__filename(pathURL, true)
      const regex = /\/$/

      return regex.test(dir) ? dir : fs.existsSync(dir) && fs.statSync(dir).isDirectory ? dir.replace(regex, "") : path.dirname(dir)
   }

   async dirSize(directory) {
      const files = await fs.readdirSync(directory)
      const stats = files.map((file) => fs.statSync(path.join(directory, file)))

      return (await Promise.all(stats)).reduce((accumulator, { size }) => accumulator + size, 0)
   }

   sleep(ms) {
      return new Promise((a) => setTimeout(a, ms))
   }

   format(str) {
      return format(str)
   }

   Format(str) {
      return JSON.stringify(str, null, 2)
   }

   jam(numer, options = {}) {
      let format = options.format ? options.format : "HH:mm"
      let jam = options?.timeZone ? moment(numer).tz(options.timeZone).format(format) : moment(numer).format(format)

      return `${jam}`
   }

   tanggal(numer, timeZone = "") {
      const myMonths = [
         "Januari",
         "Februari",
         "Maret",
         "April",
         "Mei",
         "Juni",
         "Juli",
         "Agustus",
         "September",
         "Oktober",
         "November",
         "Desember",
      ]
      const myDays = [
         "Minggu",
         "Senin",
         "Selasa",
         "Rabu",
         "Kamis",
         "Jum’at",
         "Sabtu",
      ]
      var tgl = new Date(numer)
      timeZone ? tgl.toLocaleString("en", { timeZone }) : ""
      var day = tgl.getDate()
      var bulan = tgl.getMonth()
      var thisDay = tgl.getDay(),
         thisDay = myDays[thisDay]
      var yy = tgl.getYear()
      var year = yy < 1000 ? yy + 1900 : yy

      return `${thisDay}, ${day} ${myMonths[bulan]} ${year}`
   }

   async getFile(PATH, save) {
      try {
         let filename = null
         let data = (await this.fetchBuffer(PATH))

         if (data?.data && save) {
            filename = path.join(process.cwd(), "storage/tmp", Date.now() + "." + data.ext)
            fs.promises.writeFile(filename, data?.data)
         }
         return {
            filename: data?.name ? data.name : filename,
            ...data
         }
      } catch (e) {
         throw e
      }
   }

   async fetchJson(url, options = {}) {
      try {
         let data = await axios.get(url, {
            headers: {
               ...(!!options.headers ? options.headers : {})
            },
            responseType: "json",
            ...options
         })

         return await data?.data
      } catch (e) {
         throw e
      }
   }

   fetchBuffer(string, options = {}) {
      return new Promise(async (resolve, reject) => {
         try {
            if (/^https?:\/\//i.test(string)) {
               let data = await axios.get(string, {
                  headers: {
                     ...(!!options.headers ? options.headers : {}),
                  },
                  responseType: "arraybuffer",
                  ...options,
               })

               let buffer = await data?.data
               let name = /filename/i.test(data.headers?.get("content-disposition")) ? data.headers?.get("content-disposition")?.match(/filename=(.*)/)?.[1]?.replace(/[""]/g, "") : ""
               let mime = mimes.lookup(name) || data.headers.get("content-type") || (await fileTypeFromBuffer(buffer))?.mime

               resolve({
                  data: buffer,
                  size: Buffer.byteLength(buffer),
                  sizeH: this.formatSize(Buffer.byteLength(buffer)),
                  name,
                  mime,
                  ext: mimes.extension(mime)
               })
            } else if (/^data:.*?\/.*?base64,/i.test(string)) {
               let data = Buffer.from(string.split`,`[1], "base64")
               let size = Buffer.byteLength(data)

               resolve({ data, size, sizeH: this.formatSize(size), ...((await fileTypeFromBuffer(data)) || { mime: "application/octet-stream", ext: ".bin" }) })
            } else if (fs.existsSync(string) && fs.statSync(string).isFile()) {
               let data = fs.readFileSync(string)
               let size = Buffer.byteLength(data)

               resolve({ data, size, sizeH: this.formatSize(size), ...((await fileTypeFromBuffer(data)) || { mime: "application/octet-stream", ext: ".bin" }) })
            } else if (Buffer.isBuffer(string)) {
               let size = Buffer?.byteLength(string) || 0

               resolve({ data: string, size, sizeH: this.formatSize(size), ...((await fileTypeFromBuffer(string)) || { mime: "application/octet-stream", ext: ".bin" }) })
            } else if (/^[a-zA-Z0-9+/]={0,2}$/i.test(string)) {
               let data = Buffer.from(string, "base64")
               let size = Buffer.byteLength(data)

               resolve({ data, size, sizeH: this.formatSize(size), ...((await fileTypeFromBuffer(data)) || { mime: "application/octet-stream", ext: ".bin" }) })
            } else {
               let buffer = Buffer.alloc(20)
               let size = Buffer.byteLength(buffer)

               resolve({ data: buffer, size, sizeH: this.formatSize(size), ...((await fileTypeFromBuffer(buffer)) || { mime: "application/octet-stream", ext: ".bin" }) })
            }
         } catch (e) {
            reject(new Error(e?.message || e))
         }
      })
   }

   mime(name) {
      let mimetype = mimes.lookup(name)
      if (!mimetype) return mimes.extension(name)
      return { mime: mimetype, ext: mimes.extension(mimetype) }
   }

   isUrl(url) {
      let regex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, "gi")
      if (!regex.test(url)) return false
      return url.match(regex)
   }

   escapeRegExp(string) {
      return string.replace(/[.*=+:\-?^${}()|[\]\\]|\s/g, "\\$&")
   }

   delay = (time) => new Promise((res) => setTimeout(res, time));

   toUpper(query) {
      const arr = query.split(" ")
      for (var i = 0; i < arr.length; i++) {
         arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
      }

      return arr.join(" ")
   }

   getRandom(ext = "", length = "10") {
      var result = ""
      var character = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890"
      var characterLength = character.length

      for (var i = 0; i < length; i++) {
         result += character.charAt(
            Math.floor(Math.random() * characterLength)
         )
      }

      return `${result}${ext ? `.${ext}` : ""}`
   }
   
   ranNumb(min, max = null) {
	if (max !== null) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	} else {
		return Math.floor(Math.random() * min) + 1
	}
}

somematch = ( data, id ) => {
	let res = data.find(el => el === id )
	return res ? true : false;
}

   formatSize(bytes, si = true, dp = 2) {
      const thresh = si ? 1000 : 1024

      if (Math.abs(bytes) < thresh) {
         return `${bytes} B`
      }

      const units = si ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"] : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"]
      const r = 10 ** dp
      let u = -1

      do {
         bytes /= thresh
         ++u
      } while (
         Math.round(Math.abs(bytes) * r) / r >= thresh &&
         u < units.length - 1
      )

      return `${bytes.toFixed(dp)} ${units[u]}`
   }
   
formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600),
    minutes = Math.floor(seconds % 3600 / 60),
    remainingSeconds = seconds % 60,
    formattedDuration = [];
  return hours > 0 && formattedDuration.push(`${hours} hour`), minutes > 0 && formattedDuration.push(`${minutes} minute`),
    remainingSeconds > 0 && formattedDuration.push(`${remainingSeconds} second`),
    formattedDuration.join(" ");
}

formatBytes(bytes) {
  if (0 === bytes) return "0 B";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** i).toFixed(2)} ${[ "B", "KB", "MB", "GB", "TB" ][i]}`;
}

   async resizeImage(buffer, height) {
      buffer = (await this.getFile(buffer)).data

      return new Promise((resolve, reject) => {
         Jimp.read(buffer, (err, image) => {
            if (err) {
               reject(err)
               return
            }

            image.resize(Jimp.AUTO, height).getBuffer(Jimp.MIME_PNG, (err, resizedBuffer) => {
               if (err) {
                  reject(err)
                  return
               }
               resolve(resizedBuffer)
            })
         })
      })
   }

   runtime(seconds) {
      seconds = Number(seconds)
      var d = Math.floor(seconds / (3600 * 24))
      var h = Math.floor((seconds % (3600 * 24)) / 3600)
      var m = Math.floor((seconds % 3600) / 60)
      var s = Math.floor(seconds % 60)
      var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : ""
      var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : ""
      var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : ""
      var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : ""
      return dDisplay + hDisplay + mDisplay + sDisplay
   }

   loading() {
      var { terminal } = term
	  var progressBar, progress = 0

	  function doProgress() {
         progress += Math.random() / 10
         progressBar.update(progress)
         if (progress >= 1) {
            setTimeout(function() {
               console.clear(),
               exec(`screenfetch - A Deepin`, (error, stdout, stderr) => {
                  console.log(stdout),
                  console.log(chalk.bgGray("WhatsApp Bot By Dims"))
               })
            }, 200)
         } else {
            setTimeout(doProgress, 90 + Math.random() * 200)
         }
	  }

      progressBar = terminal.progressBar({
         width: 80,
         title: "\n\nLoad this script....",
         eta: true,
         percent: true
      })

      doProgress()
   }

   reloadPlugin(type, file) {
      const filename = (file) => file.replace(/^.*[\\\/]/, "")

      switch (type) {
         case "delete":
            return delete global.plugins[file]
            break
         case "add":
         case "change":
            try {
               (async () => {
                  const module = await import(`${file}?update=${Date.now()}`)
                  global.plugins[file] = module.default || module
               })()
            } catch (e) {
               sock.logger.error(`Error require plugin "${filename(file)}\n${format(e)}"`)
            } finally {
               global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
            }
            break
      }
   }

   timeSpeech() {
      let ucapanWaktu = ""
      let wakt = moment.tz("Asia/Jakarta").format("HH:mm")

      if (wakt < "23:59") ucapanWaktu = "Good midnight"
      if (wakt < "18:00") ucapanWaktu = "Good night"
      if (wakt < "17:00") ucapanWaktu = "Good afternoon"
      if (wakt < "11:00") ucapanWaktu = "Good afternoon"
      if (wakt < "06:00") ucapanWaktu = "Good morning"
      if (wakt < "05:00") ucapanWaktu = "Good evening"
      if (wakt < "03:00") ucapanWaktu = "Why aren't you sleeping?"

      return ucapanWaktu
   }

   timeImage() {
 let waktu = moment.tz("Asia/Jakarta").format("HH:mm"), image

      if (waktu < "23:59") image = fs.readFileSync("./storage/media/pic/image5.jpg")
      if (waktu < "20:00") image = fs.readFileSync("./storage/media/pic/image4.jpg")
      if (waktu < "18:00") image = fs.readFileSync("./storage/media/pic/image3.jpg")
      if (waktu < "15:00") image = fs.readFileSync("./storage/media/pic/image2.jpg")
      if (waktu < "10:00") image = fs.readFileSync("./storage/media/pic/image1.jpg")

      return image
   }
})()