# Use a imagem oficial do Node.js como base
FROM node:latest

#node-gyp dependencias
RUN apt-get update && apt-get install -y build-essential python
ENV PYTHON /usr/bin/python

# Define o diretório de trabalho do container
WORKDIR /usr/app

# Copie os arquivos da aplicação para o container
COPY ./package*.json ./

# Instale pm2
RUN npm install pm2 -g
# Instale as dependências da aplicação
RUN npm install

# Copie o resto dos arquivos da aplicação para o container
COPY . .

#Dockerize
ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz




