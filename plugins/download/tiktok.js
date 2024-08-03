export default {
  name: 'tiktok',
  tags: 'download',
  command: ['tiktok', 'tiktokslide', 'tt', 'ttslide'],
  description: 'Download tiktok videos/images',
  example: Func.example('%p', '%cmd', 'https://vt.tiktok.com/ZSYaEoF55'),
  limit: true,
  run: async (m, { sock, args }) => {
    if (!args[0].match('tiktok.com')) return m.reply(global.status.invalid)
    m.reply(global.status.wait)
    let old = new Date()
      try {
        let res = await scrap.tiktokDl(args[0])
          if (res.data.images) {
            for (let x of res.data.images) {
            await sock.sendMessage(m.chat, { image: { url: x }, caption: teks }, { quoted: m })
          }
        } else {
          let teks = `*[ Tiktok ]*\n\n`
          teks += `*-* *Author* : null\n`
          teks += `*-* *Caption* : ${res.data.title || 'Tidak ada'}\n`
          teks += `*-* *Duration* : ${res.data.duration || 'Tidak ada'}\n`
          teks += `*-* *Fetching* : ${((new Date - old) * 1)} ms\n\n`
          teks += global.set.footer
          const sd_tt = await res.data.play
          const ttvideo = await sock.sendMessage(m.chat, { video: { url: 'https://www.tikwm.com' + sd_tt }, caption: teks }, { quoted: m })
          const aud_tt = await res.data.music_info
          sock.sendMessage(m.chat, { audio: { url: aud_tt.play, mimetype: "audio/mpeg", ptt: true }}, { quoted: ttvideo })
        }
      } catch (e) {
        console.log(e)
        return m.reply(global.status.error)
      }
  }
}