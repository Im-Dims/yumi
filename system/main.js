import "../storage/config.js"
import { Client, Serialize } from "./lib/serialize.js"
import pino from "pino"
import { fileURLToPath } from "url"
import chalk from "chalk"
import readline from "readline"
import chokidar from "chokidar"
import { Boom } from "@hapi/boom"
import NodeCache from "node-cache"
import baileys from "@whiskeysockets/baileys"
import os from "os"
import axios from "axios"
import fs from "fs"
import { format, promisify, isDeepStrictEqual } from 'util';
import { plugins, loadPluginFiles, reload, pluginFolder, pluginFilter } from "./lib/plugins.js";

// Global API Update
global.API = (name, path = "/", query = {}, apikeyqueryname) => {
  const baseUrl = name in global.APIs ? global.APIs[name] : name;
  const apiKey = apikeyqueryname ? global.APIKeys[baseUrl] : "";
  const queryParams = new URLSearchParams({ ...query, ...(apikeyqueryname && apiKey ? { [apikeyqueryname]: apiKey } : {}) });
  return baseUrl + path + (queryParams.toString() ? "?" + queryParams : "");
};

const logger = pino({ timestamp: () => `,"time":"${new Date().toJSON()}"` }).child({ class: "irull2nd" }); logger.level = "fatal"
global.store = baileys.makeInMemoryStore({ logger })

if (global.write_store) store.readFromFile("./storage/store.json");
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))
const database = (new (await import("./lib/database.js")).default())
const ini = global.opts.qr

async function start() {
    process.on("uncaughtException", (err) => console.error(err))
    process.on("unhandledRejection", (err) => console.error(err))

    const content = await database.read()
    if (content && Object.keys(content).length === 0) {
        global.db = { users: {}, chats: {}, stats: {}, msgs: {}, saweria: {}, sticker: {}, settings: {}, ...(content || {}) }
        await database.write(global.db)
    } else {
        global.db = content
    }
    
    const msgRetryCounterCache = new NodeCache()
    const { state, saveCreds } = await baileys.useMultiFileAuthState("./storage/temp/session")
    
    const sock = baileys.default({
        msgRetryCounterMap: {},
        logger: logger,
        printQRInTerminal: ini,
        auth: {
           creds: state.creds,
           keys: baileys.makeCacheableSignalKeyStore(state.keys, logger),
        },
        browser: baileys.Browsers.windows("Safari"),
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        getMessage: async (key) => {
           let jid = baileys.jidNormalizedUser(key.remoteJid)
           let msg = await store.loadMessage(jid, key.id)
    
           return msg?.message || ""
           return proto.Message.fromObject({});
        },
        msgRetryCounterCache,
        defaultQueryTimeoutMs: 0,
        connectTimeoutMs: 60000,
        generateHighQualityLinkPreview: true,
        syncFullHistory: false,
        markOnlineOnConnect: true
    })

    store.bind(sock.ev)
    await Client({ sock, store })
    global.sock = sock
    
    loadPluginFiles(pluginFolder, pluginFilter, {
      logger: sock.logger,
      recursiveRead: true,
    }).then((_) => console.log(chalk.bgBlue('Successfully Obtaining Plugins Files.'))).catch(console.error);
    
    if (global.opts.pairing) {
    if (!sock.authState.creds.registered) {
        let phoneNumber
        if (!!global.pairingNumber) {
            phoneNumber = global.pairingNumber.replace(/[^0-9]/g, "")

            if (!Object.keys(baileys.PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
                console.log(chalk.bgBlack(chalk.redBright("Start with your country's WhatsApp code, Example : 62xxx")))
                process.exit(0)
            }
        } else {
            phoneNumber = await question(chalk.bgBlack(chalk.greenBright("Please type your WhatsApp number : ")))
            phoneNumber = phoneNumber.replace(/[^0-9]/g, "")

            if (!Object.keys(baileys.PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
                console.log(chalk.bgBlack(chalk.redBright("Start with your country's WhatsApp code, Example : 62xxx")))

                phoneNumber = await question(chalk.bgBlack(chalk.greenBright("Please type your WhatsApp number : ")))
                phoneNumber = phoneNumber.replace(/[^0-9]/g, "")
                rl.close()
            }
        }
        setTimeout(async () => {
            let code = await sock.requestPairingCode(phoneNumber)
            code = code?.match(/.{1,4}/g)?.join("-") || code
            console.log(chalk.black(chalk.bgGreen("Your Pairing Code : ")), chalk.black(chalk.white(code)))
        }, 3000)
    }
    }

    sock.ev.on("connection.update", async (update) => {
         const { receivedPendingNotifications } = update //Mengatasi Bug Session
         if (receivedPendingNotifications) {
         sock.ev.flush()
         }
         
        const { lastDisconnect, connection, qr } = update

        if (connection) sock.logger.info(`Connection Status : ${connection}`)
        if (connection === "close") {
            let reason = new Boom(lastDisconnect?.error)?.output.statusCode

            if (reason === baileys.DisconnectReason.badSession) {
                console.log("Session File is Corrupt, Please Delete Session and Scan Again")
                process.send("reset")
            } else if (reason === baileys.DisconnectReason.connectionClosed) {
                console.log("Connection closed, reconnect....")
                await start()
            } else if (reason === baileys.DisconnectReason.connectionLost) {
                console.log("Connection Lost from Server, reconnect...")
                await start()
            } else if (reason === baileys.DisconnectReason.connectionReplaced) {
                console.log("Connection Changed, New Session Opened, Please Close Current Session First")
                process.exit(1)
            } else if (reason === baileys.DisconnectReason.loggedOut) {
                console.log("Device Exited, Please Scan Again")
                process.exit(1)
            } else if (reason === baileys.DisconnectReason.restartRequired) {
                console.log("Restart Required, Restart...")
                await start()
            } else if (reason === baileys.DisconnectReason.timedOut) {
                console.log("Connection Timed Out, Restart...")
                process.send("reset")
            } else if (reason === baileys.DisconnectReason.multideviceMismatch) {
                console.log("Multi device incompatibility, please scan again")
                process.exit(0)
            } else {
                console.log(reason)
                process.send("reset")
            }
        }
        
        if (connection === "connecting") {
          console.log(`${chalk.bold.green(`Yumi Bot WhatsApp`)}`)
          console.log(`${chalk.yellow.bgBlack(`Created By Dims.`)}`)
          console.log(chalk.blue(`[ Is Connecting ]`));
      }
     
        if (connection === "open") {
          const { jid } = sock.user;
          await func.sleep(5000);
          console.log(chalk.blue(`Connecting to WhatsApp web`));
          console.log(chalk.green(`[ Connected ] ` + JSON.stringify(sock.user, null, 2)));
          await func.sleep(1000);            
            const currentTime = new Date();
            const pingSpeed = new Date() - currentTime;
            const formattedPingSpeed = pingSpeed < 0 ? 'N/A' : `${pingSpeed}ms`;
            const infoMsg = `Helloo, Your WhatsApp bot is now active.\n\n*[ About the system ]*\nSpeed: ${formattedPingSpeed}\nDate:  ${currentTime.toDateString()}, ${currentTime.toLocaleDateString('id-ID', { weekday: 'long' })}\nCurrent Time: ${currentTime}`;
            await sock.sendMessage(`6281398274790@s.whatsapp.net`, { text: infoMsg, mentions: [owner + '@s.whatsapp.net', jid] }, { quoted: null });
        }
        });

        sock.ev.on("creds.update", saveCreds);

  // add contacts update to store
  sock.ev.on("contacts.update", (update) => {
        for (let contact of update) {
            let id = baileys.jidNormalizedUser(contact.id)
            if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
        }
    })

  // add contacts upsert to store
  sock.ev.on("contacts.upsert", (update) => {
    for (let contact of update) {
      let id = baileys.jidNormalizedUser(contact.id);
      if (store && store.contacts)
        store.contacts[id] = { ...(contact || {}), isContact: true };
    }
  });

  // nambah perubahan grup ke store
  sock.ev.on("groups.update", (updates) => {
    for (const update of updates) {
      const id = update.id;
      if (store.groupMetadata[id]) {
        store.groupMetadata[id] = {
          ...(store.groupMetadata[id] || {}),
          ...(update || {}),
        };
      }
    }
  });

  sock.ev.on("messages.upsert", async (message) => {
    if (!message.messages) return;
    const m = await Serialize(sock, message.messages[0]);
      if (store.groupMetadata && Object.keys(store.groupMetadata).length === 0)
      store.groupMetadata = await sock.groupFetchAllParticipating();
    await (await import(`./handler.js?v=${Date.now()}`)).handler(sock, m, message);
  });

  sock.ev.on("group-participants.update", async (message) => {
    await (await import(`./handler.js?v=${Date.now()}`)).participantsUpdate(message);
  });

  sock.ev.on("groups.update", async (update) => {
    await (await import(`./handler.js?v=${Date.now()}`)).groupsUpdate(update);
  });

  sock.ev.on("call", async (json) => {
    await (await import(`./handler.js?v=${Date.now()}`)).rejectCall(json);
  });

  sock.ev.on("presence.update", async (presenceUpdateEvent) => {
    try {
      await (await import(`./handler.js?v=${Date.now()}`)).presenceUpdate(presenceUpdateEvent);
    } catch (error) {
      console.error("Error handling presence update:", error);
    }
  });

  setInterval(async () => {
    if (global.write_store) {
      store.writeToFile("./storage/store.json", true)
    }
  }, 10 * 1000)

  setInterval(async () => {
    if (global.db) await database.write(global.db)
  }, 30000)
  
  return sock
}
start()

/** realod file **/
let file = fileURLToPath(import.meta.url)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright("Update main.js"))
  import(`${file}?update=${Date.now()}`)
})
