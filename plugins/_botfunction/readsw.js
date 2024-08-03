export async function before(m, { isAdmin, isBotAdmin }) {
  if (m.key.remoteJid != 'status@broadcast') return false;
  this.story = this.story ? this.story : [];
  
  const own = "6281398274790@s.whatsapp.net"
  const { mtype, text, sender } = m;
  const name = m.sender.split('@')[0];
  const chat = db.settings || {}
  
  if (chat.readsw) {
  if (mtype === 'imageMessage' || mtype === 'videoMessage') {
    const caption = text ? text : '';   
    try {
    this.readMessages([m.key])
      let buffer = await m.download();
      await this.sendFile(own, buffer, '', caption, m, false, { mentions: [m.sender] });
      this.story.push({ type: mtype, quoted: m, sender: m.sender, caption: caption, buffer: buffer });
    } catch (e) {
      console.log(e);
      await this.reply(own, caption, m, { mentions: [m.sender] });
    }
  } else if (mtype === 'audioMessage') {
    try {
    this.readMessages([m.key])
      let buffer = await m.download();
      await this.sendFile(own, buffer, '', '', m, false, { mimetype: m.mimetype });
      this.story.push({ type: mtype, quoted: m, sender: m.sender, buffer: buffer });
    } catch (e) {
      console.log(e);
    }
  } else if (mtype === 'extendedTextMessage') {
    const pesan = text ? text : '';
    this.readMessages([m.key])
    await this.reply(own, pesan, m, { mentions: [m.sender] });
    this.story.push({ type: mtype, quoted: m, sender: m.sender, message: pesan });
  }
  }
}