const Pool = require('pg').Pool;
const { check, validationResult } = require('express-validator');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '123',
    port: 5432,
});

const getProfiles = (request, response) => {
    pool.query('SELECT userid, username, type, ST_X(geom) AS latitude, ST_Y(geom) AS longitude from profiles ORDER BY uid ASC', (error, results) => {
        if (error) {
        throw error
        }
        response.status(200).json(results.rows)
    })
}

const getProfileById = (request, response) => {
    const id = request.body.id;
    console.log(id);

    pool.query('SELECT * FROM profiles WHERE userid = $1', [id], (error, results) => {
        if (error) {
            response.status(200).json({result: false})
            throw error
        }
        response.status(200).json({result: true})
    })
}

const createProfile = (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return res.status(400).json({ result: false });
    }
    const { userid, username, type, latitude, longitude } = request.body;
    if (userid == '') {
        response.status(201).send({
            result: false,
            message: "UserID should be fill!"
        });
        return;
    }
    if (username == '') {
        response.status(201).send({
            result: false,
            message: "Username should be fill!"
        });
        return;
    }
    if (type == '') {
        response.status(201).send({
            result: false,
            message: "Type should be fill!"
        });
        return;
    }

    pool.query('SELECT * FROM profiles WHERE userid = $1', [userid], (error, results) => {
        console.log("1", results.rows.length);
        if (results.rows.length == 0) {
            console.log("2");
            pool.query('INSERT INTO profiles (userid, username, type, geom) VALUES ($1, $2, $3 ,ST_SetSRID(ST_MakePoint($4, $5), 4326))', [userid, username, type, latitude, longitude], (error, results) => {
                if (error) {
                throw error
                }
                response.status(201).send({result: true})
            })
        }else {
            response.status(201).send({
                result: false,
                message: "The userID already exists!"
            })
        }
    })
}

const updateProfile = (request, response) => {
    const id = request.body.uid;
    const { uid, userid, username, type, latitude, longitude } = request.body

    pool.query(
        'UPDATE profiles SET userid = $2, username = $3, type = $4, latitude = $5, longitude = $6 WHERE uid = $1',
        [uid, userid, username, type, latitude, longitude],
        (error, results) => {
            if (error) {
                response.status(200).json({result: false})
                throw error
            }
            response.status(200).send({result: true})
        }
    )
}

const deleteProfile = (request, response) => {
    const id = request.body.userid;

    pool.query('DELETE FROM profiles WHERE userid = $1', [id], (error, results) => {
        if (error) {
            response.status(200).json({result: false})
            throw error
        }
        response.status(200).send({result: true})
    })
}

const searchProfile = (request, response) => {
    // console.log(request.body);
    const { type, word, lati, long } = request.body
    if (!type) {
        console.log(lati, long);
        pool.query('SELECT userid, username, type, ST_X(geom) AS latitude, ST_Y(geom) AS longitude, ST_Distance(geom, ST_SetSRID(ST_MakePoint($2, $1), 4326)) AS distance FROM ( SELECT userid, username, type, geom FROM profiles) AS filtered_data ORDER BY distance ASC LIMIT 1', [lati, long], (error, results) => {
            if (error) {
                throw error
            }
            response.status(201).send({
                result: true,
                data: results.rows[0]
            })
        })
    }else{
        pool.query('SELECT userid, username, type, ST_X(geom) AS latitude, ST_Y(geom) AS longitude, ST_Distance(geom, ST_SetSRID(ST_MakePoint($1, $2), 4326)) AS distance FROM profiles where type=$3 ORDER BY distance ASC LIMIT 1', [lati, long, word], (error, results) => {
            // console.log(results.rows);
            if (error) {
                throw error
            }            
            console.log(results.rows);
            if (results.rows.length != 0) {
                response.status(201).send({
                    result: true,
                    data: results.rows[0]
                })
            }else{
                console.log("error")
                response.status(201).send({
                    result: false
                })
            }
        })
    }
    // const id = request.body.userid;

    // pool.query('DELETE FROM profiles WHERE userid = $1', [id], (error, results) => {
    //     if (error) {
    //         response.status(200).json({result: false})
    //         throw error
    //     }
    //     response.status(200).send({result: true})
    // })
}

module.exports = {
    getProfiles,
    getProfileById,
    createProfile,
    updateProfile,
    deleteProfile,
    searchProfile
}