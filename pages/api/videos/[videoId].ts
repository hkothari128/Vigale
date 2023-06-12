import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/utils/prismadb";
import serverAuth from "@/utils/serverAuth";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		if (req.method !== "GET") {
			return res.status(405).end();
		}

		await serverAuth(req, res);

		const { videoId } = req.query;

		if (typeof videoId !== "string") {
			throw new Error("Invalid Id");
		}

		if (!videoId) {
			throw new Error("Missing Id");
		}

		const video = await prismadb.video.findUnique({
			where: {
				id: videoId,
			},
		});

		return res.status(200).json(video);
	} catch (error) {
		console.log(error);
		return res.status(500).end();
	} finally {
		prismadb.$disconnect();
	}
}
