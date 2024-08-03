export default {
  name: 'remini',
  tags: 'tools',
  command: ['remini', 'hd', 'hdr'],
  description: 'Mungkin fitur untuk hd in gambar ini bisa membantu??',
  example: '',
  limit: true,
  run: async(m, { sock, args }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) return m.reply('Ummhh gambarnya??')
    if (!/image\/(jpe?g|png|webp)|application\/octet-stream/.test(mime)) return m.reply(`Mime ${mime} tidak support`)
    let media = await q.download()
    m.reply("Chotto...")
    let hade = await scrap.remini(media, "enhance")
	await sock.sendMessage(m.chat, { image: hade, caption: "done desu" }, { quoted: m })
  }
}