# NestJS REST API boilerplate 
NestJS REST API boilerplate for a typical project

[Full documentation here](/docs/readme.md)

# For development, you can should change the following file:
## ```startup.relational.dev.sh```
```bash
#!/usr/bin/env bash
set -e

/opt/wait-for-it.sh postgres:5432
npm run migration:run
npm run seed:run:relational
npm run start:dev
```

## ```Dockerfile```

```Dockerfile
FROM node:20.17.0-alpine

RUN apk add --no-cache bash
RUN npm i -g @nestjs/cli typescript ts-node

COPY package*.json /tmp/app/
RUN cd /tmp/app && npm install

COPY . /usr/src/app
RUN cp -a /tmp/app/node_modules /usr/src/app
COPY ./wait-for-it.sh /opt/wait-for-it.sh
RUN chmod +x /opt/wait-for-it.sh
COPY ./startup.relational.dev.sh /opt/startup.relational.dev.sh
RUN chmod +x /opt/startup.relational.dev.sh
RUN sed -i 's/\r//g' /opt/wait-for-it.sh
RUN sed -i 's/\r//g' /opt/startup.relational.dev.sh

WORKDIR /usr/src/app
RUN if [ ! -f .env ]; then cp env-example-relational .env; fi
RUN #npm run build

CMD ["/opt/startup.relational.dev.sh"]
```

# Then run this command to build the docker image and run:
```bash
docker compose up -d
```

# Before commit any thing to github, please run the following command to check the code style:
```bash
npm run lint -- --fix
```

# If want to generate a new resource for new model, you can use the following command:
```bash
npm run generate:resource:relational -- --name=ResourceName
```

Example:
```bash
npm run generate:resource:relational -- --name=Category
```

# If want to add a new property to an existing model, you can use the following command:
```bash
npm run add:property:to-relational
```

# Generata a new migration
```bash
npm run migration:generate -- src/database/migrations/<migration-name>
```

# Run migrations
   ```bash
   npm run migration:run
   ```

# Run seeds
   ```bash
   npm run seed:run:relational
   ```