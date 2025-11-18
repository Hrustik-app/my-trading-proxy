// pages/api/investing.js

export default async function handler(req, res) {
  // Настройка CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Замени '*' на свой домен в продакшене
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Получаем URL из query параметров
  const targetUrl = req.query.url;

  // Проверка безопасности: разрешаем только определённые домены
  if (!targetUrl || (!targetUrl.startsWith('https://api.coingecko.com/') && !targetUrl.startsWith('https://api.alternative.me/'))) {
    res.status(400).json({ error: 'Invalid or unauthorized target URL' });
    return;
  }

  try {
    // Делаем запрос к внешнему API
    const externalResponse = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        // Имитируем реальный браузер, чтобы избежать блокировок (хотя для CoinGecko/Alternative.me это реже проблема)
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        // Некоторые API могут требовать Referer, но для CoinGecko и Alternative.me это обычно не обязательно
        // 'Referer': 'https://www.coingecko.com/',
      }
    });

    if (!externalResponse.ok) {
      throw new Error(`External API responded with status ${externalResponse.status}`);
    }

    const data = await externalResponse.json();

    // Возвращаем данные клиенту (твоему сайту)
    res.status(200).json(data);

  } catch (error) {
    console.error('Error in proxy function:', error);
    res.status(500).json({ error: 'Failed to fetch data from external API', details: error.message });
  }
}
