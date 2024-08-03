export default {
  name: 'animediff',
  tags: 'tools',
  command: ['animediff', 'stablediff'],
  description: 'Create animediff from ai',
  example: '',
  premium: true,
  run: async(m, { sock, text, command }) => {
    let [tek, anu] = text.split`|`
    if (!text) return m.reply(`Input prompt!, Example: ${m.prefix + command} Anime, loli, 11 years old|no watermark`)
    m.reply(global.status.wait)
    let loli = await scrap.stableDiff(tek, anu).then((v) => {
      for (let image of v.images) {
        let base64 = image.url.split(";base64,").pop();
        sock.sendMessage(m.chat, { image: new Buffer(base64, "base64"), caption: "Done desu" },  { quoted: m })
      }
    });
  }
}