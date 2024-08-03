import { exifAvatar } from '../../system/lib/sticker.js';

export default {
  name: 'smeta',
  tags: 'convert',
  command: ['smeta'],
  description: 'Create meta stickers',
  example: '',
  limit: true,
  run: async(m, { sock, command }) => {
    var stiker = false
      try {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || q.mediaType || ''
        if (/webp/g.test(mime)) {
          let img = await q.download()
        var stiker = await exifAvatar(img, global.set.packname, global.set.author)
        }
        } catch (e) {
          console.error(e)
        if (Buffer.isBuffer(e)) stiker = e
        } finally {
        if (stiker) sock.sendMessage(m.chat, { sticker: stiker }, { quoted: m })
        else m.reply(`*Conversion failed*\nReply sticker with commands ${m.prefix + command}`)
     }
  }
}; 