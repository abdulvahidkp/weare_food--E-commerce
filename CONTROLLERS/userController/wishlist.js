
const wishlist = require('../../MODEL/wishlistModel')
msg=''

module.exports = {

    getWishlist:async(req,res)=>{
        const { userId } = req.session
        let wishCount = await wishlist.find({userId}).count()
        
        if(wishCount == 0){
            msg='Your wishlist is empty'
        }
        let wishlistList = await wishlist.find({userId})
        res.render('user/wishlist',{user:true,wishlistList,msg})
        msg=''
    },
    addWishlist:async (req,res)=>{
        const { userId } = req.session
        const { productId} = req.body
        await wishlist.create({userId,productId})
        res.redirect('')
    }
    
}