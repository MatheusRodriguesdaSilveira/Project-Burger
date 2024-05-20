const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];

//Abrir o modal do carrinho
cartBtn.addEventListener("click", function() {
    updateCartModal();
    cartModal.style.display = "flex"
})

// Fechar o modal carrinho
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener('click', function(){
    cartModal.style.display = "none"
})

menu.addEventListener('click', function(event){
    let parentButton = event.target.closest('.add-to-cart-btn')
    if(parentButton){
        const name = parentButton.getAttribute('data-name')
        const price = parseFloat(parentButton.getAttribute('data-price'))
        //adcionar no carrinho
        addToCart(name, price)

    }
})

// funcao adcionar ao carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)
    if(existingItem){
        existingItem.quantity += 1;
    }
    else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()

}

//atualizando o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const cartItemsElement = document.createElement('div')
        cartItemsElement.classList.add('flex', 'justify-between', 'mb-4', 'flex-col')

        cartItemsElement.innerHTML = `
        
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Quantidade: ${item.quantity}</p>
                    <p class="font-bold mt-2">R$: ${item.price.toFixed(2)}</p>
                </div>

                <button class='remove-from-cart-btn' data-name ="${item.name}">
                Remover</button>

            </div>
        `

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemsElement)

    })
        
    cartTotal.textContent = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });


    cartCounter.innerText = cart.length;
}

//Função remover produto
cartItemsContainer.addEventListener('click', function (event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCard(name);
    }
})  

function removeItemCard(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        
        if(item.quantity > 1 ){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }

}


addressInput.addEventListener('input', function(event){
let inputValeu = event.target.value;

if(inputValeu !== ''){
    addressInput.classList.remove("border-red-500")
    addressWarn.classList.add('hidden')

}

})


//Finalizar Pedido
checkoutBtn.addEventListener('click', function(){

    const isOpen = checkRestauranteOpen();
    if(!isOpen){

        Toastify({
            text: "OPS...RESTAURANTE FECHADO NO MOMENTO",
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
            onClick: function(){} // Callback after click
          }).showToast();

        return;
    }


    if(cart.length === 0) return;
    if(addressInput.value === ''){
        addressWarn.classList.remove('hidden')
        addressInput.classList.add("border-red-500")
        return;
    }



//Enviar api para o WhatsAap
const cartItems = cart.map((item) => {
    return (
       ` ${item.name} - Quantidade: (${item.quantity}) - Preço: R$(${item.price}) |` 
    )
}).join("")

const message = encodeURIComponent(cartItems)
const phone = "11910346829"


window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

cart = [];
updateCartModal();

})

//Verificar a hora do restaurante 
function checkRestauranteOpen(){
    const data = new Date()
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
}


const spanItem = document.getElementById('data-span')
const isOpen = checkRestauranteOpen();

if(isOpen){
    spanItem.classList.remove('bg-red-500')
    spanItem.classList.add('bg-green-600')
}
else{
    spanItem.classList.remove('bg-green-600')
    spanItem.classList.add('bg-red-500')
}