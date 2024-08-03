export default {
  name: 'thanksto',
  tags: 'main',
  command: ['tqto', 'credit', 'thanksto'],
  description: 'Developer credits',
  example: '',
  run: async(m, { sock, text, command }) => {
    let teks = `*[ Thakns To ]*\n\n`
    teks += `*-* My god\n`
    teks += `*-* AlisaDev & Irull2nd (Base Maker)\n`
    teks += `*-* Muhammad Adriansyah (Support)\n`
    teks += `*-* Suryanjana\n`
    teks += `*-* Rippanteq7 (Support)\n`
    teks += `*-* AditKanaeruu (Support)\n`
    teks += `*-* Miftah\n`
    teks += `*-* Arifzyn\n`
    teks += `*-* KyuuRzy\n`
    teks += `*-* Hyuu\n`
    teks += `*-* KiiCode\n`
    teks += `*-* Yogi\n`
    teks += `*-* XYZ Teams\n`
    teks += `*-* Im-Dims\n`
    teks += `*-* Arell\n`
    teks += `*-* Fainshe (Beban)\n`
    teks += `*-* IFTXH a.k.a Ifungkas\n`
    teks += `*-* Siput / SIPUTu\n`
    teks += `*-* SSA Teams\n\n`
    teks += global.set.footer
    m.reply(teks)
  }
}