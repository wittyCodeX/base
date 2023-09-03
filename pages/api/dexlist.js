// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import qs from 'qs';
import { DEFILIAMA_URL } from '@/config/config';

export default async function handler(req, res) {
  const response = await fetch(`${DEFILIAMA_URL}/overview/dexs/Base`);
  const data = await response.json();

  res.status(200).json(data);
}
