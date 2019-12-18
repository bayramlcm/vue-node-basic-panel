const express = require('express')
const Joi = require('@hapi/joi')
const { ObjectId: objectId } = require('mongodb')

const atom = require('../../../bin/atom')

const app = express()

const accountUpdateSchema = Joi.object({
    userId: Joi.string().alphanum().min(24).max(24).required(),
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
    if (!userData.permissions.accountUpdate) {
        return res.json({
            type: false,
            data: null,
            message: 'Bu işlem için yetkiniz bulunmamaktadır.',
        })
    }
    const body = accountUpdateSchema.validate(req.body);
    if (body.error) {
        return res.json({
            type: false,
            data: null,
            message: 'Tüm alanları doldurunuz.',
        });
    }
    atom.models.users.find(
        {
            isDeleted: false,
            $or: [
                { _id: objectId(body.value.userId) },
                { username: body.value.username }
            ]
        },
        (err, userResults) => {
            if (err) {
                return res.json({
                    type: false,
                    data: null,
                    message: 'Sistemsel bir hata meydana geldi.',
                });
            }
            if (userResults.length > 1) {
                return res.json({
                    type: false,
                    data: null,
                    message: 'Bu kullanıcı adı kullanılıyor.',
                })
            }
            atom.models.users.findOneAndUpdate(
                { _id: body.value.userId, isDeleted: false },
                {
                    name: body.value.name,
                    username: body.value.username,
                    ...body.value.password ? {
                        password: atom.createPassword(body.value.password),
                    } : {},
                    permissions: body.value.permissions,
                },
                (err, userResult) => {
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
                    return res.json({
                        type: true,
                        data: null,
                        message: 'Kullanıcı başarıyla güncellendi.',
                    });
                },
            );
        },
    );
});


module.exports = app
