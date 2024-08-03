export default {
  name: 'profile',
  tags: 'main',
  command: ['profile', 'me'],
  description: 'View your profile card',
  example: '',
  register: true,
  run: async (m, { sock }) => {
    let user = db.users[m.sender]
    let teks = `*[ Your Profile ]*\n\n`
    teks += `*-* *Name* : ${user.name}\n`
    teks += `*-* *Age* : ${user.age}\n`
    teks += `*-* *Exp* : ${user.exp}\n`
    teks += `*-* *Money* : ${user.money}\n`
    teks += `*-* *Level* : ${user.level}\n`
    teks += `*-* *Limit* : ${user.limit}\n`
    teks += `*-* *Status* : ${user.premium ? 'Premium' : 'Free'}${user.premiumTime >= 1 ? '\n*-* *Expired* : ' + clockString(user.premiumTime - Date.now()) : ''}\n`
    teks += `*-* *Registration* : Yes\n`
    teks += `*-* *Registration Time* : ${func.jam(user.regTime, { timeZone: 'Asia/Jakarta' })}, ${func.tanggal(user.regTime, 'Asia/Jakarta')}\n\n`
    teks += global.set.footer
    m.reply(teks)
  }
}

function clockString(ms) {
  let d = isNaN(ms) ? '' : Math.floor(ms / 86400000) % 30
  let h = isNaN(ms) ? '' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '' : Math.floor(ms / 1000) % 60
  return [d, " Day ", h, " O'clock ", m, " Minute ", s, " Second"].map(v => v.toString().padStart(2, 0)).join("")
}