import GetDefaultWhatsApp from "../../helpers/GetDefaultWhatsApp";
import { getWbot } from "../../libs/wbot";
import Contact from "../../models/Contact";
import { logger } from "../../utils/logger";

const ImportContactsService = async (userId:number): Promise<void> => {
  const defaultWhatsapp = await GetDefaultWhatsApp(userId);

  const wbot = getWbot(defaultWhatsapp.id);

  let phoneContacts;

  try {
    phoneContacts = await wbot.getContacts();
  } catch (err) {
    logger.error(`Could not get whatsapp contacts from phone. Err: ${err}`);
  }

  console.log("ImportContactsService::phoneContacts", phoneContacts)

  if (phoneContacts) {
    await Promise.all(
      phoneContacts.map(async ({ number, name, isMyContact }) => {
        if (!number) {
          return null;
        }
        name = isMyContact ? name : `Nuevo contacto ${number.slice(-4)}`;

        const numberExists = await Contact.findOne({
          where: { number }
        });

        if (numberExists && numberExists.name != name && isMyContact) {
          console.log("Nombre de contacto actualizado: ", numberExists.name, name)
          numberExists.update({ name });
        } 

        if (numberExists) return null;

        return Contact.create({ number, name });
      })
    );
  }
};

export default ImportContactsService;
