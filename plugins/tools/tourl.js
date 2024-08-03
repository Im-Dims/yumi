export default {
  name: 'tourl',
  tags: 'tools',
  command: ['tourl'],
  description: 'upload foto kamu menjadi link',
  example: '',
  limit: true,
  run: async(m, { sock, args }) => {
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) return m.reply('No media found')
    let media = await q.download()
    
    let nah = await Uploader.uploader(media)
    let nih = await scrap.uploadSSA(media)
    let noh = await scrap.uploadPomf2(media)
    
    let a = await(await UploaderV2.uploadPomf2(media))
    let b = await UploaderV2.ucarecdn(media)
    let c = await UploaderV2.tmpfiles(media)
    let d = await UploaderV2.Uguu(media)
    let e = await UploaderV2.catbox(media)
    
    m.reply(Func.jsonFormat(nah))
    m.reply(Func.jsonFormat(nih))
    //m.reply(Func.jsonFormat(noh))  
    m.reply(Func.jsonFormat(a))
    //m.reply(Func.jsonFormat(b))
    //m.reply(Func.jsonFormat(c))
    //m.reply(Func.jsonFormat(d))
    //m.reply(Func.jsonFormat(e))
  }
}

async function toSize(number) {
  var SI_POSTFIXES = ["B", " KB", " MB", " GB", " TB", " PB", " EB"]
  var tier = Math.log10(Math.abs(number)) / 3 | 0
    if (tier == 0) return number
      var postfix = SI_POSTFIXES[tier]
      var scale = Math.pow(10, tier * 3)
      var scaled = number / scale
      var formatted = scaled.toFixed(1) + ''
    if (/\.0$/.test(formatted))
  formatted = formatted.substr(0, formatted.length - 2)
  return formatted + postfix
}