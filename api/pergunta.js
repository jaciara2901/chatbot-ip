import axios from 'axios';

export default async function handler(req, res) {
  console.log('entrou aqui');
   // Libera o CORS
  res.setHeader("Access-Control-Allow-Origin", "https://chatbot-ip-git-main-jaciaras-projects.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Responde pré-flight
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido' });
  }

  const { pergunta } = req.body;

  if (!pergunta) {
    return res.status(400).json({ erro: 'A pergunta é obrigatória.' });
  }
  
  try {
    const resposta = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Você é uma consultora de imagem especialista em colorimetria, focada na cartela Inverno Profundo. Responda com autoridade e simpatia. Se receber perguntar fora do tema responda com gentileza que não pode mudar o foco do tema.' },
          { role: 'user', content: pergunta }
        ],
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const respostaChat = resposta.data.choices[0].message.content;
    res.status(200).json({ resposta: respostaChat });

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ erro: 'Erro ao consultar a Inteligência artificial. V2' });
