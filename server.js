const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');


console.log(app.get('env'));
console.log(process.env);

//  Start server
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

