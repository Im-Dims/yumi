export default {
  name: 'instagram',
  tags: 'download',
  command: ['instagram', 'ig'],
  description: 'Download instagram videos/images',
  example: Func.example('%p', '%cmd', 'https://www.instagram.com/reel/C8em8oaBWG4/?igsh=M20weThtamoxOWkw'),
  limit: true,
  run: async (m, { sock, args }) => {
    if (!args[0].match('instagram.com')) return m.reply(global.status.invalid)
    m.reply(global.status.wait)
    let old = new Date()
      try {
        const anu = await scrap.igDl(args[0])
        if (!anu.status) return m.reply(global.status.fail)
        sock.sendMessage(m.chat, { video: { url: anu.data[0].url }, caption: `• *Fetching* : ${((new Date - old) * 1)} ms` },{ quoted: m })
      } catch (e) {
        console.log(e)
        return m.reply(global.status.error)
      }
  }
}