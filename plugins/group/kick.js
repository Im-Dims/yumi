export default {
  name: 'kick',
  tags: 'group',
  command: ['kick', 'tendang'],
  description: 'Removing members from the group',
  example: '',
  group: true,
  admin: true,
  botAdmin: true,
  run: async(m, { sock, text, participants }) => {
    try {
      let who = m.quoted ? m.quoted.sender : m.mentions && m.mentions[0] ? m.mentions[0] : m.text ? (m.text.replace(/\D/g, '') + '@s.whatsapp.net') : ''
      if (!who || who == m.sender) return m.reply('*Quote / tag* the target you want to kick!!')
      if (m.metadata.participants.filter(v => v.id == who).length == 0) return m.reply(`Target is not in a Group !`)
      let data = await sock.groupParticipantsUpdate(m.chat, [who], 'remove')
      m.reply(func.format(data))
    } catch (e) {
      console.log(e)
      m.reply(global.status.error)
    }
  }
}