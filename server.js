require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./src/config/swagger");
const loginRoutes = require("./src/routes/loginRoutes");
const userRoutes = require("./src/routes/userRoutes");
const categoryRotes = require("./src/routes/categoryRoutes");

// Inicializa la app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta base de prueba
app.get("/", (req, res) => {
  res.json({ message: "Bienvenido a la plataforma de inversiones" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas públicas
app.use("/api/auth", loginRoutes);

// Rutas protegidas (requieren JWT)
app.use("/api", userRoutes);
app.use("/api", categoryRotes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
