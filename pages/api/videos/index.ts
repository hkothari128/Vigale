import cloudinary from "cloudinary";
import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/utils/prismadb";
import serverAuth from "@/utils/serverAuth";
import { Cloudinary } from "@cloudinary/url-gen";
import { data } from "autoprefixer";
import useCurrentUser from "@/hooks/useCurrentUser";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		// if (req.method !== "GET") {
		// 	return res.status(405).end();
		// }

		const { currentUser } = await serverAuth(req, res);
		if (req.method == "GET") {
			const videos = await prismadb.video.findMany({
				include: { tags: true },
			});
			// console.log("MOVIE LIST", videos);
			return res.status(200).json(videos);
		} else if (req.method == "POST") {
			console.log(req.body);
			const videoAddedResponse = await prismadb.video.create({
				data: {
					...req.body.videoData,
					tags: {
						connect: req.body.tags,
					},
					owner: {
						connect: { id: currentUser.id },
					},
				},
			});
			console.log(videoAddedResponse);
			// const result = await cloudinary.v2.uploader.upload(
			// 	"C:/Users/hikot/Videos/Movavi Video Editor/Preview Files/{66a0f3e6-4c02-4466-8cbc-ddec7edebb69}.mov"
			// );
			// console.log("RESULT", result);
			// const movieAdded = await prismadb.video.create({ data: req.body });
			return res.status(200).json(videoAddedResponse);
		}
	} catch (error) {
		console.log({ error });
		return res.status(500).end();
	} finally {
		prismadb.$disconnect();
	}
}
