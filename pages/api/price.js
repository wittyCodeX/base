// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import qs from 'qs';
import { API_URL } from '@/config/config';

export default async function handler(req, res) {
  const query = qs.stringify(req.query);
  console.log(query)
  try {
    const response = await fetch(`${API_URL}/swap/v1/price?${query}`, {
      headers: {
        '0x-api-key':
          'c9f13c84-9fcb-4f42-aa30-a11b0d016aa5', //'c9f13c84-9fcb-4f42-aa30-a11b0d016aa5', // process.env.NEXT_PUBLIC_0X_API_KEY,
      },
    });

    const data = await response.json();

    res.status(200).json(data);
  } catch (e) {
    console.log(e)
    res.status(500).json(e);
  }

}
