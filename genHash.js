const crypto = require('crypto');
const base64 = require('base64-js');

function rabbitmqPasswordHash(password) {
  // Salt aleatório; pode ser configurado para algo fixo, se necessário.
  const salt = crypto.randomBytes(4); // 4 bytes como recomendado pelo RabbitMQ
  const hash = crypto.createHash('sha256').update(Buffer.concat([salt, Buffer.from(password, 'utf8')])).digest();

  // Concatena o salt com o hash gerado
  const combined = Buffer.concat([salt, hash]);

  // Retorna o resultado em Base64, como esperado pelo RabbitMQ
  return combined.toString('base64');
}

// Exemplo de uso
const password = 'auth_user_consumer_pass';
const hashedPassword = rabbitmqPasswordHash(password);

console.log('Hashed password:', hashedPassword);
