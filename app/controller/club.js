const db = require("../model");
const Club = db.Club;
const Op = db.Sequelize.Op;


exports.create = (req, res) => {
    if (!req.body.name || !req.body.city) {
        res.status(400).send({
            message: "Name and city cannot be empty"
        });
        return;
    }
    Club.findAll()
        .then(data => {
            if (data.some(club => club.name === req.body.name) && data.some(club => club.city === req.body.city)) {
                res.status(400).send({
                    message: "Name and city already exist"
                })
            } else if (data.some(club => club.name === req.body.name)) {
                res.status(400).send({
                    message: "Name already exist"
                })
            } else if (data.some(club => club.city === req.body.city)) {
                res.status(400).send({
                    message: "City already exist"
                })
            } else {
                const club = {
                    name: req.body.name,
                    city: req.body.city,
                };

                Club.create(club)
                    .then(data => {
                        res.status(200).send({ data: data, message: "Add club successfully" });
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: "Cannot add data with messages " + err.message
                        });
                    });
            }
        })
        .catch(err => {
            console.log("Cannot add club with messages " + err.message);
        });
};


exports.findAll = (req, res) => {
    const name = req.query.name;
    var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

    Club.findAll({ where: condition })
        .then(data => {
            res.send({ data: data });
        })
        .catch(err => {
            res.status(500).send({
                message: "Cannot get club with messages " + err.message
            });
        });
};


exports.update = (req, res) => {
    const id = req.params.id;

    Club.update(req.body, {
        where: { id: id }
    })
        .then(data => {
            Club.findOne({
                where: {
                    id: id,
                },
            })
                .then(datas => {
                    res.status(200).send({ data: datas, message: "Update club successfully" });
                })
        })
        .catch(err => {
            res.status(500).send({
                message: "Cannot update club with messages " + err.message
            });
        });
};


exports.delete = (req, res) => {
    const id = req.params.id;

    Club.destroy({
        where: { id: id }
    })
        .then(data => {
            res.status(200).send({ message: "Delete club successfully" });
        })
        .catch(err => {
            res.status(500).send({
                message: "Cannot delete club with messages " + err.message
            });
        });
};
