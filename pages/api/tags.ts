import { NextApiRequest, NextApiResponse } from "next";

import prismadb from "@/utils/prismadb";
import serverAuth from "@/utils/serverAuth";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		if (req.method == "GET") {
			const { currentUser } = await serverAuth(req, res);

			const tags = await prismadb.tag.findMany();

			return res.status(200).json(tags);
		} else if (req.method == "POST") {
			const tagAddedResponse = await prismadb.tag.createMany({ data: req?.body?.newTags });
			return res.status(201).json(tagAddedResponse);
		}
		return res.status(405).end();
	} catch (error) {
		console.log(error);
		return res.status(500).end();
	} finally {
		prismadb.$disconnect()
	}
}
