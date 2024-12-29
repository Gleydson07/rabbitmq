# Usando a imagem oficial do RabbitMQ com interface de gerenciamento
FROM rabbitmq:4.0-management

# Adicionando plugins
# RUN rabbitmq-plugins enable rabbitmq_management rabbitmq_mqtt rabbitmq_prometheus

# Expondo as portas padrão do RabbitMQ
EXPOSE 5672 15672
