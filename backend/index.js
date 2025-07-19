const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const paymentRoutes = require('./routes/paymentRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});