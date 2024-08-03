import { writeExif } from '../../system/lib/sticker.js';
import { quote } from '../../storage/script/quote.js';

export default {
  name: 'qc',
  tags: 'convert',
  command: ['qc'],
  description: 'Making qc stickers',
  example: '',
  limit: true,
  run: async(m, { sock, command, text }) => {
    let pepe = m.text && m.quoted ? m.quoted.sender : m.sender;
    let pp = await sock.profilePictureUrl(pepe, 'image').catch(_ => 'https://i.ibb.co.com/jwBzN73/110200520-p0.png');
    let teks = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.text;
    let name = m.text && m.quoted ? sock.getName(m.quoted.sender) : m.pushName;
    if (!teks) return m.reply(Func.example(m.prefix, command, 'Dims suka loli'))
    m.reply(global.status.wait)
      const res = await quote(teks, pp, name)
      let sticker = await writeExif({ mimetype: 'image/png', data: res }, { packName: global.set.packname, packPublish: global.set.author });
      m.reply(sticker, { asSticker: true })
  }
}; 