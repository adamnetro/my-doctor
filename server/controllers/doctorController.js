const Sequelize = require('sequelize')
const models = require('../models')

const Op = Sequelize.Op;

exports.index = async (req, res) => {
    const {q} = req.query
    const searchQuery = q ? {name: {[Op.like]: `%${q.replace(' ', '')}%`}} : {};
    try{
        const doctors = await models.User.findAll({
            where: {userType:'doctor', ...searchQuery},
            include: {model: models.Profile, as:'profile'},
            attributes: {exclude:['password']},
        })
        if(doctors.length == 0){
            res.status('404').json({message:'لم يتم عثور على طبيب'})
        }else{
            res.status(200).json(doctors)
        }
    }catch(e){
        res.status(500).json(e)
    }
}