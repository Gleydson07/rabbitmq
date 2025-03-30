import axios from "axios";

export async function rabbitMqAPI({ method, path, params, body, headers }) {
  try {
    const response = await axios({
      method,
      url: `${process.env.RABBITMQ_API_URL}${path}`,
      headers,
      data: body,
      params,
    });

    return response.data;
  } catch (error) {
    return error.message;
  }
}
