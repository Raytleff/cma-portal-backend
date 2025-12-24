import pool from "../config/db.js";
export const registerWithGoogle = async (oauthUser) => {
    const client = await pool.connect();
    try {
        // Check if user already exists
        const isUserExistsQuery = 'SELECT * FROM users WHERE id = $1';
        const isUserExistsResult = await client.query(isUserExistsQuery, [oauthUser.id]);
        if (isUserExistsResult.rows.length > 0) {
            const failure = {
                message: 'User already registered.',
                user: isUserExistsResult.rows[0]
            };
            return { failure };
        }
        // create new user
        const insertUserQuery = 'INSERT INTO users(id, fullname, username, status) VALUES($1, $2, $3, $4) RETURNING *';
        const insertUserResult = await client.query(insertUserQuery, [
            oauthUser.id,
            oauthUser.displayName,
            oauthUser.emails[0].value,
            "checked"
        ]);
        const success = {
            message: 'User registered.',
            user: insertUserResult.rows[0],
        };
        return { success };
    }
    finally {
        client.release();
    }
};
