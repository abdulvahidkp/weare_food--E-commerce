module.exports = {
    orderManagementGet:(req,res)=>{
        res.render('admin/orderManagement',{admin:true,order:true})
    }
}