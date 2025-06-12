FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NEXT_PUBLIC_IGNORE_ESLINT_ERRORS=true

RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
