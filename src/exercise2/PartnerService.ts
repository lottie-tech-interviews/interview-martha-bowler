import { promises as fs } from "fs";
import path from "path";
import { port } from "../config";

export type Partner = {
	id: number;
	ppw: number;
};

export class PartnerService {
	private async readCsvRows(filePath: string): Promise<Partner[]> {
		const text = await fs.readFile(filePath, "utf8");
		const lines = text.split(/\r?\n/).filter(Boolean);

		return lines.slice(1).map((line) => {
			const [idStr, ppw] = line.split(";");
			return {
				id: Number(idStr),
				ppw: Number(ppw),
			};
		});
	}

	async getPartnerPriceById(id: number): Promise<Partner | null> {
		const pricesPath = await this.downloadPricesFile();
		const partners = await this.readCsvRows(pricesPath);
		return partners.find((partner) => partner.id === id) || null;
	}

	async downloadPricesFile(): Promise<string> {
		const response = await fetch(`http://127.0.0.1:${port}/csv/prices`);

		const buffer = await response.arrayBuffer();
		const data = Buffer.from(buffer);

		const outputPath = path.resolve(process.cwd(), "data/prices.csv");
		await fs.writeFile(outputPath, data);

		return outputPath;
	}
}

export const partnerService = new PartnerService();
