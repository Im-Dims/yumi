export async function before(m) {
    if (m.chat.endsWith("broadcast") || m.fromMe || m.isGroup || m.isCommand) return
    let user = db.users[m.sender]
    let txt = `Hai ${m.pushName} ${m.isOwner ? 'sayang' : 'kak'}\n\n${user.banned ? `Anda telah dibanned, hubungi owner untuk mengunban!` : 'Hai, apakah ada yang bisa yumi bantu??'}`
    if (new Date() - user.firstchat < 21600000) return
    sock.reply(m.chat, txt, m)
    user.firstchat = new Date * 1
}
