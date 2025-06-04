import { head } from "lodash";
import XLSX from "xlsx";
import { has } from "lodash";
import Contact from "../../models/Contact";
import CheckContactNumber from "../WbotServices/CheckNumber";
import { logger } from "../../utils/logger";
import fs from "fs";

export async function ImportContacts(
  companyId: number,
  file: Express.Multer.File | undefined
) {
  let contacts = [];

  if (file?.path.endsWith('.csv')) {
    // Processar CSV
    const fileContent = fs.readFileSync(file.path, 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim());
    const headers = lines[0].split(';').map(h => h.trim());
    
    contacts = lines.slice(1).map(line => {
      const values = line.split(';').map(v => v.trim());
      const row = headers.reduce((obj, header, index) => {
        obj[header.toLowerCase()] = values[index] || '';
        return obj;
      }, {} as any);

      let name = "";
      let number = "";
      let email = "";

      if (has(row, "nome") || has(row, "name")) {
        name = row["nome"] || row["name"];
      }

      if (
        has(row, "numero") ||
        has(row, "número") ||
        has(row, "number") ||
        has(row, "telefone")
      ) {
        number = row["numero"] || row["número"] || row["number"] || row["telefone"];
        number = `${number}`.replace(/\D/g, "");
      }

      if (
        has(row, "email") ||
        has(row, "e-mail")
      ) {
        email = row["email"] || row["e-mail"];
      }

      return { name, number, email, companyId };
    });
  } else {
    // Processar XLSX
    const workbook = XLSX.readFile(file?.path as string);
    const worksheet = head(Object.values(workbook.Sheets)) as any;
    const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 0 });
    contacts = rows.map(row => {
      let name = "";
      let number = "";
      let email = "";

      if (has(row, "nome") || has(row, "Nome")) {
        name = row["nome"] || row["Nome"];
      }

      if (
        has(row, "numero") ||
        has(row, "número") ||
        has(row, "Numero") ||
        has(row, "Número")
      ) {
        number = row["numero"] || row["número"] || row["Numero"] || row["Número"];
        number = `${number}`.replace(/\D/g, "");
      }

      if (
        has(row, "email") ||
        has(row, "e-mail") ||
        has(row, "Email") ||
        has(row, "E-mail")
      ) {
        email = row["email"] || row["e-mail"] || row["Email"] || row["E-mail"];
      }

      return { name, number, email, companyId };
    });
  }

  const contactList: Contact[] = [];

  for (const contact of contacts) {
    const [newContact, created] = await Contact.findOrCreate({
      where: {
        number: `${contact.number}`,
        companyId: contact.companyId
      },
      defaults: contact
    });
    if (created) {
      contactList.push(newContact);
    }
  }

  if (contactList) {
    for (let newContact of contactList) {
      try {
        const response = await CheckContactNumber(newContact.number, companyId);
        const number = response.jid.replace(/\D/g, "");
        newContact.number = number;
        await newContact.save();
      } catch (e) {
        logger.error(`Número de contato inválido: ${newContact.number}`);
      }
    }
  }

  return contactList;
}
