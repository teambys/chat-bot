const TelegramBot = require('node-telegram-bot-api');
   const axios = require('axios');

   // Replace with your Telegram bot token
   const token = 'YOUR_TELEGRAM_BOT_TOKEN';

   // Create a bot that uses 'polling' to fetch new updates
   const bot = new TelegramBot(token, { polling: true });

   // Define the ChatGPT API endpoint
   const CHATGPT_API_URL = 'https://chatx-api-five.vercel.app/api/chat';

   // Handle incoming text messages
   bot.on('message', async (msg) => {
     const chatId = msg.chat.id;
     const userMessage = msg.text;

     // Send "typing..." action
     bot.sendChatAction(chatId, 'typing');

     try {
       // Send a placeholder message
       const sentMessage = await bot.sendMessage(chatId, 'Processing...');

       // Get response from ChatGPT API
       const response = await getChatGptResponse(userMessage);

       // Edit the message with the actual response
       bot.editMessageText(response, {
         chat_id: chatId,
         message_id: sentMessage.message_id
       });
     } catch (error) {
       console.error('Error processing message:', error);
       bot.sendMessage(chatId, 'An error occurred. Please try again later.');
     }
   });

   // Function to get response from ChatGPT API
   async function getChatGptResponse(message) {
     try {
       const res = await axios.get(CHATGPT_API_URL, {
         params: { question: message }
       });
       return res.data.data || 'Sorry, I could not understand your message.';
     } catch (error) {
       throw new Error('Error reaching the ChatGPT API.');
     }
   }
