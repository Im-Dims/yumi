export default {
  name: 'afk',
  tags: 'group',
  command: ['afk'],
  description: 'Set your status to afk',
  example: '',
  run: async (m, { sock, text, args }) => {
    let name = m.pushName || sock.getName(m.sender)
    let user = global.db.users[m.sender]
    user.afk = +new Date()
    user.afkReason = text || 'No Reason'
    m.reply(`${name} currently AFK for a reason: ${text ? text : 'no reason'}`)
  }
}