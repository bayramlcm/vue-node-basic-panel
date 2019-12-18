const express = require('express')
const Joi = require('@hapi/joi')

const atom = require('../../../bin/atom')

const app = express()

const accountAddSchema = Joi.object({
    name: Joi.string().min(3).max(64).required(),
    username: Joi.string().min(3).max(64).required(),
    password: Joi.string().min(8).max(64),
    permissions: Joi.object({
        accountAdd: Joi.boolean().required(),
        accountUpdate: Joi.boolean().required(),
        accountDelete: Joi.boolean().required(),
        accountGetAll: Joi.boolean().required(),
    }).required(),
});

app.post('/', (req, res) => {
    const { userData } = req;
    if (!userData.permissions.accountAdd) {
        return res.json({
            type: false,
            data: null,
            message: 'Bu işlem için yetkiniz bulunmamaktadır.',
        })
    }
    const body = accountAddSchema.validate(req.body);
    if (body.error) {
        return res.json({
            type: false,
            data: null,
            message: 'Tüm alanları doldurunuz.',
        });
    }
    body.value.password = atom.createPassword(body.value.password);
    atom.models.users.findOne(
        { username: body.value.username },
        (err, userResult) => {
            if (err) {
                return res.json({
                    type: false,
                    data: null,
                    message: 'Sistemsel bir hata meydana geldi.',
                });
            }
            if (userResult) {
                return res.json({
                    type: false,
                    data: null,
                    message: 'Kullanıcı adı daha önce kullanılmış.',
                });
            }
            atom.models.users.create(
                body.value,
                (err, userResult) => {
                    if (err) {
                        return res.json({
                            type: false,
                            data: null,
                            message: 'Sistemsel bir hata meydana geldi.',
                        });
                    }
                    return res.json({
                        type: true,
                        data: userResult,
                        message: 'Kullanıcı başarıyla eklenmiştir',
                    });
                },
            );
        })
});


module.exports = app
