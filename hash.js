const bcrypt = require('bcryptjs')

bcrypt.genSalt(10,(err,salt)=>{
        if(err) return next(err)

        bcrypt.hash('password',salt,(err,hash)=>{
            if(err) return next(err)
            
        })
})