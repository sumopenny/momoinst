// Vercel Serverless Function - API 代理
// 解决浏览器 CORS 跨域问题

export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const targetUrl = 'https://mvsep.com' + req.url.replace('/api', '');

  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        'Accept': 'application/json',
      },
    };

    // 转发请求体（POST 请求）
    if (req.method === 'POST' && req.body) {
      // 如果是 FormData，需要特殊处理
      if (req.headers['content-type']?.includes('multipart/form-data')) {
        fetchOptions.body = req.body;
        fetchOptions.headers['Content-Type'] = req.headers['content-type'];
      } else {
        fetchOptions.body = JSON.stringify(req.body);
        fetchOptions.headers['Content-Type'] = 'application/json';
      }
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.json();

    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      success: false,
      message: 'Proxy error: ' + error.message
    });
  }
}
