// get a user by id
import type { NextApiRequest, NextApiResponse } from "next";
import { getUserById } from "../../../../server/utils/database/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    return handleGet(req, res);
  } else {
    res.status(405).json({ error: "Unsupported method" });
  }
}

const handleGet = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id: id } = req.query;
  const reviewer = await getUserById(id as string);

  if (reviewer) {
    res.status(200).json({
      name: reviewer.name,
      image: reviewer.image,
      email: reviewer.email,
      id: reviewer.email,
    });
  } else {
    return res
      .status(404)
      .json({ error: `No user with id ${id as string} was found` });
  }
};
