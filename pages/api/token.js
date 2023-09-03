// https://tokens.pancakeswap.finance/coingecko.json
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export default async function handler(req, res) {
  try {
    const response = await fetch(
      'https://tokens.pancakeswap.finance/coingecko.json'
    );
    const data = await response.json();
    if (data && data.tokens.length > 0) {
      const filtered = data.tokens.filter((item) => item.chainId === 8453);
      res.status(200).json(filtered);
    }
  } catch (e) {
    res.status(500).json({ status: 'server error', error: e });
  }
}
