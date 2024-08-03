export default {
  name: 'whatanime',
  tags: 'tools',
  command: ['whatanime', 'wait'],
  description: 'Kamu bisa mencari anime yang kamu gak tau judulnya',
  example: '',
  limit: true,
  run: async(m, { sock, args }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) return m.reply('No media found')
    if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Mime ${mime} tidak support`)
    let media = await q.download()
    let nah = await Uploader.uploader(media)
    let res = await Func.fetchJson(`https://api.trace.moe/search?anilistInfo&url=${nah.data.url}`)
    let { id, idMal, title, synonyms, isAdult } = res.result[0].anilist
    let { filename, episode, similarity, video, image } = res.result[0]
    let mok = `*[ What Anime ]*\n\n*-* *Title :* ${title.romaji} (${title.native})\n*-* *Synonyms :* ${synonyms}\n*-* *Adult :* ${isAdult}\n*-* *Similiarity :* ${(similarity * 100).toFixed(1)}\n*-* *Episode :* ${episode}\n\n${global.set.footer}`;
    await sock.sendMessage(m.chat, { image: { url: image }, caption: mok }, { quoted: m })
  }
}