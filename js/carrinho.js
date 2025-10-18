/*
Objetivo 1 - quando clicar no botão de adicionar ao carrinho:
    - atualizar o contador
    - adicionar o produto no localStorage
    - atualizar a tabela HTML do carrinho

Objetivo 2 - remover produtos do carrinho:
    - ouvir o botão de deletar
    - remover do localStorage
    - atualizar o DOM e o total

Objetivo 3 - atualizar valores do carrinho:
    - ouvir mudanças de quantidade
    - recalcular total individual
    - recalcular total geral
*/

const botoesAdicionarAoCarrinho = document.querySelectorAll('.adicionar-carrinho');

botoesAdicionarAoCarrinho.forEach(botao => {
    botao.addEventListener('click', (evento) => {
        const elementoProduto = evento.target.closest('.produto');
        const IdProduto = elementoProduto.dataset.id;
        const NomeProduto = elementoProduto.querySelector('.nome').textContent;
        const ImagenProduto = elementoProduto.querySelector('img').getAttribute('src');
        const PrecoProduto = parseFloat(elementoProduto.querySelector('.preco').textContent.replace('R$ ', '').replace('.', '').replace(',', '.'));

        //buscar a lista de produtos no localStorage
        const carrinho = ObterProdutosDoCarrinho();
        //verificar se o produto já está no carrinho
        const produtoExistente = carrinho.find(produto => produto.id === IdProduto);
        if (produtoExistente) {
            produtoExistente.quantidade += 1;
        } else {
            const produto = {
                id: IdProduto,
                nome: NomeProduto,
                imagem: ImagenProduto,
                preco: PrecoProduto,
                quantidade: 1
            };
            
            carrinho.push(produto);
        }

        SalvarProdutosNoCarrinho(carrinho);
        AtualizarTabelaECarrinho();
    });
});

function SalvarProdutosNoCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function ObterProdutosDoCarrinho() {
    const produtos = localStorage.getItem('carrinho');
    return produtos ? JSON.parse(produtos) : [];
}

function AtualizarContadorCarrinho() {
    const carrinho = ObterProdutosDoCarrinho();
    let total = 0;
    carrinho.forEach(produto => {
        total += produto.quantidade;
    });

    document.getElementById("total-carrinho").textContent = total;
}


function RenderizarTabelaCarrinho() {
    const produtos = ObterProdutosDoCarrinho();
    const corpoTabela = document.querySelector('#modal-1-content table tbody');
    corpoTabela.innerHTML = '';

    produtos.forEach(produto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td class="td-produto">
                                    <img
                                     src="${produto.imagem}"
                                     alt="${produto.nome}">
                                </td> 
                                <td>${produto.nome}</td>
                                <td class="td-preco-unitario">R$ ${produto.preco.toFixed(2).replace('.', ',')}</td>
                                <td class="td-quantidade"><input type="number" class="input-quantidade" data-id="${produto.id}" value="${produto.quantidade}" min="1"></td>
                                <td class="td-preco-total">R$ ${(produto.preco * produto.quantidade).toFixed(2).replace('.', ',')}</td>
                                <td>
                                    <button class="btn-deletar" data-id="${produto.id}" id="deletar" aria-label="Remover produto do carrinho"></button>
                                </td>`
        corpoTabela.appendChild(tr);
    });
}


const corpoTabela = document.querySelector('#modal-1-content table tbody');
corpoTabela.addEventListener('click', evento => {

    if (evento.target.classList.contains('btn-deletar')) {
        const id = evento.target.dataset.id;
        RemoverProdutoDoCarrinho(id);

    }

})

corpoTabela.addEventListener('input', evento => {
    if (evento.target.classList.contains("input-quantidade")) {
        const produtos = ObterProdutosDoCarrinho();
        const produto = produtos.find(produto => produto.id === evento.target.dataset.id);
        let novaQuantidade = parseInt(evento.target.value);
        if (produto) {
            produto.quantidade = novaQuantidade;
        }
        SalvarProdutosNoCarrinho(produtos);
       AtualizarTabelaECarrinho();
    }
})


function RemoverProdutoDoCarrinho(id) {
    const produtos = ObterProdutosDoCarrinho();

    const CarrinhoAtualizado = produtos.filter(produto => String(produto.id) !== String(id));
    SalvarProdutosNoCarrinho(CarrinhoAtualizado);
   AtualizarTabelaECarrinho();
}

function AtualizarTotalCarrinho() {
    const produtos = ObterProdutosDoCarrinho();
    let total = 0;

    produtos.forEach(produto => {
        total += produto.preco * produto.quantidade;
    });

    document.querySelector("#valor-total-carrinho").textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function AtualizarTabelaECarrinho() {
    AtualizarContadorCarrinho();
    RenderizarTabelaCarrinho();
    AtualizarTotalCarrinho();
}

AtualizarTabelaECarrinho();