const express = require('express');

const PORT = process.env.PORT || 5000;

const app = express();

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.listen(PORT, console.log(`Server started on port ${PORT}`));