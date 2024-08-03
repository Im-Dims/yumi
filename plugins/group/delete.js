export default {
  name: 'delete',
  tags: 'group',
  command: ['delete', 'del'],
  description: 'Delete group message',
  example: '',
  group: true,
  admin: true,
  run: async(m, { sock, text, isAdmin, isBotAdmin }) => {
    if (!m.quoted) return m.reply('*reply the message you want to delete.*')
      try {
        let bilek = m.message.extendedTextMessage.contextInfo.participant
        let banh = m.message.extendedTextMessage.contextInfo.stanzaId
        return sock.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: banh, participant: bilek }})
      } catch {
        return sock.sendMessage(m.chat, { delete: m.quoted.vM.key })
      }
  }
}