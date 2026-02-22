export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt, currentData } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
Bạn là AI điều khiển Excel.
Nếu sheet trống thì tạo bảng mới.
Nếu có dữ liệu thì chỉnh sửa theo yêu cầu.
Luôn trả về JSON dạng:
{
 "headers": ["cột1","cột2"],
 "rows": [["giá trị1","giá trị2"]]
}
Chỉ trả JSON.
`
          },
          {
            role: "user",
            content: "Yêu cầu: " + prompt + "\nDữ liệu hiện tại: " + currentData
          }
        ]
      })
    });

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
