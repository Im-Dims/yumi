import { createHash } from "crypto"

export default {
  name: 'ceksn',
  tags: 'main',
  command: ['ceksn'],
  description: 'Look at the serial number',
  example: '',
  register: true,
  run: async(m) => {
    let sn = createHash("md5").update(m.sender).digest("hex")
    m.reply(`*Serial number* : ${sn}`)
  }
}