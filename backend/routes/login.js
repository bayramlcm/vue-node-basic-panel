const express = require('express')
const Joi = require('@hapi/joi')

const atom = require('../bin/atom')

const app = express()

const loginSchema = Joi.object({
    username: Joi.string().min(3).max(64).required(),
    password: Joi.string().min(8).max(64).required(),
})

// Giriş Yap
app.post('/', (req, res) => {
    body = loginSchema.validate(req.body)

    if (body.error) {
        return res.json({
            type: false,
            message: 'Lütfen boş bırakmayınız.',
            data: null,
        })
    }
    body.value.password = atom.createPassword(body.value.password);
    atom.models.users.findOne({
        username: body.value.username,
        password: body.value.password,
        isDeleted: false,
    }, (err, userResult) => {
        if (err) {
            return res.json({
                type: false,
                message: 'Sunucuda hata meydana geldi.',
                data: null,
            })
        }
        if (!userResult) {
            return res.json({
                type: false,
                message: 'Kullanıcı adı veya şifre hatalı.',
                data: null,
            })
        }
        const result = {
            token: atom.createToken({
                _id: userResult._id,
            }),
            user: userResult,
        }
        return res.json({
            type: true,
            message: 'Başarıyla giriş yaptınız.',
            data: result,
        })
    })
})

const loginCheckSchema = Joi.object({
    token: Joi.string().min(8).max(255),
});

// Oturum kontrol
app.post('/check', (req, res) => {
    const body = loginCheckSchema.validate(req.body);
    if (body.error) {
        return res.json({
            type: false,
            data: null,
            message: 'Oturumunuzun süresi dolmuş.',
        });
    }
    atom.checkToken(body.value.token).then(
        (decoded) => {
            atom.models.users.findOne({ _id: decoded._id, isDeleted: false }, (err, userResult) => {
                if (err) {
                    return res.json({
                        type: false,
                        data: null,
                        message: 'Sistemsel bir hata meydana geldi.',
                    });
                }
                if (!userResult) {
                    return res.json({
                        type: false,
                        data: null,
                        message: 'Kullanıcı bulunamadı.',
                    });
                }
                const result = {
                    token: body.value.token,
                    user: userResult,
                }
                return res.json({
                    type: true,
                    data: result,
                    message: 'Oturumunuz devam ediyor.',
                })
            });
        }
    ).catch(() => res.json({
        type: false,
        data: null,
        message: 'Oturumunuzun süresi dolmuş.',
    }));
});

module.exports = app