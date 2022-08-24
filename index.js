const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '5477636965:AAEOXoaoVRpw7J4o7ZIbrmwUMbItfLRut64';

const bot = new TelegramApi(token, { polling: true })

const chats = {}



const startGame = async (chatId) => {
   await bot.sendMessage(chatId, `сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать :)`)
   const randomNumber = Math.floor(Math.random() * 10)
   chats[chatId] = randomNumber;
   await bot.sendMessage(chatId, 'отгадай', gameOptions);
}

const start = () => {
   bot.setMyCommands([
      { command: '/start', description: 'начальное приветствие' },
      { command: '/info', description: 'получить информацию о пользователе' },
      { command: '/game', description: 'игра: угадай цифру' },
   ])

   bot.on("message", async msg => {
      const text = msg.text;
      const chatId = msg.chat.id;

      if (text === '/start') {
         await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/d2e/23d/d2e23d46-38b0-3598-9367-7726e320f794/2.webp')
         return bot.sendMessage(chatId, `добро пожаловать в самый лучший телеграм бот!`)
      }
      if (text === '/info') {
         return bot.sendMessage(chatId, `тебя зовут ${msg.from.first_name} ${msg.from.last_name}!`)
      }
      if (text === '/game') {
        return startGame(chatId);
      }
      return bot.sendMessage(chatId, 'я тебя не понимаю(');
   })

   bot.on('callback_query', msg => {
      const data = msg.data;
      const chatId = msg.message.chat.id;
      if (data === '/again') {
        return startGame(chatId);
      }
      if (data === chats[chatId]) {
         return bot.sendMessage(chatId, `поздравляю, ты угадал/а цифру ${chats[chatId]}`, againOptions)
      } else {
         return bot.sendMessage(chatId, `к сожалению, или к счастью, ты не угадал/а. бот загадал цифру ${chats[chatId]}`, againOptions)
      }
   })
}

start()