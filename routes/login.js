import express from 'express';
const router = express.Router();
import fs from 'fs';
import dotenv from 'dotenv';

router.post('/login', function (req, res) {
    const envConfig = dotenv.parse(fs.readFileSync('.env'));
    if (req.body.username === envConfig.ADMIN_LOGIN && req.body.password === envConfig.ADMIN_PASSWORD) {
        res.cookie('loginedworker', false, {
            maxAge: 0,
        });
        res.cookie('loginedadmin', true, {
            maxAge: 1000 * 60 * 60 * 24,
        });
        res.json({
            logined: 'admin'
        })
        return res.end();
    } else if (req.body.username === envConfig.WORKER_LOGIN && req.body.password === envConfig.WORKER_PASSWORD) {
        res.cookie('loginedadmin', false, {
            maxAge: 0,
        });
        res.cookie('loginedworker', true, {
            maxAge: 1000 * 60 * 60 * 24,
        });
        res.json({
            logined: 'pracownik'
        })
        return res.end();
    } else {
        res.json({
            logined: false,
        })
        return res.end();
    }
})

export {
    router
}