const bcrypt = require("bcryptjs");
const models = require("../models");
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password, userType, location, specialization, address, workingHours, phone} = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await models.User.create({
      name,
      email,
      password: hashPassword,
      userType,
      latitude: location.latitude,
      longitude:location.longitude,
    });

    if(userType === 'doctor'){
        const profile = await models.Profile.create({
            userId: user.id,
            specialization,
            address,
            workingHours,
            phone
        })
    }

    res.status(200).json({ message: "تم انشاء حسابك بنجاح" });
  } catch (e) {
    res.status(500).json(e)
  }
};

exports.login = async (req, res) => {
  const {email, password} = req.body
  try{
    const user = await models.User.findOne({where: {email}})
    if(!user){
      return res.status(401).json({message:'بريد الكتروني او كلمة مرور غير صحيحة'})
    }
    const authSuccess = await bcrypt.compare(password, user.password)
    if(!authSuccess){
      return res.status(401).json({message:'بريد الكتروني او كلمة مرور غير صحيحة'})
    }

    const token = jwt.sign({id: user.id, name: user.name, email: user.email}, process.env.JWT_SECRET);
    res.status(200).json({accessToken: token})
  }catch(e){
    res.status(500).json(e)
  }
}

exports.me = (req, res) => {
  const user = req.currentUser;
  res.json(user)
}

exports.getProfile = async (req, res) => {
  try {
    const result = await models.User.findOne({
      where: {id: req.currentUser.id},
      include: [{model: models.Profile, as:'profile'}],
      attributes: {exclude:['password']}
    })
    res.status(200).json(result)
  }catch(e){
    res.status(500).json(e) 
  }
}

exports.update = async (req, res) => {
  try {
    const {id} = req.currentUser
    const { name, email, password, userType, location, specialization, address, workingHours, phone} = req.body;

    const hashPassword = await bcrypt.hash(password, 10)
    const user = await models.User.update({
      name,
      email,
      password:
      hashPassword,
      userType,
      latitude: location.latitude,
      longitude: location.longitude
    },{where:{id}})
    if(userType == 'doctor'){
      const profile = await models.Profile.update({specialization,address,workingHours,phone},{where:{userId: id}})
    }
    res.status(200).json({message:'تم تعديل بنجاح'})
  }catch(e){
    res.status(500).json(e) 
  }
}

exports.delete = async (req, res) => {
  try {
    const {id} = req.currentUser
    const user = await models.User.destroy({where:{id}})
    if(user == 0){
      res.status(200).json({message:'هذا الحساب غير موجود بالأساس'})
    }
    res.status(200).json({message:'تم حذف الحساب بنجاح'})
  }catch(e){
    res.status(500).json(e) 
  }
}