const linkRegex = /chat.whatsapp.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i

export async function before(m) {
  if (m.isBaileys || !m.isGroup) return false
  const chat = global.db.chats[m.chat]
  const isGroupLink = linkRegex.exec(m.body)
    if (chat.antilink && isGroupLink && !m.isAdmin) {
    let thisGroup = 'https://chat.whatsapp.com/' + await sock.groupInviteCode(m.chat)     
      if (m.body.includes(thisGroup)) return false
      if (m.isBotAdmin) {
        sock.sendMessage(m.chat, { delete: m.key })
        //sock.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
      }
    }
  return true
}