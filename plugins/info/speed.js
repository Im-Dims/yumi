import os from "os"
import { performance } from "perf_hooks"

export default {
  name: 'ping',
  tags: 'info',
  command: ['ping', 'speed'],
  description: "Test the bot's response speed",
  example: '',
  run: async(m) => {
    let old = performance.now()
    let teks = `*[ Server Information ]*\n\n`
    teks += `*-* ${os.cpus().length} CPU: ${os.cpus()[0].model}\n`
    teks += `*-* *Uptime* :  ${Math.floor(os.uptime() / 86400)} days\n`
    teks += `*-* *Ram* : ${func.formatSize(os.totalmem() - os.freemem())} / ${func.formatSize(os.totalmem())}\n`
    teks += `*-* *Speed* :  ${(performance.now() - old).toFixed(3)} s\n\n`
    teks += global.set.footer
    m.reply(teks)
  }
}