import { Router } from "express";
import multer from "multer";
import FormData from "form-data";
import axios from "axios";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

async function rabbitAPI({ method, path, body, headers }) {
  try {
    const response = await axios({
      method,
      url: `${process.env.RABBITMQ_API_URL}${path}`,
      headers,
      data: body,
    });

    return response.data;
  } catch (error) {
    return error.message;
  }
}

router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Nenhum arquivo enviado." });
  }

  try {
    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname);

    await rabbitAPI({
      method: "POST",
      path: "/definitions",
      body: formData,
      headers: {
        ...req.headers,
        ...formData.getHeaders(),
        "Content-Type": "multipart/form-data",
        "Content-Length": formData.getLengthSync(),
        "X-Requested-With": "XMLHttpRequest",
        Accept: "application/json",
      },
    });

    return res
      .status(200)
      .json({ message: "Definições carregadas com sucesso." });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Falha ao processar o arquivo: " + error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const response = await rabbitAPI({
      method: "GET",
      path: "/definitions",
      headers: req.headers,
    });

    return res.status(200).json(response);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Falha ao processar o arquivo: " + error.message });
  }
});

export default router;
