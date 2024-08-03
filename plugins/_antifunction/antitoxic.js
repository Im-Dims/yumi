const isToxic = /(anjing|kontol|memek|bangsat|babi|goblok|goblog|kntl|pepek|ppk|ngentod|ngentd|ngntd|kentod|kntd|bgst|anjg|anj|fuck|hitam|ireng|jawir|gay|asw|asu|ktl)/i;

export async function before(m, { isAdmin, isBotAdmin }) {
  if (m.isBaileys && m.fromMe) return !0
  if (!m.isGroup) return !1
    let chat = global.db.chats[m.chat]
    let bot = global.db.settings || {}
    let isAntiToxic = isToxic.exec(m.text)
      if (chat.antitoxic && isAntiToxic) {
        m.reply(`*Terdeteksi kata Toxic*`)
          if (isBotAdmin && bot.restrict) {
            return this.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: m.key.id, participant: m.key.participant }})
          } else if (!bot.restrict) return m.reply('Lain kali jangan begitu ya wadefakemen!')
        }
   return !0
}