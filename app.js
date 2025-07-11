/**
 * Imports 
 * 
 */

const { Telegraf } = require('telegraf');
const fs = require('fs');
const pathAdress = require('path');
const ListProjectsRepository = require('./repositories/list_project_repository');
require('dotenv').config(); // Load environment variables

// Create a new Telegraf bot instance
const bot = new Telegraf(process.env.BOT_TOKEN);

// Define keyboard configurations
const requestPhoneKeyboard = {
  reply_markup: {
    one_time_keyboard: true,
    keyboard: [
      [{ text: "📲 Envie numero de celular", request_contact: true }],
      ["Cancelar"]
    ]
  }
};

const requestLocationKeyboard = {
  reply_markup: {
    one_time_keyboard: true,
    keyboard: [
      [{ text: "My location", request_location: true }],
      ["Cancelar"]
    ]
  }
};

// Utility function to check if a value is numeric
function isNumeric(num) {
  return !isNaN(num);
}

const nameMapping = new Map([
  ['getListTicketsPreventivo', 'getListTicketsPrev'],
  ['getListTicketsCorrectivo', 'getListTicketsCORR'],
  ['getListTicketsAbastecimiento', 'getListTicketsAbas'],
  ['getListTicketsMotorGeneradores(MGP)', 'getListTicketsMGP']
]);

handleProjectAction('Preventivo');
handleProjectAction('Correctivo');
handleProjectAction('Abastecimiento');
handleProjectAction('Motor Generadores (MGP)');

// Helper function to create options for inline keyboards getListTicketsPrev
const createInlineOptions = async (functionName, context) => {

  functionName = getReplacementName(functionName);

  return {
    reply_markup: JSON.stringify({
      inline_keyboard: await new ListProjectsRepository()[functionName](context.message.text)
    }),
    one_time_keyboard: true,
    selective: true
  };
};

// Start command handler
bot.command('start', async (ctx) => {
  const userExists = await new ListProjectsRepository().getExistsUser(ctx.from.id);

  if (userExists.RESULTADO === 'NO') {
    ctx.reply("Por favor enviar su informacion para ser autorizado a realizar consultas!", requestPhoneKeyboard);
  } else {
    const message = userExists.AUTH === '1'
      ? `Bienvenidos a Goreport. ${ctx.from.first_name}! , Seleccione un Proyecto!`
      : `Bienvenidos a Goreport. ${ctx.from.first_name}, espere ser autorizado por el Administrador!`;
    
    const options = {
      reply_markup: JSON.stringify({
        inline_keyboard: await new ListProjectsRepository().getListProject()
      }),
      one_time_keyboard: true,
      selective: true
    };

    bot.telegram.sendMessage(ctx.chat.id, message, options).catch(console.error);
  }
});

// Contact handler for user registration
bot.on('contact', async (ctx) => {
  const user = {
    user_id: ctx.update.message.contact.user_id,
    cellphone: ctx.update.message.contact.phone_number,
    firstname: ctx.update.message.contact.first_name
  };

  await new ListProjectsRepository().register_user(user);
  ctx.reply('Gracias por registrarse...', { reply_markup: { remove_keyboard: true } });

  const userExists = await new ListProjectsRepository().getExistsUser(ctx.from.id);

  const options = {
    reply_markup: JSON.stringify({
      inline_keyboard: await new ListProjectsRepository().getListProject()
    }),
    one_time_keyboard: true,
    selective: true
  };

  const message = userExists.AUTH === '1'
    ? `Bienvenidos a Goreport. ${ctx.from.first_name}! , Seleccione un Proyecto!`
    : `Bienvenidos a Goreport. ${ctx.from.first_name}, espere ser autorizado por el Administrador!`;

  bot.telegram.sendMessage(ctx.chat.id, message, options).catch(console.error);
});

// Generic action handler for project selection
const handleProjectAction = (projectName) => {
  bot.action(projectName, ctx => {
    global.globalString = projectName;
    bot.telegram.sendMessage(ctx.chat.id, `Ingrese codigo del Sitio para ${projectName}?`).catch(console.error);
  });
};





const getReplacementName = (oldName) => {
  return nameMapping.get(oldName) || oldName; // Return the new name or the original if not found
}

// Cancel action
bot.hears('Cancelar', ctx => {
  bot.telegram.sendMessage(ctx.chat.id, 'Debe enviar la informacion solicitada!', {
    reply_markup: { remove_keyboard: true }
  }).catch(console.error);
});

// Handle specific button actions
bot.action('btn-1', ctx => {
  bot.telegram.sendMessage(ctx.chat.id, `Ingrese codigo del Sitio para ${global.globalString}?`).catch(console.error);
});

bot.action('btn-2', async (ctx) => {
  const options = {
    reply_markup: JSON.stringify({
      inline_keyboard: await new ListProjectsRepository().getListProject()
    }),
    one_time_keyboard: true,
    selective: true
  };

  bot.telegram.sendMessage(ctx.chat.id, 'Seleccione un Proyecto!', options).catch(console.error);
});

// Handle callback queries for PDF generation
bot.on('callback_query', async (ctx) => {
  if (isNumeric(ctx.callbackQuery.data)) {
    const ticket = ctx.callbackQuery.data;
    const project = global.globalString;
    let url, path, filename, postData;

    switch (project) {
      case 'Preventivo':
     
          url =   process.env.REPORT_PREVENTIVO_URL;
          path = './pdf/Preventivo/';
          filename = `${ctx.callbackQuery.data}.pdf`;
          method = 'POST';
          postData = {
              optionpdf: 0,
              carrier: 2,
              plantilla: 1,
              omitir: 1,
              ticket: ctx.callbackQuery.data
          }; 
        break;

      case 'Correctivo':
        url = `${process.env.REPORT_CORRECTIVO_URL}${ticket}`;
        path = './pdf/Correctivo/';
        filename = `${await new ListProjectsRepository().getListTicketsCORRFile(ticket)}.pdf`;
        break;

      case 'Abastecimiento':
        url = `${process.env.REPORT_ABASTECIMIENTO_URL}${ticket}`;
        path = './pdf/ABAS/';
        filename = `${await new ListProjectsRepository().getListTicketsAbasFile(ticket)}.pdf`;
        break;

      case 'Motor Generadores (MGP)':
        url = `${process.env.REPORT_MOTOR_GENERADORES_URL}${ticket}&selectpdf=1`;
        path = './pdf/MGP/';
        filename = `${await new ListProjectsRepository().getListTicketsMGPFile(ticket)}.pdf`;
        break;

      default:
        return;
    }

    bot.telegram.sendMessage(ctx.chat.id, 'Por favor espere...').catch(console.error);

    const result = await new ListProjectsRepository().Downloadpdf(url, path, filename, postData);

    if (result) {
      bot.telegram.sendMessage(ctx.chat.id, `Pdf de ${project} con #ticket ${ticket}`).catch(console.error);

    //  const pathDoc = path + filename;
    const pathDoc = pathAdress.join(path, filename);
      await ctx.replyWithDocument({ 
        source: fs.createReadStream(pathDoc),
        filename: pathAdress.basename(pathDoc) // This ensures the filename is set correctly
      
      }).finally(() => {
        ctx.reply(`Desea consultar tickets en ${project}?`, {
          reply_markup: {
            inline_keyboard: [
              [{ text: "Si", callback_data: "btn-1" }, { text: "Volver al menu", callback_data: "btn-2" }]
            ]
          }
        });
      });
    } else {

      bot.telegram.sendMessage(ctx.chat.id, `No se pudo descargar el ticket ${ctx.message.text} del proyecto: ${global.globalString}`)
      .catch(console.error)
      .finally(() => {
        ctx.reply(`Desea consultar tickets en ${global.globalString}?`, {
          reply_markup: {
            inline_keyboard: [
              [{ text: "Si", callback_data: "btn-1" }, { text: "Volver al menu", callback_data: "btn-2" }]
            ]
          }
        });
      });
    }
  }
});

// Handle text messages for ticket queries
bot.on('message', async (ctx) => {
  if (global.globalString) {
    const options = await createInlineOptions(`getListTickets${global.globalString.replace(/ /g, '')}`, ctx);

    if (JSON.parse(options.reply_markup).inline_keyboard.length > 0) {
      bot.telegram.sendMessage(ctx.chat.id, `Seleccione un Ticket de ${global.globalString}!`, options).catch(console.error);
    } else {
      bot.telegram.sendMessage(ctx.chat.id, `No existe ticket para ${ctx.message.text} del proyecto: ${global.globalString}`).catch(console.error).finally(() => {
        ctx.reply(`Desea consultar tickets en ${global.globalString}?`, {
          reply_markup: {
            inline_keyboard: [
              [{ text: "Si", callback_data: "btn-1" }, { text: "Volver al menu", callback_data: "btn-2" }]
            ]
          }
        });
      });
    }
  } else {
    const options = {
      reply_markup: JSON.stringify({
        inline_keyboard: await new ListProjectsRepository().getListProject()
      }),
      one_time_keyboard: true,
      selective: true
    };

    bot.telegram.sendMessage(ctx.chat.id, 'Seleccione un Proyecto!', options).catch(console.error);
  }
});


// Error handling
bot.catch( async (err, ctx) => {
  ctx.reply(`Ooops, Se encontro un error: ${err.message}`);
  console.error('Error:', err.message);


  const userExists = await new ListProjectsRepository().getExistsUser(ctx.from.id);

  if (userExists.RESULTADO === 'NO') {
    ctx.reply("Por favor enviar su informacion para ser autorizado a realizar consultas!", requestPhoneKeyboard);
  } else {
    const message = userExists.AUTH === '1'
      ? `Bienvenidos a Goreport. ${ctx.from.first_name}! , Seleccione un Proyecto!`
      : `Bienvenidos a Goreport. ${ctx.from.first_name}, espere ser autorizado por el Administrador!`;
    
    const options = {
      reply_markup: JSON.stringify({
        inline_keyboard: await new ListProjectsRepository().getListProject()
      }),
      one_time_keyboard: true,
      selective: true
    };

    bot.telegram.sendMessage(ctx.chat.id, message, options).catch(console.error);
  }

});

// Start the bot
bot.launch();
