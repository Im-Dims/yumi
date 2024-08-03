import axios from 'axios';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import mime from 'mime-types';
import FormData from 'form-data';
import Jimp from 'jimp';
import { fileTypeFromBuffer } from 'file-type';
import jimp from 'jimp';
import minee from 'mime-types';
import util from 'util';
const { read, MIME_JPEG, RESIZE_BILINEAR } = jimp;
import { tmpdir } from 'os';

class Function {
  delay(time) {
    return new Promise((res) => setTimeout(res, time));
  }

  ucword(str) {
    return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
      return $1.toUpperCase();
    });
  }

  isUrl(url) {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/, 'gi'));
  }

  isNumber(input) {
    if (typeof input !== 'string') {
      return false;
    }
    const regex = /^[0-9]+$/;
    return regex.test(input);
  }

  async fetchJson(url, options = {}) {
    try {
      const result = await (await fetch(url, {
        headers: options,
      })).json();
      return result;
    } catch (e) {
      return {
        status: false,
        msg: `System cannot detect JSON!`,
      };
    }
  }

  formatNumber(integer) {
    let numb = parseInt(integer);
    return Number(numb).toLocaleString().replace(/,/g, '.');
  }

  h2k(integer) {
    let numb = parseInt(integer);
    return new Intl.NumberFormat('en-US', {
      notation: 'compact',
    }).format(numb);
  }

  randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  async fetchBuffer(file, options = {}) {
    return new Promise(async (resolve, reject) => {
      try {
        if (this.isUrl(file)) {
          let buff = await (await axios.get(file, {
            responseType: "arraybuffer",
            headers: options,
          })).data;
          resolve(buff);
        } else {
          let buff = fs.readFileSync(file);
          resolve(buff);
        }
      } catch (e) {
        return {
          status: false,
          msg: `System cannot detect Buffer!`,
        };
      }
    });
  }

  texted(type, text) {
    switch (type) {
      case 'BulletedList':
        return '- ' + text;
      break;
      case 'BlockQuote':
        return '> ' + text;
      break;
      case 'InlineCode':
        return '`' + text + '`';
      break;
      case 'bold':
        return '*' + text + '*';
      break;
      case 'italic':
        return '_' + text + '_';
      break;
      case 'strikethrough':
        return '~' + text + '~';
      break;
      case 'monospace':
        return '```' + text + '```';
    }
  }

  example(usedPrefix, command, args) {
    return `• ${this.texted('bold', 'Example')} : ${usedPrefix + command} ${args}`;
  }

  toTime(ms) {
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
  }

  filename(extension) {
    return `${Math.floor(Math.random() * 10000)}.${extension}`;
  }

  uuid() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      var y = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  random(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  formatSize(size) {
    function round(value, precision) {
      var multiplier = Math.pow(10, precision || 0);
      return Math.round(value * multiplier) / multiplier;
    }
    var megaByte = 1024 * 1024;
    var gigaByte = 1024 * megaByte;
    var teraByte = 1024 * gigaByte;
    if (size < 1024) {
      return size + ' B';
    } else if (size < megaByte) {
      return round(size / 1024, 1) + ' KB';
    } else if (size < gigaByte) {
      return round(size / megaByte, 1) + ' MB';
    } else if (size < teraByte) {
      return round(size / gigaByte, 1) + ' GB';
    } else {
      return round(size / teraByte, 1) + ' TB';
    }
    return '';
  }

  async getFile(source, filename, referer) {
    return new Promise(async (resolve) => {
      try {
        if (Buffer.isBuffer(source)) {
          let ext, mime;
          try {
            mime = await (await fileTypeFromBuffer(source)).mime;
            ext = await (await fileTypeFromBuffer(source)).ext;
          } catch {
            mime = minee.lookup(filename ? filename.split('.').pop() : 'txt');
            ext = minee.extension(mime);
          }
          let extension = filename ? filename.split('.').pop() : ext;
          let size = Buffer.byteLength(source);
          let filepath = tmpdir() + '/' + (this.uuid() + '.' + ext);
          let file = fs.writeFileSync(filepath, source);
          let name = filename || path.basename(filepath);
          let data = {
            status: true,
            file: filepath,
            filename: name,
            mime: mime,
            extension: ext,
            size: await this.getSize(size),
            bytes: size,
          };
          return resolve(data);
        } else if (source.startsWith('./')) {
          let ext, mime;
          try {
            mime = await (await fileTypeFromBuffer(source)).mime;
            ext = await (await fileTypeFromBuffer(source)).ext;
          } catch {
            mime = minee.lookup(filename ? filename.split('.').pop() : 'txt');
            ext = minee.extension(mime);
          }
          let extension = filename ? filename.split('.').pop() : ext;
          let size = fs.statSync(source).size;
          let data = {
            status: true,
            file: source,
            filename: path.basename(source),
            mime: mime,
            extension: ext,
            size: await this.getSize(size),
            bytes: size,
          };
          return resolve(data);
        } else {
          axios
            .get(source, {
              responseType: 'stream',
              headers: {
                Referer: referer || '',
              },
            })
            .then(async (response) => {
              let extension = filename ? filename.split('.').pop() : mime.extension(response.headers['content-type']);
              let file = fs.createWriteStream(`${tmpdir()}/${this.uuid() + "." + extension}`);
              let name = filename || path.basename(file.path);
              response.data.pipe(file);
              file.on('finish', async () => {
                let data = {
                  status: true,
                  file: file.path,
                  filename: name,
                  mime: mime.lookup(file.path),
                  extension: extension,
                  size: await this.getSize(response.headers["content-length"] ? response.headers["content-length"] : 0),
                  bytes: response.headers["content-length"] ? response.headers["content-length"] : 0,
                };
                resolve(data);
                file.close();
              });
            });
        }
      } catch (e) {
        console.log(e);
        resolve({
          status: false,
        });
      }
    });
  }

  async getSize(str) {
    if (!isNaN(str)) return this.formatSize(str);
    let header = await (await axios.get(str)).headers;
    return this.formatSize(header['content-length']);
  }

  sizeLimit(str, max) {
    let data;
    if (str.match('G') || str.match('GB') || str.match('T') || str.match('TB')) return data = {
      oversize: true,
    };
    if (str.match('M') || str.match('MB')) {
      let first = str.replace(/MB|M|G|T/g, '').trim();
      if (isNaN(first)) return data = {
        oversize: true,
      };
      if (first > max) return data = {
        oversize: true,
      };
      return data = {
        oversize: false,
      };
    } else {
      return data = {
        oversize: false,
      };
    }
  }

  jsonFormat(obj) {
    try {
      let print = (obj && (obj.constructor.name == 'Object' || obj.constructor.name == 'Array')) ? util.format(JSON.stringify(obj, null, 2)) : util.format(obj);
      return print;
    } catch {
      return util.format(obj);
    }
  }

  toDate(ms) {
    let temp = ms;
    let days = Math.floor(ms / (24 * 60 * 60 * 1000));
    let daysms = ms % (24 * 60 * 60 * 1000);
    let hours = Math.floor((daysms) / (60 * 60 * 1000));
    let hoursms = ms % (60 * 60 * 1000);
    let minutes = Math.floor((hoursms) / (60 * 1000));
    let minutesms = ms % (60 * 1000);
    let sec = Math.floor((minutesms) / (1000));
    if (days == 0 && hours == 0 && minutes == 0) {
      return "Recently"
    } else {
      return days + "D " + hours + "H " + minutes + "M";
    }
  }

  timeFormat(value) {
    const sec = parseInt(value, 10);
    let hours = Math.floor(sec / 3600);
    let minutes = Math.floor((sec - (hours * 3600)) / 60);
    let seconds = sec - (hours * 3600) - (minutes * 60);
    if (hours < 10) hours = '0' + hours;
    if (minutes < 10) minutes = '0' + minutes;
    if (seconds < 10) seconds = '0' + seconds;
    if (hours == parseInt('00')) return minutes + ':' + seconds;
    return hours + ':' + minutes + ':' + seconds;
  }

  makeId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  jsonRandom(file) {
    let json = JSON.parse(fs.readFileSync(file));
    return json[Math.floor(Math.random() * json.length)];
  }

  async reSize(buffer, x, z) {
    return new Promise(async (resolve, reject) => {
      var buff = await read(buffer);
      var ab = await buff.resize(x, z).getBufferAsync(MIME_JPEG);
      resolve(ab);
    });
  }

  async shortlink(url) {
    let isurl = /https?:\/\//.test(url);
    return isurl ? (await axios.get('https://tinyurl.com/api-create.php?url=' + encodeURIComponent(url))).data : '';
  }

  async generateProfilePicture(buffer) {
    const jimp = await Jimp.read(buffer);
    const min = jimp.getWidth();
    const max = jimp.getHeight();
    const cropped = jimp.crop(0, 0, min, max);
    return {
      img: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),
      preview: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),
    };
  }

  removeItem(arr, value) {
    let index = arr.indexOf(value);
    if (index > -1) arr.splice(index, 1);
    return arr;
  }

  Styles(text, style = 1) {
    var xStr = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('');
    var yStr = Object.freeze({
      1: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ1234567890'
    });
    var replacer = [];
    xStr.map((v, i) => replacer.push({
      original: v,
      convert: yStr[style].split('')[i]
    }));
    var str = text.toLowerCase().split('');
    var output = [];
    str.map(v => {
      const find = replacer.find(x => x.original == v);
      find ? output.push(find.convert) : output.push(v);
    });
    return output.join('');
  }
}

export default Function;