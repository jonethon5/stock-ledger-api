# 1 FROM — de onde você parte para construir a imagem. Pode ser uma imagem base oficial do Docker Hub ou uma imagem personalizada.
FROM node:22-alpine

# 2 WORKDIR — onde os próximos comandos rodam
WORKDIR /app

# 3 COPY em duas etapas — o truque do cache
COPY package*.json ./

# Instala as dependências (incluindo devDependencies para nodemon)
RUN npm install

# Copia o resto do código
COPY . .

# 4 EXPOSE — documentação, não uma trava
EXPOSE 3000

# 5 Comando para iniciar com nodemon
CMD ["npx", "nodemon", "src/server.js"]