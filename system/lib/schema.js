export default function loadDatabase(m) {
    let isNumber = x => typeof x === "number" && !isNaN(x)
    let isBoolean = x => typeof x === "boolean" && Boolean(x)
    let user = db.users[m.sender], chat = db.chats[m.chat], sett = db.settings

    if (typeof user !== "object") db.users[m.sender] = {}
    if (user) {
      if (!('registered' in user)) user.registered = false
      if (!user.registered) { 
        if (!('name' in user)) user.name = m.name 
        if (!isNumber(user.age)) user.age = -1 
        if (!isNumber(user.regTime)) user.regTime = -1
      }
      
      if (!isNumber(user.afk)) user.afk = -1
      if (!('afkReason' in user)) user.afkReason = ''
      
      if (!('banned' in user)) user.banned = false
      if (!('permaban' in user)) user.permaban = false
      if (!isNumber(user.lastbanned)) user.lastbanned = 0
      if (!isNumber(user.bannedcd)) user.bannedcd = 0
      if (!isNumber(user.warn)) user.warn = 0
      
      if (!('viewstatus' in user)) user.viewstatus = false
      
      if (!isNumber(user.level)) user.level = 0
      if (!('role' in user)) user.role = 'Beginner'
      if (!('autolevelup' in user)) user.autolevelup = true

      if (!isNumber(user.money)) user.money = 0
      if (!isNumber(user.exp)) user.exp = 0
      if (!isNumber(user.limit)) user.limit = 20
      
      if (!isNumber(user.lastclaim)) user.lastclaim = 0
      
      if (!isNumber(user.premium)) user.premium = false
      if (!isNumber(user.premiumTime)) user.premiumTime = 0
    } else {
    db.users[m.sender] = {
      registered: false,
      name: m.name,
      age: -1,
      regTime: -1,
      
      afk: -1,
      afkReason: '',
      
      banned: false,
      permaban: false,
      lastbanned: 0,
      bannedcd: 0,
      warn: 0,
      
      viewstatus: false,
      
      level: 0,
      role: 'Beginner',
      autolevelup: true,

      money: 0,
      exp: 0,
      limit: 20,

      lastclaim: 0,
    
      premium: false,
      premiumTime: 0
      }
    }
    if (m.isGroup) {
      if (typeof chat !== "object") db.chats[m.chat] = {}
      if (chat) {
        if (!isBoolean(chat.antitoxic)) chat.antitoxic = false
        if (!isBoolean(chat.antibot)) chat.antibot = false
        if (!isBoolean(chat.antiaudio)) chat.antiaudio = false
        if (!isBoolean(chat.antivideo)) chat.antivideo = false
        if (!isBoolean(chat.antifoto)) chat.antifoto = false
        if (!isBoolean(chat.antilink)) chat.antilink = false
        if (!isBoolean(chat.antispam)) chat.antispam = false
        if (!isBoolean(chat.antidelete)) chat.antidelete = true
        if (!isBoolean(chat.detect)) chat.detect = true
        if (!isNumber(chat.expired)) chat.expired = 0
        if (!isBoolean(chat.isBanned)) chat.isBanned = false
        if (!isBoolean(chat.nsfw)) chat.nsfw = false
        if (!isBoolean(chat.simi)) chat.simi = false
        if (!isBoolean(chat.viewOnce)) chat.viewonce = false
        if (!isBoolean(chat.welcome)) chat.welcome = true
      } else {
      db.chats[m.chat] = {
        antitoxic: false,
        antibot: false,
        antiaudio: false,
        antivideo: false,
        antifoto: false,
        antilink: false,
        antispam: false,      
        antidelete: true,
        detect: true,
        expired: 0,
        isBanned: false,
        nsfw: false,
        simi: false,
        viewonce: false,
        welcome: true
        }
      }
    }
    if (typeof sett !== "object") db.settings = {}
      if (sett) {
        if (!isNumber(sett.style)) sett.style = 1
        if (!isBoolean(sett.anticall)) sett.anticall = true
        if (!isBoolean(sett.autoread)) sett.autoread = true
        if (!isBoolean(sett.readsw)) sett.readsw = false        
        if (!isBoolean(sett.gconly)) sett.gconly = false
        if (!isBoolean(sett.pconly)) sett.pconly = false
        if (!isBoolean(sett.self)) sett.self = false
        if (!isBoolean(sett.restrict)) sett.restrict = false
      } else {
        db.settings = {
        style: 1,
        anticall: true,
        autoread: true,
        readsw: false,
        gconly: false,
        pconly: false,
        self: false,
        restrict: false
        }
      }
}