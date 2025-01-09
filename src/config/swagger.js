const swaggerJSDoc = require("swagger-jsdoc");

// Definir las opciones de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "plataforma de inversiones",
      version: "1.0.0",
      description: "API para plataforma de inversiones",
    },
    servers: [
      {
        url: "http://localhost:5000/api",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

// Generar el esquema de Swagger
const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = swaggerDocs;
