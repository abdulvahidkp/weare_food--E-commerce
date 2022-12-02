

function addToCart(proId) {
    $.ajax({
        url: '/addToCart/' + proId,
        method: 'post',
        success: (response) => {
            if (response.status) {
                let count = $('#cart-count').html()
                count = parseInt(count) + 1
                $('#cart-count').html(count)
            }
        }

    })
}

function changeQuantity(proId, count) {
    $.ajax({
        url: '/changeProductQuantity',
        data: {
            proId: proId, 
            count: count
        },
        method: 'POST',
        success: (response) => {
            if (response.status) {

                let countt = $('#cart-count').html()
                countt = parseInt(countt) + count
                $('#cart-count').html(countt)

                let countbox = $('#quantityDisplay' + proId).val()
                countbox = parseInt(countbox) + count
                $('#quantityDisplay' + proId).val(countbox)

                if (countbox === 1) {
                    $('#reduce-btn' + proId).addClass('d-none')
                } else {
                    $('#reduce-btn' + proId).removeClass('d-none')
                }

                let price = $('#productPrice' + proId).html().replace(/^\D+/g, '')
                $('#productTotal' + proId).html('₹' + (countbox * price))

                let totalCartPrice = $('#totalCartPrice').html().replace(/^\D+/g, '')
                totalCartPrice = parseInt(totalCartPrice)
                console.log(count * price);
                $('#totalCartPrice').html('₹' + (totalCartPrice + (count * price)))
            }
        }
    })
}


function removeFromCart(proId) {
    $.ajax({
        url: '/removeProductCart',
        data: {
            proId: proId
        },
        method: 'POST',
        success: (response) => {
            console.log('done');
            location.reload()
            // $('#productRow').del
        }
    })
}

let applied = false;
let Percentage;
let Code;
let newCode
let totalCartPrice;
let decreased;

$('#couponApplyForm').submit((e) => {
    e.preventDefault()
    $.ajax({
        url: '/couponSubmit',
        method: 'post',
        data: $('#couponApplyForm').serialize(),
        success: (response) => {
            let totalCartPrice = $('#totalCartPrice').html().replace(/^\D+/g, '')
            totalCartPrice = parseInt(totalCartPrice)
            if (response == null) {
                if (applied == true) {
                    $('#totalCartPrice').html('₹' + Math.floor((totalCartPrice + decreased)))
                    applied = false
                }
                $('#appliedMessage').addClass('d-none')
                $('#invalidMessage').removeClass('d-none')
            } else {
                if (applied == false) {
                    Percentage = response.percentage
                    Code = response.code
                    decreased = (totalCartPrice * response.percentage / 100)
                    $('#totalCartPrice').html('₹' + Math.round((totalCartPrice - decreased)))
                    $('#invalidMessage').addClass('d-none')
                    applied = true;
                } else {
                    newCode = response.code;
                    if (Code != newCode) {
                        totalCartPrice = $('#totalCartPrice').html().replace(/^\D+/g, '')
                        totalCartPrice = parseInt(totalCartPrice)
                        totalCartPrice = totalCartPrice + decreased;
                        Percentage = response.percentage
                        Code = response.code
                        decreased = (totalCartPrice * response.percentage / 100)
                        $('#totalCartPrice').html('₹' + Math.round((totalCartPrice - decreased)))
                        $('#invalidMessage').addClass('d-none')
                    }
                }
                $('#appliedMessage').removeClass('d-none')
            }
        }
    })
})


// function checkout() {
//     let total = document.getElementById('totalCartPrice').innerHTML
//     $.ajax({
//         url: '/checkout',
//         data: {
//             total : total
//         },
//         method: 'POST',
//         success:(data)=>{
//             console.log(data);  
//             location.href = '/checkout'
//         }
//     })
// }



$('#placeOrderForm').submit((e) => {
    e.preventDefault()
    $.ajax({
        url: '/placeOrder',
        method: 'post',
        data: $('#placeOrderForm').serialize(),
        success: (response) => {
            if (response.paymentMethod == false) {
                $('#paymentMsg').removeClass('d-none')
                $('#addressMsg').removeClass('d-none')
            }
            if (response.codSuccess) {
                location.href = '/confirmation'
            } else if(response.status){
                console.log(response);
                razorPayment(response)
            }
        }
    })
})

function razorPayment(order) {
    var options = {
        'key': 'rzp_test_byX4xjQdkJOyzX',
        'amount': order.amount,
        'currency': 'INR',
        'name': 'weare foods',
        'description': 'weare food cash transaction',
        'order_id': order.id,
        'handler': (response) => {
            alert(response.razorpay_payment_id)
            alert(response.razorpay_order_id)
            alert(response.razorpay_signature)

            verifyPayment(response,order)
        },
        'prefill': {
            'name': 'user', 
            'contact': '9999999999',  
            'email':'user@gmail.com'
        },
        'notes': {
            'address': 'Razorpay Corporate Office'
        },
        'theme': {
            'color': '#F37254'
        }
    }
    var rzp1 = new Razorpay(options)
    rzp1.open()

}

function  verifyPayment(payment,order){
    $.ajax({
        url:'/verifyPayment',
        data:{
            payment,
            order
        },
        method:'post',
        success:(response)=>{ 
            console.log('sett');
            if(response.status){
                location.href = '/confirmation'
            }else{
                alert('payment failed')
            }
        }
    })
}