const express = require('express')
const Joi = require('@hapi/joi')

const atom = require('../../../bin/atom')

const app = express()

const accountDeleteSchema = Joi.object({
    userId: Joi.string().alphanum(24).max(24).required(),
});

app.post('/', (req, res) => {
    const { userData } = req;
    if (!userData.permissions.accountDelete) {
        return res.json({
            type: false,
            data: null,
            message: 'Bu işlem için yetkiniz bulunmamaktadır.',
        });
    }

    const body = accountDeleteSchema.validate(req.body);
    if (body.error) {
        return res.json({
            type: false,
            data: null,
            message: 'Tüm alanları doldurunuz.',
        });
    }
    atom.models.users.findOneAndUpdate(
        { _id: body.value.userId, isDeleted: false },
        { isDeleted: true },
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
                data: userResult,
                message: 'Kullanıcı başarıyla silinmiştir.',
            });
        },
    );
});


module.exports = app
