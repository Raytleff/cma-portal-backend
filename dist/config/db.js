import pkg from 'pg';
const { Pool } = pkg;
const pool = new Pool({
    user: "",
    host: "",
    database: "",
    password: "",
    port: "",
});
pool.connect((err) => {
    if (err)
        throw err;
    console.log("Connected to PostgreSQL successfully!");
});
export default pool;
