import { Op } from "sequelize";
import TicketTraking from "./models/TicketTraking";
import moment from "moment";
import Ticket from "./models/Ticket";
import Whatsapp from "./models/Whatsapp";
import { getIO } from "./libs/socket";
import { logger } from "./utils/logger";
import ShowTicketService from "./services/TicketServices/ShowTicketService";

export const TransferTicketQueue = async (): Promise<void> => {
  const io = getIO();

  logger.info("Iniciando verificação de tickets para transferência automática");

  // buscar os tickets que estão pendentes
  const tickets = await Ticket.findAll({
    where: {
      status: "pending",
      queueId: {
        [Op.is]: null
      },
    },
  });

  logger.info(`Encontrados ${tickets.length} tickets pendentes para análise`);

  // varrer os tickets e verificar se algum deles está com o tempo estourado
  for (const ticket of tickets) {
    const wpp = await Whatsapp.findOne({
      where: {
        id: ticket.whatsappId
      }
    });

    logger.info(`Verificando ticket ${ticket.id}:
      - WhatsApp ID: ${ticket.whatsappId}
      - Tempo para transferir: ${wpp?.timeToTransfer}
      - Fila destino: ${wpp?.transferQueueId}
    `);

    if (!wpp) {
      logger.warn(`WhatsApp não encontrado para o ticket ${ticket.id}`);
      continue;
    }

    if (!wpp.timeToTransfer || !wpp.transferQueueId) {
      logger.warn(`WhatsApp ${wpp.id} não tem configuração de transferência automática`);
      continue;
    }

    if (wpp.timeToTransfer === 0) {
      logger.warn(`WhatsApp ${wpp.id} tem tempo de transferência zerado`);
      continue;
    }

    let dataLimite = new Date(ticket.updatedAt);
    dataLimite.setMinutes(dataLimite.getMinutes() + wpp.timeToTransfer);

    const agora = new Date();
    logger.info(`Ticket ${ticket.id}:
      - Última atualização: ${ticket.updatedAt}
      - Limite para transferir: ${dataLimite}
      - Hora atual: ${agora}
    `);

    if (agora > dataLimite) {
      logger.info(`Transferindo ticket ${ticket.id} para a fila ${wpp.transferQueueId}`);

      await ticket.update({
        queueId: wpp.transferQueueId,
      });

      const ticketTraking = await TicketTraking.findOne({
        where: {
          ticketId: ticket.id
        },
        order: [["createdAt", "DESC"]]
      });

      if (ticketTraking) {
        await ticketTraking.update({
          queuedAt: moment().toDate(),
          queueId: wpp.transferQueueId,
        });
      }

      const currentTicket = await ShowTicketService(ticket.id, ticket.companyId);

      io.to(ticket.status)
        .to("notification")
        .to(ticket.id.toString())
        .emit(`company-${ticket.companyId}-ticket`, {
          action: "update",
          ticket: currentTicket,
          traking: "created ticket 33"
        });

      logger.info(`Ticket ${ticket.id} transferido com sucesso para a fila ${wpp.transferQueueId}`);
    } else {
      logger.info(`Ticket ${ticket.id} ainda não atingiu o tempo limite para transferência`);
    }
  }
};
