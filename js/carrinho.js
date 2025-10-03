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
    });
});

function SalvarProdutosNoCarrinho(carrinho) {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function ObterProdutosDoCarrinho() {
    const produtos = localStorage.getItem('carrinho');
    return produtos ? JSON.parse(produtos) : [];
}