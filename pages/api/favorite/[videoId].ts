import { NextApiRequest, NextApiResponse } from "next";
import { without } from "lodash";

import prismadb from "@/utils/prismadb";
import serverAuth from "@/utils/serverAuth";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		if (req.method === "DELETE") {
			const { currentUser } = await serverAuth(req, res);

			const { videoId } = req.query;
			console.log(req.query, "DELETE");
			if (typeof videoId !== "string") {
				throw new Error("Invalid Id");
			}

			if (!videoId) {
				throw new Error("Missing Id");
			}
			const existingMovie = await prismadb.video.findUnique({
				where: {
					id: videoId,
				},
			});

			if (!existingMovie) {
				throw new Error("Invalid ID");
			}

			const updatedFavoriteIds = without(currentUser.favoriteIds, videoId);

			const updatedUser = await prismadb.user.update({
				where: {
					email: currentUser.email || "",
				},
				data: {
					favoriteIds: updatedFavoriteIds,
				},
			});

			return res.status(200).json(updatedUser);
		}

		return res.status(405).end();
	} catch (error) {
		console.log(error);

		return res.status(500).end();
	} finally {
		prismadb.$disconnect();
	}
}
