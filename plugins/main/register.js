import { createHash } from 'crypto'
let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i

export default {
  name: 'register',
  tags: 'main',
  command: ['register', 'reg', 'daftar'],
  description: 'Register to be able to use the menu',
  example: '',
  run: async(m, { sock, text, command }) => {
    let user = db.users[m.sender]
    let pp = await sock.profilePictureUrl(m.sender, 'image').catch(_ => 'https://i.ibb.co.com/jwBzN73/110200520-p0.png')
    if (user.registered === true) return m.reply(`Kamu Sudah Terdaftar Di Database, Apa Kamu Ingin Mendaftar Ulang? Gunakan *${m.prefix}unreg*`)
    if (!Reg.test(text)) return m.reply(`Gunakan perintah *${m.prefix + command} (nama).(umur)* | Example: *${m.prefix + command} ${m.pushName}.30* `)

    let [_, name, splitter, age] = text.match(Reg)
    if (!name) return m.reply('Nama tidak boleh kosong')
    if (!age) return m.reply('Umur tidak boleh kosong')

    age = parseInt(age)
    if (age > 40) return m.reply('Woy tua bangka')
    if (age < 5) return m.reply('Halah dasar bocil')
    
    user.name = name.trim()
    user.age = age
    user.regTime = +new Date()
    user.registered = true

    let sn = createHash('md5').update(m.sender).digest('hex')
    let teks = `*[ Informasi Kamu ]*\n\n`
    teks += `*-* *Nama* : ${name}\n`
    teks += `*-* *Umur* : ${age} Tahun\n`
    teks += `*-* *Serial nomor* : ${sn}\n\n`
    teks += global.set.footer
    m.reply(teks)
    let riyo = `*[ System Notifications ]*\n\n`
    riyo += `*${m.pushName}* telah terdaftar di database yumi`
    await sock.reply(global.media.scm, riyo, null)
  }
}