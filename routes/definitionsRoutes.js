import { Router } from "express";
import multer from "multer";
import FormData from "form-data";
import { rabbitMqAPI } from "../services/rabbitMqAPI.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post("/", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Nenhum arquivo enviado." });
  }

  try {
    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname);

    await rabbitMqAPI({
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
    const response = await rabbitMqAPI({
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

router.get("/:vhost", async (req, res) => {
  const { vhost } = req.params;

  if (!vhost) {
    return res.status(400).json({ error: "Nenhum vhost enviado." });
  }

  try {
    const response = await rabbitMqAPI({
      method: "GET",
      path: "/definitions/" + vhost,
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
