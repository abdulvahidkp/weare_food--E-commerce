

module.exports={
    bannerGet:(req,res)=>{
        res.render('admin/banner',{admin:true, banner:true})
    }
}