export default {
  name: 'youtubevideo',
  tags: 'download',
  command: ['youtubevideo', 'ytv', 'ytmp4'],
  description: 'Downloading video youtube',
  example: Func.example('%p', '%cmd', 'https://youtube.com/watch?v=ZRtdQ81jPUQ'),
  limit: true,
  run: async(m, { sock, args }) => {
    if (!args[0].match('youtube.com')) return m.reply(global.status.invalid)
    m.reply(global.status.wait)
    let old = new Date()
      try {        
        let anu = await scrap.ytv(args[0])
        //if (!anu.status) return m.reply(global.status.fail)
        let teks = `*[ YouTube Download ]*\n\n`
        teks += `*-* *Title* : ${anu.title || 'not know'}\n`
        teks += `*-* *Date* : ${anu.date || 'not know'}\n`
        teks += `*-* *Duration* : ${anu.duration || 'not know'}\n`
        teks += `*-* *Channel* : ${anu.channel || 'not know'}\n`
        teks += `*-* *Quality* : ${anu.quality || 'not know'}\n`
        teks += `*-* *Content length* : ${anu.contentLength || 'not know'}\n`
        teks += `*-* *Description* : ${anu.description || 'not know'}\n`
        teks += `*-* *Image URL* : ${anu.thumb.url || 'not know'}\n`
        teks += `*-* *Fetching* : ${((new Date - old) * 1)} ms\n\n`
        teks += global.set.footer
        let kyah = await sock.reply(m.chat, teks, m)
        sock.sendMessage(m.chat, { video: { url: anu.videoUrl }, caption: null },{ quoted: kyah })
      } catch (e) {
        console.log(e)
        return m.reply(global.status.error)
      }
  }
}