import yts from 'yt-search'

export default {
  name: 'play',
  tags: 'download',
  command: ['play'],
  description: 'Cari musik favorit anda di sini',
  example: '',
  limit: true,
  run: async(m, { sock, text, command }) => {
    if (!text) return m.reply(Func.example(m.prefix, command, 'spiral by longman'))
    m.reply(global.status.wait)
    try {
      let yt = await (await yts(text)).all
      let anu = `https://anabot.my.id/api/download/ytmp3?url=${yt[0].url}&apikey=${global.key}`;
      let old = new Date()
        let ca = `*[ YouTube Play ]*\n\n`
        ca += `*-* *Title* : ` + yt[0].title + `\n`
        ca += `*-* *Duration* : ` + yt[0].timestamp + `\n`
        ca += `*-* *Viewer* : ` + yt[0].views + `\n`
        ca += `*-* *Upload* : ` + yt[0].ago + '\n'
        ca += `*-* *Link* : ` + yt[0].url + `\n`
        ca += `*-* *Fetching* : ${((new Date - old) * 1)} ms\n\n`
        ca += global.set.footer
        let xSize = Func.sizeLimit('100', global.set.max_upload)
        if (xSize.oversize) return m.reply(`The file size (100MB) is too large, please download it yourself via this link : ${yt[0].url}`)
        sock.sendFThumb(m.chat, global.set.wm, ca, yt[0].thumbnail, yt[0].url, m).then(async () => {
         sock.sendMessage(m.chat, { audio: { url: anu }, fileName: yt[0].title + '.mp3', mimetype: 'audio/mpeg' }, { quoted: m })
          sock.sendMessage(m.chat, { document: { url: anu }, mimetype: 'audio/mp3', fileName: yt[0].title + '.mp3' }, { quoted: m })
        })
    } catch (e) {
      console.log(e)
      return m.reply(global.status.error)
    }
  }
}