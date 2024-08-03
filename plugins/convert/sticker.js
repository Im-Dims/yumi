export default {
  name: 'sticker',
  tags: 'convert',
  command: ['sticker', 's'],
  description: 'Make whatsApp sticker',
  example: '',
  limit: true,
  run: async(m, { sock, text, command }) => {
    const quoted = m.isQuoted ? m.quoted : m;
    if (/image|video|webp/i.test(quoted.mime)) {
    m.reply(global.status.wait);
      const buffer = await quoted.download();
      if (quoted?.msg?.seconds > 10) return m.reply(`Max video 9 seconds`);
      let exif = {
        packName: global.set.packname,
        packPublish: global.set.wm,
      };
      if (m.text) {
        let [packname, author] = m.text.split('|');
        exif.packName = packname ? packname : '';
        exif.packPublish = author ? author : '';
      }
      m.reply(buffer, { asSticker: true, ...exif });
    } else if (m.mentions[0]) {
    m.reply(global.status.wait);
      let url = await sock.profilePictureUrl(m.mentions[0], 'image');
      let buffer = await fetch(url).then((res) => res.buffer());
      m.reply(buffer, { asSticker: true, ...exif });
    } else if (/(https?:\/\/.*\.(?:png|jpg|jpeg|webp|mov|mp4|webm|gif))/i.test(m.text)) {
    m.reply(global.mess.loading);
      let url = m.text.match(/(https?:\/\/.*\.(?:png|jpg|jpeg|webp|mov|mp4|webm|gif))/i)[0];
      let buffer = await fetch(url).then((res) => res.buffer());
      m.reply(buffer, { asSticker: true, ...exif });
    } else {
    m.reply(`Method Not Support`);
    }
  }
};