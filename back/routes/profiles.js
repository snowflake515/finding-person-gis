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
        response.status(200).json({
            result: true,
            data: results.rows
        })
    })
}

const getProfileById = (request, response) => {
    console.log(request.body);
    const id = request.body.userid;
    console.log(id);

    pool.query('SELECT userid, username, type, ST_X(geom) AS latitude, ST_Y(geom) AS longitude FROM profiles WHERE userid = $1', [id], (error, results) => {
        if (error) {
            response.status(200).json({result: false})
            throw error
        }
        response.status(200).json({
            result: true,
            data: results.rows
        })
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



const test = (request, response) => {

    const {latitude, longitude} = request.body;
    var time = "userid_" + new Date().getMinutes().toString() + new Date().getSeconds().toString();

    pool.query('INSERT INTO profiles (userid, username, type, geom) VALUES ($1, $2, $3 ,ST_SetSRID(ST_MakePoint($4, $5), 4326))', [time, time, "dev", latitude, longitude], (error, results) => {
        if (error) {
        throw error
        }
        response.status(201).send({result: true})
    })
}

const updateProfile = (request, response) => {
    const id = request.body.userid;
    console.log(request.body)
    const { userid, username, type, latitude, longitude } = request.body;

    pool.query(
        'UPDATE profiles SET username = $2, type = $3, geom = ST_SetSRID(ST_MakePoint($4, $5), 4326) WHERE userid = $1',
        [userid, username, type, latitude, longitude],
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
    const { radius, word, lati, long } = request.body;
    console.log("input--->>>");
    console.log(lati, long);
    var radius1 = radius;
    var word1 = word;
    if (radius1 == '') {
        radius1 = 100000;
    }
    if (word1 == '') {
        word1 = 'all';
    }
    if (word1 != 'all') {
        pool.query('select * from (SELECT userid, username, type, ST_X(geom) AS latitude, ST_Y(geom) AS longitude, ST_Distance(ST_SetSRID(ST_MakePoint(ST_Y(geom), ST_X(geom)), 4326)::geography, ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography)/1000 AS distance FROM profiles) as retable where retable.type=$3 and retable.distance<$4 ORDER BY distance ASC', [lati, long, word1, radius1], (error, results) => {
            if (error) {
                throw error
            }            
            if (results.rows.length != 0) {
                response.status(201).send({
                    result: true,
                    data: results.rows
                })
            }else{
                console.log("error")
                response.status(201).send({
                    result: false
                })
            }
        })
    }else {
        pool.query('select * from (SELECT userid, username, type, ST_X(geom) AS latitude, ST_Y(geom) AS longitude, ST_Distance(ST_SetSRID(ST_MakePoint(ST_Y(geom), ST_X(geom)), 4326)::geography, ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography)/1000 AS distance FROM profiles) as retable where retable.distance<$3 ORDER BY distance ASC', [lati, long, radius1], (error, results) => {
            if (error) {
                throw error
            }            
            if (results.rows.length != 0) {
                response.status(201).send({
                    result: true,
                    data: results.rows
                })
            }else{
                console.log("error")
                response.status(201).send({
                    result: false
                })
            }
        })
    }
}

module.exports = {
    getProfiles,
    getProfileById,
    createProfile,
    updateProfile,
    deleteProfile,
    searchProfile,
    test
}