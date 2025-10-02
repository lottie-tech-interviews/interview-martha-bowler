import { promises as fs } from "fs";
import { createReadStream } from "fs";
import { createInterface } from "readline";
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

	private async findPartnerInCsv(filePath: string, targetId: number): Promise<Partner | null> {
		const fileStream = createReadStream(filePath);
		const rl = createInterface({
			input: fileStream,
			crlfDelay: Infinity,
		});

		let isFirstLine = true;

		for await (const line of rl) {
			// Skip header row
			if (isFirstLine) {
				isFirstLine = false;
				continue;
			}

			if (!line.trim()) continue;

			const [idStr, ppw] = line.split(";");
			const id = Number(idStr);

			// Found the partner, close the stream and return
			if (id === targetId) {
				rl.close();
				fileStream.close();
				return {
					id,
					ppw: Number(ppw),
				};
			}
		}

		return null;
	}

	async getPartnerPriceById(id: number): Promise<Partner | null> {
		const cachedPath = path.resolve(process.cwd(), "data/prices.csv");
		
		// First, try to find the partner in the cached file if it exists
		try {
			await fs.access(cachedPath);
			const partner = await this.findPartnerInCsv(cachedPath, id);
			if (partner) {
				return partner;
			}
		} catch (error) {
			// File doesn't exist or can't be accessed, will download it
		}
		
		// If not found in cache or cache doesn't exist, download and search again
		const pricesPath = await this.downloadPricesFile();
		return await this.findPartnerInCsv(pricesPath, id);
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
