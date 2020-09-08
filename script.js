let cart = [];
let modalQt = 1;
let modalKey = 0;

const c = (el) => document.querySelector(el); // retorna o item
const cs = (el) => document.querySelectorAll(el); // retornar um array com os itens encontrados

// Listagem das pizzas
pizzaJson.map( (item,index)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true);

    // preecher as informações em pizzaitem
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerText = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerText = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerText = item.description;

    // evento de abrir o modal
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
       e.preventDefault();

       // pegar o item/pizza clicado para passar as informações para o modal
       let key = e.target.closest('.pizza-item').getAttribute('data-key');
       // rezetnando a quantidade de pizza para 1
       modalQt = 1;
       // pegando qual infor da pizza celecionada
        modalKey = key;
       //console.log(pizzaJson[key]);
       // console.log(modalKey);

       // preenchendo Modal com as informações da pizza clicada
       c('.pizzaBig img').src = pizzaJson[key].img;
       c('.pizzaInfo h1').innerText = pizzaJson[key].name;
       c('.pizzaInfo--desc').innerText = pizzaJson[key].description;
       c('.pizzaInfo--actualPrice').innerText = `R$ ${pizzaJson[key].price.toFixed(2)}`;

       // tirando a seleção do botão do tamanho da pizza
       c('.pizzaInfo--size.selected').classList.remove('selected');
       // Pegando os 3 tamanhos de pizzas
       cs('.pizzaInfo--size').forEach((size,sizeIndex)=>{
           if(sizeIndex == 2) {
               size.classList.add('selected');
           }
           size.querySelector('span').innerText = pizzaJson[key].sizes[sizeIndex];
       });
       // colocando a quantidade de pizzas dentro do Modal
       c('.pizzaInfo--qt').innerText = modalQt;
       // animando o Modal
       c('.pizzaWindowArea').style.opacity = 0;
       c('.pizzaWindowArea').style.display = 'flex';
       setTimeout(()=>{
           c('.pizzaWindowArea').style.opacity = 1;
       }, 200);

    });

    // área que sera mostrado as pizzas
    c('.pizza-area').append( pizzaItem );
});

// Eventods do MODAL
// Função de fechar o modal
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

// Botaoes do modal para + e - quantidade
// +
c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
    modalQt++;
    c('.pizzaInfo--qt').innerText = modalQt;
});
// -
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalQt > 1){
        modalQt--;
        c('.pizzaInfo--qt').innerText = modalQt;
    }
});
// Tamanhos das Pizzas
cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e)=>{
       c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});
// BTN adicionar ao carrinho
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
   // reunindo as informações para enviar ao carrinho de compras
    // 1 - Qual a pizza?
    //console.log("Qual a pizza: "+modalKey);
    // 2 - Qual o tamanho da pizza?
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
    //console.log("Tamanho da pizza: "+size);
    // 3 - Quantas pizzas?
    //console.log("Quantidade: "+modalQt);

    // Antes de Add ao carrinho, precisa fazer um filtro das quantidades relacionadas ao tamanho e qtd de cada pizza
    let identifier = pizzaJson[modalKey].id+'@'+size;

    let key = cart.findIndex((item)=>item.identifier == identifier);

    if (key > -1) {
        cart[key].qt += modalQt;
    } else {
        // Add ao carrinho
        cart.push({
           identifier,
           id:pizzaJson[modalKey].id,
           size,
           qt:modalQt
        });
    }
    // antes de fechar modal, atualiza carrinho
    updateCart();
    // depois que add ao carrinho, fecha o Modal
    closeModal();
});

// açoes do carrinho mobile
c('.menu-openner').addEventListener('click', ()=>{
    if (cart.length > 0) {
        c('aside').style.left = '0';
    }
});
// fechando o menu carrinho mobile
c('.menu-closer').addEventListener('click', ()=>{
    c('aside').style.left = '100vw';
});

// Funções do carrinho de compras
function updateCart() {

    // Atualizando o carrinho mobile
    c('.menu-openner span').innerText = cart.length;

    if(cart.length > 0) {
        c('aside').classList.add('show'); // mostra carrinho

        // zerando as pizzas do caarinho
        c('.cart').innerText = '';

        // variaveis de preco
        let subtotal = 0;
        let desconto = 0;
        let total = 0;
        // exibindo os intem do carrinho
        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].qt;
            //console.log(pizzaItem);
            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
            // preenchendo o carrinho com os dados das pizzas celecionadas
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerText = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerText = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
               cart[i].qt++;
               updateCart();
            });
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
               if (cart[i].qt > 1) {
                   cart[i].qt--;
               } else {
                   cart.splice(i, 1);
               }
               updateCart();
            });
            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1; // 10%
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerText = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerText = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerText = `R$ ${total.toFixed(2)}`;
    } else {
        c('aside').classList.remove('show'); // esconde carrinho
        c('aside').style.left = '100vw'; // fecha o carrinho mobile
    }

}


























