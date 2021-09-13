const { Telegraf } = require('telegraf')
var amqp = require('amqplib')
var wind = -1

var BOT_TOKEN = '1966861903:AAHOpdnMp8kuCAa1iIWxjEJ2m-W1gyGPHak'
const bot = new Telegraf(BOT_TOKEN)
var chatId
bot.start((ctx) => {
  chatId = ctx.update.message.chat.id
  ctx.reply(
    'Welcome, this bot will tell you if where you put the sensors is raining and if there is raining with a strong wind.'
  )
})
bot.launch()

//main
connect_Retrieve_Wind()
connect_Retrieve_Rain()

//funcions
//create a response based on the wheater conidtion
function create_response(r, w) {
  var wind = parseInt(w)
  var rain = parseInt(r)

  if (rain == 0 && wind == -1)
    return 'It rains without wind. Care the clothes on the washing lines.'
  else if (rain == 0 && wind != -1)
    return 'It rains with wind. Remove all the clothes from outside'
}

bot.action('nonna', (ctx) => {
  ctx.deleteMessage()
  var str = " Don't worry: I warned your grandmother to picke the clothes.\n\n "

  ctx.reply(str)
})

//retrieve information about the wind
function connect_Retrieve_Wind() {
  amqp
    .connect(`amqp://guest:guest@192.168.1.5:5672`)
    .then(function (conn) {
      process.once('SIGINT', function () {
        conn.close()
      })
      return conn.createChannel().then(function (ch) {
        var ok = ch.assertQueue('iot/windAlert', { durable: false })

        ok = ok.then(function (_qok) {
          return ch.consume(
            'iot/windAlert',
            function (msg) {
              console.log(
                ' - messaggio ricevuto vento --- ' + msg.content.toString()
              )
              wind = msg.content.toString()
            },
            { noAck: true }
          )
        })

        return ok.then(function (_consumeOk) {
          console.log(' *** Logger started! Waiting for messages WIND... ***\n')
        })
      })
    })
    .catch(console.warn)
}

function connect_Retrieve_Rain() {
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Warn someone to pick the clothes outside',
            callback_data: 'nonna',
          },
        ],
      ],
    },
  }

  amqp
    .connect(`amqp://guest:guest@192.168.1.5:5672`)
    .then(function (conn) {
      process.once('SIGINT', function () {
        conn.close()
      })
      return conn.createChannel().then(function (ch) {
        var ok = ch.assertQueue('iot/rainAlert', { durable: false })

        ok = ok.then(function (_qok) {
          return ch.consume(
            'iot/rainAlert',
            function (msg) {
              console.log(
                ' - messaggio ricevuto pioggia --- ' + msg.content.toString()
              )
              var response = create_response(msg.content.toString(), wind)
              bot.telegram.sendMessage(chatId, response, options)

              wind = -1
              console.log(response)
            },
            { noAck: true }
          )
        })

        return ok.then(function (_consumeOk) {
          console.log(' *** Logger started! Waiting for messages RAIN... ***\n')
        })
      })
    })
    .catch(console.warn)
}
