FROM node:latest
WORKDIR /app
COPY package*.json .
RUN npm i
COPY . .
ENV PORT=8080
EXPOSE 8080
RUN curl -fsSL https://ollama.com/install.sh | sh
CMD sh -c 'ollama serve >/dev/null 2>&1 & sleep 10 && ollama pull tinyllama >/dev/null 2>&1 & node index.js'