import cloudinary from "cloudinary";
import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/utils/prismadb";
import serverAuth from "@/utils/serverAuth";
import { Cloudinary } from "@cloudinary/url-gen";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		// if (req.method !== "GET") {
		// 	return res.status(405).end();
		// }
		debugger;
		await serverAuth(req, res);
		if (req.method == "GET") {
			const movies = await prismadb.movie.findMany();
			// console.log("MOVIE LIST", movies);
			return res.status(200).json(movies);
		} else if (req.method == "POST") {
			console.log(req.body)
			cloudinary.v2.config({
				cloud_name: "dlk0tfo07",
				api_key: process.env.CLOUDINARY_API_KEY,
				api_secret: process.env.CLOUDINARY_API_SECRET,
			});
			const result = await cloudinary.v2.uploader.upload_large(
				req.body.video,
				{ resource_type: "video", chunk_size: 6000000 },
				async function(error, result) {
					console.log("WE ARE DONE HERE", result, error);
					console.log(result?.url)
				}
			);
			// const result = await cloudinary.v2.uploader.upload(
			// 	"C:/Users/hikot/Videos/Movavi Video Editor/Preview Files/{66a0f3e6-4c02-4466-8cbc-ddec7edebb69}.mov"
			// );
			// console.log("RESULT", result);
			// const movieAdded = await prismadb.movie.create({ data: req.body });
			return res.status(200).json({ status: "added" });
		}
	} catch (error) {
		console.log({ error });
		return res.status(500).end();
	}
}
