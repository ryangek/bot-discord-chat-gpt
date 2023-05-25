// Import the required packages
const mysql = require('mysql2');
const Utils = require('../utils');
const tokenRate = process.env.TOKEN_RATE / 1000;

// Create a MySQL connection pool
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

async function executeQuery(query, values = []) {
    return new Promise((resolve, reject) => {
        connection.query(query, values, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

// async function executeUpdate(query, values = []) {
//     return new Promise((resolve, reject) => {
//         connection.execute(query, values, (error, results, fields) => {
//             if (error) {
//                 reject(error);
//             } else {
//                 resolve(results);
//             }
//         });
//     });
// }

async function insertChatHistory(messageLog, userId) {
    try {
        const { role, content } = messageLog[1];
        const query = `INSERT INTO
                RG_CHAT_HISTORY (
                    ID,
                    USER_ID,
                    ROLE,
                    CONTENT,
                    CREATE_DATE
                )
            VALUES
                (
                    NULL,
                    ?,
                    ?,
                    ?,
                    ?
                )`;
        const values = [userId, role, content, Utils.currentTimeStamp()];
        const results = await executeQuery(query, values);
        return results;
    } catch (error) {
        console.error('Error executing MySQL insert:', error);
    }
}

async function insertChatUsageHistory(data) {
    try {
        const { model, usage } = data;
        const query = `INSERT INTO
                RG_CHAT_USAGE_HISTORY (
                    ID,
                    MODEL,
                    USAGE_PROMPT_TOKEN,
                    USAGE_COMPLETION_TOKEN,
                    USAGE_TOTAL_TOKEN,
                    USAGE_PRICE,
                    CREATE_DATE
                )
            VALUES
                (
                    NULL,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?,
                    ?
                )`;
        const values = [
            model,
            usage.prompt_tokens,
            usage.completion_tokens,
            usage.total_tokens,
            usage.total_tokens * tokenRate,
            Utils.currentTimeStamp(),
        ];
        const results = await executeQuery(query, values);
        return results;
    } catch (error) {
        console.error('Error executing MySQL insert:', error);
    }
}

async function insertUserChatSetting(userId, role) {
    try {
        const query = `INSERT INTO
                    RG_CHAT_SETTING (ID, USER_ID, ROLE, CREATE_DATE)
                VALUES
                    (
                        NULL,
                        ?,
                        ?,
                        ?
                    )`;
        const values = [
            userId,
            role,
            Utils.currentTimeStamp(),
        ];
        const results = await executeQuery(query, values);
        return results;
    } catch (error_) {
        try {
            const query = `UPDATE RG_CHAT_SETTING SET
            ROLE = ?,
            CREATE_DATE = ?
            WHERE USER_ID = ?`;
            const values = [
                role,
                Utils.currentTimeStamp(),
                userId,
            ];
            const results = await executeQuery(query, values);
            return results;
        } catch (error) {
            console.error('Error executing MySQL query:', error);
        }
    }
}

async function getChatHistories() {
    try {
        const query = 'SELECT * FROM RG_CHAT_HISTORY';
        const values = [];
        const results = await executeQuery(query, values);
        return results;
    } catch (error) {
        console.error('Error executing MySQL query:', error);
    }
}

async function getUserChatSetting(userId) {
    try {
        const query = 'SELECT * FROM RG_CHAT_SETTING WHERE USER_ID = ?';
        const values = [userId];
        const results = await executeQuery(query, values);
        return results.length > 0 ? results[0] : null;
    } catch (error) {
        console.error('Error executing MySQL query:', error);
        return null;
    }
}

async function sumChatUsageHistoryGroupByModel() {
    try {
        const query = `SELECT
        MODEL,
        SUM(USAGE_PROMPT_TOKEN) AS USAGE_PROMPT_TOKEN,
        SUM(USAGE_COMPLETION_TOKEN) AS USAGE_COMPLETION_TOKEN,
        SUM(USAGE_TOTAL_TOKEN) AS USAGE_TOTAL_TOKEN,
        SUM(USAGE_PRICE) AS USAGE_PRICE
    FROM
        RG_CHAT_USAGE_HISTORY
    GROUP BY
        MODEL`;
        const values = [];
        const results = await executeQuery(query, values);
        return results;
    } catch (error) {
        console.error('Error executing MySQL query:', error);
    }
}

// Close the MySQL connection pool when the application is shutting down
process.on('SIGINT', () => {
    connection.end((error) => {
        if (error) {
            console.error('Error closing MySQL connection:', error);
            process.exit(1);
        }
        console.log('MySQL connection pool closed.');
        process.exit(0);
    });
});

module.exports = {
    /* finding */
    getUserChatSetting,
    getChatHistories,
    sumChatUsageHistoryGroupByModel,
    /* update */
    insertChatHistory,
    insertChatUsageHistory,
    insertUserChatSetting,
};
