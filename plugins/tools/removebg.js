const rmbg = await import('../../storage/script/removebg.js');

export default {
  name: 'removebg',
  tags: 'tools',
  command: ['removebg'],
  description: 'Menghapus baground pada foto',
  example: '',
  limit: true,
  run: async(m, { sock, args }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) return m.reply('Umhhh... gambarnya??')
    m.reply(global.status.wait)
    let dor = await rmbg.removeBg(await q.download());
    let buffer = Buffer.from(dor, 'base64');
    await sock.sendMessage(m.chat, { image: buffer, caption: 'Sukses menghapus baground pada foto' }, { quoted: m })
  }
}