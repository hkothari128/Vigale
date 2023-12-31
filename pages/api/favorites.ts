import { NextApiRequest, NextApiResponse } from "next";

import prismadb from '@/utils/prismadb';
import serverAuth from "@/utils/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end();
    }

    const { currentUser } = await serverAuth(req, res);

    const favoritedMovies = await prismadb.video.findMany({
      where: {
        id: {
          in: currentUser?.favoriteIds,
        }
      },include: { tags: true },
    });

    return res.status(200).json(favoritedMovies);
  } catch (error) {
    console.log(error);
    return res.status(500).end();
  } finally {
		prismadb.$disconnect()
	}
}
