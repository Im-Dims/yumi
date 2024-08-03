import fs from 'fs';

export default {
  name: 'clearsesi',
  tags: 'owner',
  command: ['clearsesi'],
  description: 'Clearing bot session cache',
  example: '',
  owner: true,
  run: async(m, { sock, command }) => {
    fs.readdir("storage/temp/session", async function(err, files) {
      if (err) {
        console.log('Unable to scan directory: ' + err);
        return m.reply('Unable to scan directory: ' + err);
      }
      let filteredArray = await files.filter(item => item.startsWith("pre-key") || item.startsWith("sender-key") || item.startsWith("session-") || item.startsWith("app-state"))
      console.log(filteredArray.length);
      let teks = `Detected ${filteredArray.length} junk files\n\n`
      if (filteredArray.length == 0) return newReply(teks)
      filteredArray.map(function(e, i) {
        teks += (i + 1) + `. ${e}\n`
      })
      const { key } = await m.reply(teks)
      await func.delay(2000)
      await m.reply("Process Clear session...", { edit: key })
      await filteredArray.forEach(function(file) {
        fs.unlinkSync(`storage/temp/session/${file}`)
      });
      await func.delay(2000)
      m.reply("*Session* Success Clear", { edit: key }) 
      })
  } 
}