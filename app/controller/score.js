const db = require("../model");
const Score = db.Score;
const Club = db.Club;
const Op = db.Sequelize.Op;

const createScore = (scoreData) => {
    return Score.create(scoreData)
        .then(data => ({
            status: 'success',
            data: data,
        }))
        .catch(err => ({
            status: 'error',
            message: "Cannot add score: " + err.message,
        }));
};

exports.create = async (req, res) => {
    try {
        const { isMultiple, datas } = req.body;

        if (!datas || (isMultiple && !Array.isArray(datas))) {
            return res.status(400).send({ message: "Invalid input data" });
        }

        if (!isMultiple) {
            const score = {
                score1: datas.score[0],
                score2: datas.score[1],
                clubId1: datas.club[0],
                clubId2: datas.club[1],
                isMultiple: isMultiple
            };
            const result = await createScore(score);
            if (result.status === 'success') {
                return res.status(201).send({ data: result.data, message: "Score added successfully" });
            } else {
                return res.status(500).send({ message: result.message });
            }
        } else {
            const promises = datas.map(item => {
                const score = {
                    score1: item.score1,
                    score2: item.score2,
                    clubId1: item.club1.value,
                    clubId2: item.club2.value,
                    isMultiple: false
                };
                return createScore(score);
            });

            const results = await Promise.all(promises);
            const errors = results.filter(result => result.status === 'error');
            const successes = results.filter(result => result.status === 'success');

            if (errors.length > 0) {
                return res.status(500).send({ message: "Some scores could not be added", errors: errors.map(err => err.message) });
            } else {
                return res.status(201).send({ data: successes.map(success => success.data), message: "Scores added successfully" });
            }
        }
    } catch (err) {
        return res.status(500).send({ message: "An error occurred: " + err.message });
    }
};

exports.findAll = (req, res) => {
    Score.findAll({
        include: [
            {
                model: Club,
                as: 'club1'
            },
            {
                model: Club,
                as: 'club2'
            }
        ]
    })
        .then(data => {
            res.status(200).send({ data: data });
        })
        .catch(err => {
            res.status(500).send({
                message: "Cannot get scores: " + err.message
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;
    console.log(req.body);

    const score = {
        score1: req.body.datas.score[0],
        score2: req.body.datas.score[1],
        clubId1: req.body.datas.club[0],
        clubId2: req.body.datas.club[1],
        isMultiple: req.body.isMultiple
    };

    console.log(score);

    Score.update(score, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                Score.findOne({ where: { id: id } })
                    .then(data => {
                        res.status(200).send({ data: data, message: "Score updated successfully" });
                    })
                    .catch(err => {
                        res.status(500).send({ message: "Error retrieving updated score: " + err.message });
                    });
            } else {
                res.status(404).send({ message: `Cannot update Score with id=${id}. Maybe Score was not found or req.body is empty!` });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error updating Score with id=" + id });
        });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Score.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.status(200).send({ message: "Score deleted successfully" });
            } else {
                res.status(404).send({ message: `Cannot delete Score with id=${id}. Maybe Score was not found!` });
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Cannot delete Score with id=" + id });
        });
};
