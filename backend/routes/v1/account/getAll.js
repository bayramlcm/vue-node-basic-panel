const express = require('express')

const atom = require('../../../bin/atom')

const app = express()

app.post('/', (req, res) => {
    const {userData} = req;
    if (!userData.permissions.accountGetAll) {
        return res.json({
            type: false,
            data: null,
            message: 'Bu işlem için yetkiniz bulunmamaktadır.',
        })
    }
    atom.models.users.find(
        { isDeleted: false },
        (err, userResults) => {
            if (err) {
                return res.json({
                    type: false,
                    data: null,
                    message: 'Sistemsel bir hata meydana geldi.',
                });
            }
            return res.json({
                type: true,
                data: userResults,
                message: 'Başarıyla kullanıcı listesi alınmıştır.',
            });
        }
    );
});


module.exports = app
