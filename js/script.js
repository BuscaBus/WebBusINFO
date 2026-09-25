/*
==========================================================
CONFIGURAÇÃO DA API
==========================================================
*/

const API_URL =
    "https://script.google.com/macros/s/AKfycby4yCUL5jcSiE1UVBUIg1JPeoZmjE57h6rTXn14FYwIzOW3blMCNM4eIZJCgFdz0M17/exec";


/*
==========================================================
VARIÁVEIS
==========================================================
*/

let todasLinhas = [];
let idLinhaParaExcluir = null;

let paginaAtual = 1;
const itensPorPagina = 11;

let linhasFiltradas = [];
let colunaFiltroAtual = null;
let filtrosAtivos = {};


/*
==========================================================
INICIALIZAÇÃO
==========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        /*
        --------------------------------------------------
        PESQUISA
        --------------------------------------------------
        */

        const pesquisa =
            document.getElementById(
                "pesquisa"
            );

        if (pesquisa) {

            pesquisa.addEventListener(
                "input",
                pesquisarLinhas
            );
        }


        /*
        --------------------------------------------------
        BOTÃO NOVA LINHA
        --------------------------------------------------
        */

        const btnNovaLinha =
            document.getElementById(
                "btnNovaLinha"
            );

        if (btnNovaLinha) {

            btnNovaLinha.addEventListener(
                "click",
                abrirNovaLinha
            );
        }


        /*
        --------------------------------------------------
        PAGINAÇÃO
        --------------------------------------------------
        */

        const btnPaginaAnterior =
            document.getElementById(
                "btnPaginaAnterior"
            );

        const btnProximaPagina =
            document.getElementById(
                "btnProximaPagina"
            );


        if (btnPaginaAnterior) {

            btnPaginaAnterior.addEventListener(
                "click",
                paginaAnterior
            );
        }


        if (btnProximaPagina) {

            btnProximaPagina.addEventListener(
                "click",
                proximaPagina
            );
        }


        /*
        --------------------------------------------------
        CONFIGURAR FILTROS
        --------------------------------------------------
        */

        configurarFiltros();


        /*
        --------------------------------------------------
        CARREGAR LINHAS
        --------------------------------------------------
        */

        await carregarLinhas();


        /*
        --------------------------------------------------
        CARREGAR MODAIS
        --------------------------------------------------
        */

        try {

            await carregarModalLinha();

            configurarEventosModal();

            await carregarModalExclusao();

            configurarEventosModalExclusao();

        } catch (erro) {

            console.error(
                "Erro ao carregar a modal:",
                erro
            );

            mostrarMensagem(
                "Não foi possível carregar o formulário."
            );
        }
    }
);


/*
==========================================================
CARREGAR MODAL DE CADASTRO
==========================================================
*/

async function carregarModalLinha() {

    const resposta =
        await fetch(
            "./modals/linha.html"
        );


    if (!resposta.ok) {

        throw new Error(
            `Erro ${resposta.status} ao carregar modals/linha.html`
        );
    }


    const html =
        await resposta.text();


    const container =
        document.getElementById(
            "containerModal"
        );


    if (!container) {

        throw new Error(
            "containerModal não encontrado no index.html."
        );
    }


    container.innerHTML =
        html;
}


/*
==========================================================
CARREGAR MODAL DE EXCLUSÃO
==========================================================
*/

async function carregarModalExclusao() {

    const resposta =
        await fetch(
            "./modals/exclusao.html"
        );


    if (!resposta.ok) {

        throw new Error(
            `Erro ${resposta.status} ao carregar modals/exclusao.html`
        );
    }


    const html =
        await resposta.text();


    const container =
        document.getElementById(
            "containerModalExclusao"
        );


    if (!container) {

        throw new Error(
            "containerModalExclusao não encontrado no index.html."
        );
    }


    container.innerHTML =
        html;
}


/*
==========================================================
CONFIGURAR EVENTOS DA MODAL DE EXCLUSÃO
==========================================================
*/

function configurarEventosModalExclusao() {

    const modal =
        document.getElementById(
            "modalExclusao"
        );

    const btnFechar =
        document.getElementById(
            "btnFecharExclusao"
        );

    const btnCancelar =
        document.getElementById(
            "btnCancelarExclusao"
        );

    const btnConfirmar =
        document.getElementById(
            "btnConfirmarExclusao"
        );


    if (btnFechar) {

        btnFechar.addEventListener(
            "click",
            fecharModalExclusao
        );
    }


    if (btnCancelar) {

        btnCancelar.addEventListener(
            "click",
            fecharModalExclusao
        );
    }


    if (btnConfirmar) {

        btnConfirmar.addEventListener(
            "click",
            confirmarExclusaoLinha
        );
    }


    /*
    ------------------------------------------------------
    CLICAR FORA DA MODAL
    ------------------------------------------------------
    */

    if (modal) {

        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === modal
                ) {

                    fecharModalExclusao();
                }
            }
        );
    }
}


/*
==========================================================
CONFIGURAR EVENTOS DA MODAL DE CADASTRO
==========================================================
*/

function configurarEventosModal() {

    const btnFechar =
        document.getElementById(
            "btnFecharModal"
        );

    const btnCancelar =
        document.getElementById(
            "btnCancelar"
        );

    const formulario =
        document.getElementById(
            "formLinha"
        );

    const modal =
        document.getElementById(
            "modalLinha"
        );


    /*
    ------------------------------------------------------
    BOTÃO FECHAR
    ------------------------------------------------------
    */

    if (btnFechar) {

        btnFechar.addEventListener(
            "click",
            fecharModal
        );
    }


    /*
    ------------------------------------------------------
    BOTÃO CANCELAR
    ------------------------------------------------------
    */

    if (btnCancelar) {

        btnCancelar.addEventListener(
            "click",
            fecharModal
        );
    }


    /*
    ------------------------------------------------------
    FORMULÁRIO
    ------------------------------------------------------
    */

    if (formulario) {

        formulario.addEventListener(
            "submit",
            salvarLinha
        );
    }


    /*
    ------------------------------------------------------
    CLICAR FORA DA MODAL
    ------------------------------------------------------
    */

    if (modal) {

        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === modal
                ) {

                    fecharModal();
                }
            }
        );
    }
}


/*
==========================================================
ABRIR NOVA LINHA
==========================================================
*/

function abrirNovaLinha() {

    const modal =
        document.getElementById(
            "modalLinha"
        );

    const formulario =
        document.getElementById(
            "formLinha"
        );


    if (
        !modal ||
        !formulario
    ) {

        alert(
            "O formulário ainda não foi carregado."
        );

        return;
    }


    /*
    ------------------------------------------------------
    LIMPAR FORMULÁRIO
    ------------------------------------------------------
    */

    formulario.reset();


    /*
    ------------------------------------------------------
    LIMPAR ID
    ------------------------------------------------------
    */

    const campoId =
        document.getElementById(
            "id_linha"
        );

    if (campoId) {

        campoId.value = "";
    }


    /*
    ------------------------------------------------------
    TÍTULO
    ------------------------------------------------------
    */

    const titulo =
        document.getElementById(
            "tituloModal"
        );

    if (titulo) {

        titulo.textContent =
            "Nova Linha";
    }


    /*
    ------------------------------------------------------
    STATUS PADRÃO
    ------------------------------------------------------
    */

    const status =
        document.getElementById(
            "status"
        );

    if (status) {

        status.value =
            "Ativa";
    }


    /*
    ------------------------------------------------------
    ABRIR MODAL
    ------------------------------------------------------
    */

    modal.classList.add(
        "ativo"
    );


    /*
    ------------------------------------------------------
    FOCO
    ------------------------------------------------------
    */

    setTimeout(
        function () {

            const empresa =
                document.getElementById(
                    "empresa"
                );

            if (empresa) {

                empresa.focus();
            }

        },
        100
    );
}


/*
==========================================================
FECHAR MODAL
==========================================================
*/

function fecharModal() {

    const modal =
        document.getElementById(
            "modalLinha"
        );


    if (modal) {

        modal.classList.remove(
            "ativo"
        );
    }
}

/*
==========================================================
SALVAR LINHA
==========================================================
*/

async function salvarLinha(event) {

    event.preventDefault();


    const botao =
        document.getElementById(
            "btnSalvar"
        );


    /*
    ------------------------------------------------------
    ID DA LINHA
    ------------------------------------------------------
    */

    const campoId =
        document.getElementById(
            "id_linha"
        );


    const idLinha =
        campoId
            ? campoId.value
            : "";


    /*
    ------------------------------------------------------
    DADOS DO FORMULÁRIO
    ------------------------------------------------------
    */

    const dados = {

        acao:
            idLinha
                ? "editar"
                : "cadastrar",

        id_linha:
            idLinha,

        empresa:
            document
                .getElementById("empresa")
                .value
                .trim(),

        cod:
            document
                .getElementById("cod")
                .value
                .trim(),

        linha:
            document
                .getElementById("linha")
                .value
                .trim(),

        tipo:
            document
                .getElementById("tipo")
                .value,

        embarque_ida:
            document
                .getElementById("embarque_ida")
                .value
                .trim(),

        embarque_volta:
            document
                .getElementById("embarque_volta")
                .value
                .trim(),

        tarifa_cartao:
            document
                .getElementById("tarifa_cartao")
                .value,

        tarifa_dinheiro:
            document
                .getElementById("tarifa_dinheiro")
                .value,

        status:
            document
                .getElementById("status")
                .value
    };


    /*
    ------------------------------------------------------
    VALIDAÇÃO
    ------------------------------------------------------
    */

    if (
        !dados.empresa ||
        !dados.cod ||
        !dados.linha
    ) {

        alert(
            "Preencha Empresa, Código e Linha."
        );

        return;
    }


    /*
    ------------------------------------------------------
    DESABILITAR BOTÃO
    ------------------------------------------------------
    */

    if (botao) {

        botao.disabled = true;

        botao.textContent =
            "SALVANDO...";
    }


    try {

        /*
        --------------------------------------------------
        ENVIAR PARA GOOGLE APPS SCRIPT
        --------------------------------------------------
        */

        const resposta =
            await fetch(
                API_URL,
                {
                    method: "POST",

                    body:
                        JSON.stringify(
                            dados
                        )
                }
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro HTTP: " +
                resposta.status
            );
        }


        /*
        --------------------------------------------------
        RETORNO DA API
        --------------------------------------------------
        */

        const resultado =
            await resposta.json();


        if (!resultado.sucesso) {

            throw new Error(
                resultado.mensagem ||
                "Erro ao salvar a linha."
            );
        }


        /*
        --------------------------------------------------
        FECHAR MODAL
        --------------------------------------------------
        */

        fecharModal();


        /*
        --------------------------------------------------
        MENSAGEM
        --------------------------------------------------
        */

        mostrarMensagem(
            resultado.mensagem ||
            (
                idLinha
                    ? "Linha atualizada com sucesso."
                    : "Linha cadastrada com sucesso."
            )
        );


        /*
        --------------------------------------------------
        ATUALIZAR LISTAGEM
        --------------------------------------------------
        */

        await carregarLinhas();


    } catch (erro) {

        console.error(
            "Erro ao salvar:",
            erro
        );


        alert(
            "Não foi possível salvar a linha.\n\n" +
            erro.message
        );


    } finally {

        /*
        --------------------------------------------------
        REATIVAR BOTÃO
        --------------------------------------------------
        */

        if (botao) {

            botao.disabled = false;

            botao.textContent =
                "SALVAR";
        }
    }
}

    /*

    /*
==========================================================
CARREGAR LINHAS
==========================================================
*/

async function carregarLinhas() {

    const tbody =
        document.getElementById(
            "listaLinhas"
        );

    if (!tbody) {

        console.error(
            "listaLinhas não encontrado."
        );

        return;
    }


    /*
    ------------------------------------------------------
    CARREGANDO
    ------------------------------------------------------
    */

    tbody.innerHTML = `
        <tr>
            <td colspan="10">
                Carregando dados...
            </td>
        </tr>
    `;


    try {

        /*
        --------------------------------------------------
        CONSULTAR API
        --------------------------------------------------
        */

        const resposta =
            await fetch(
                `${API_URL}?acao=listar`
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro HTTP: " +
                resposta.status
            );
        }


        /*
        --------------------------------------------------
        CONVERTER PARA JSON
        --------------------------------------------------
        */

        const resultado =
            await resposta.json();


        if (!resultado.sucesso) {

            throw new Error(
                resultado.mensagem ||
                "Erro ao carregar dados."
            );
        }


        /*
        --------------------------------------------------
        GUARDAR DADOS
        --------------------------------------------------
        */

        todasLinhas =
            resultado.dados || [];


        /*
        --------------------------------------------------
        TESTES TEMPORÁRIOS
        --------------------------------------------------
        */

        console.log(
            "TOTAL DE LINHAS:",
            todasLinhas.length
        );

        console.log(
            "PRIMEIRA LINHA:",
            todasLinhas[0]
        );

        console.log(
            "EMPRESAS RECEBIDAS:",
            todasLinhas.map(
                function (item) {

                    return item.empresa;
                }
            )
        );


        /*
        --------------------------------------------------
        EMPRESA RECEBIDA PELA URL
        --------------------------------------------------
        */

        const parametros =
            new URLSearchParams(
                window.location.search
            );


        const empresaURL =
            parametros.get(
                "empresa"
            );


        /*
        --------------------------------------------------
        PREENCHER PESQUISA
        --------------------------------------------------
        */

        const pesquisa =
            document.getElementById(
                "pesquisa"
            );


        if (
            empresaURL &&
            pesquisa
        ) {

            pesquisa.value =
                empresaURL;
        }


        /*
        --------------------------------------------------
        VOLTAR PARA PÁGINA 1
        --------------------------------------------------
        */

        paginaAtual = 1;


        /*
        --------------------------------------------------
        FILTRAR EMPRESA
        --------------------------------------------------
        */

        if (empresaURL) {

            console.log(
                "EMPRESA DA URL:",
                empresaURL
            );

            console.log(
                "EMPRESA NORMALIZADA:",
                normalizarTexto(
                    empresaURL
                )
            );


            const empresaProcurada =
                normalizarTexto(
                    empresaURL
                );


            const linhasEmpresa =
                todasLinhas.filter(
                    function (item) {

                        return (
                            normalizarTexto(
                                item.empresa
                            ) ===
                            empresaProcurada
                        );
                    }
                );


            console.log(
                "LINHAS ENCONTRADAS:",
                linhasEmpresa.length
            );


            exibirLinhas(
                linhasEmpresa
            );

        } else {

            aplicarTodosFiltros();
        }


    } catch (erro) {

        console.error(
            "Erro ao carregar linhas:",
            erro
        );


        tbody.innerHTML = `
            <tr>
                <td colspan="10">
                    Erro ao carregar os dados.
                </td>
            </tr>
        `;


        mostrarMensagem(
            "Não foi possível acessar a planilha."
        );
    }
}

        /*
    ==========================================================
    NORMALIZAR TEXTO
    ==========================================================
    */

    function normalizarTexto(valor) {

        return String(
            valor ?? ""
        )
            .normalize("NFD")

            .replace(
                /[\u0300-\u036f]/g,
                ""
            )

            .replace(
                /\s+/g,
                " "
            )

            .trim()

            .toLowerCase();
    }

    /*
    ==========================================================
    EXIBIR LINHAS
    ==========================================================
    */

    function exibirLinhas(linhas) {

        const tbody =
            document.getElementById(
                "listaLinhas"
            );


        if (!tbody) {

            return;
        }


    /*
    ------------------------------------------------------
    GARANTIR ARRAY
    ------------------------------------------------------
    */

    if (!Array.isArray(linhas)) {

        linhas = [];
    }


    /*
    ------------------------------------------------------
    GUARDAR LISTA ATUAL
    ------------------------------------------------------
    */

    linhasFiltradas =
        linhas;


    /*
    ------------------------------------------------------
    LIMPAR TABELA
    ------------------------------------------------------
    */

    tbody.innerHTML =
        "";


    /*
    ------------------------------------------------------
    SEM REGISTROS
    ------------------------------------------------------
    */

    if (!linhas.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="10">
                    Nenhuma linha encontrada.
                </td>
            </tr>
        `;


        atualizarPaginacao();

        return;
    }


    /*
    ------------------------------------------------------
    TOTAL DE PÁGINAS
    ------------------------------------------------------
    */

    const totalPaginas =
        Math.ceil(
            linhas.length /
            itensPorPagina
        );


    /*
    ------------------------------------------------------
    VALIDAR PÁGINA ATUAL
    ------------------------------------------------------
    */

    if (
        paginaAtual >
        totalPaginas
    ) {

        paginaAtual =
            totalPaginas;
    }


    if (
        paginaAtual <
        1
    ) {

        paginaAtual =
            1;
    }


    /*
    ------------------------------------------------------
    DEFINIR REGISTROS DA PÁGINA
    ------------------------------------------------------
    */

    const inicio =
        (paginaAtual - 1) *
        itensPorPagina;


    const fim =
        inicio +
        itensPorPagina;


    const linhasPagina =
        linhas.slice(
            inicio,
            fim
        );


    /*
    ------------------------------------------------------
    EXIBIR REGISTROS
    ------------------------------------------------------
    */

    linhasPagina.forEach(
        function (item) {

            const tr =
                document.createElement(
                    "tr"
                );


            /*
            --------------------------------------------------
            STATUS
            --------------------------------------------------
            */

            const statusClasse =
                String(
                    item.status || ""
                )
                    .toLowerCase() ===
                    "ativa"

                    ? "status-ativa"
                    : "status-inativa";


            /*
            --------------------------------------------------
            CONTEÚDO DA LINHA
            --------------------------------------------------
            */

            tr.innerHTML = `

                <td>
                    ${escaparHTML(item.empresa)}
                </td>

                <td>
                    ${escaparHTML(item.cod)}
                </td>

                <td>
                    ${escaparHTML(item.linha)}
                </td>

                <td>
                    ${escaparHTML(item.tipo)}
                </td>

                <td>
                    ${escaparHTML(item.embarque_ida)}
                </td>

                <td>
                    ${escaparHTML(item.embarque_volta)}
                </td>

                <td>
                    ${formatarTarifa(item.tarifa_cartao)}
                </td>

                <td>
                    ${formatarTarifa(item.tarifa_dinheiro)}
                </td>

                <td class="${statusClasse}">
                    ${escaparHTML(item.status)}
                </td>

                <td>

                    <button
                        type="button"
                        class="btn-editar"
                        onclick="editarLinha(${Number(item.id_linha)})"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        class="btn-excluir"
                        onclick="excluirLinha(${Number(item.id_linha)})"
                    >
                        Excluir
                    </button>

                </td>
            `;


            tbody.appendChild(
                tr
            );
        }
    );


    /*
    ------------------------------------------------------
    PAGINAÇÃO
    ------------------------------------------------------
    */

    atualizarPaginacao();
}


/*
==========================================================
ATUALIZAR PAGINAÇÃO
==========================================================
*/

function atualizarPaginacao() {

    const infoPagina =
        document.getElementById(
            "infoPagina"
        );


    const btnAnterior =
        document.getElementById(
            "btnPaginaAnterior"
        );


    const btnProxima =
        document.getElementById(
            "btnProximaPagina"
        );


    if (
        !infoPagina ||
        !btnAnterior ||
        !btnProxima
    ) {

        return;
    }


    /*
    ------------------------------------------------------
    TOTAL DE ITENS
    ------------------------------------------------------
    */

    const totalItens =
        linhasFiltradas.length;


    /*
    ------------------------------------------------------
    TOTAL DE PÁGINAS
    ------------------------------------------------------
    */

    const totalPaginas =
        Math.max(
            1,
            Math.ceil(
                totalItens /
                itensPorPagina
            )
        );


    /*
    ------------------------------------------------------
    INFORMAÇÃO
    ------------------------------------------------------
    */

    infoPagina.textContent =
        `Página ${paginaAtual} de ${totalPaginas}`;


    /*
    ------------------------------------------------------
    BOTÕES
    ------------------------------------------------------
    */

    btnAnterior.disabled =
        paginaAtual <= 1;


    btnProxima.disabled =
        paginaAtual >=
        totalPaginas;
}


/*
==========================================================
PÁGINA ANTERIOR
==========================================================
*/

function paginaAnterior() {

    if (
        paginaAtual <=
        1
    ) {

        return;
    }


    paginaAtual--;


    exibirLinhas(
        linhasFiltradas
    );
}


/*
==========================================================
PRÓXIMA PÁGINA
==========================================================
*/

function proximaPagina() {

    const totalPaginas =
        Math.ceil(
            linhasFiltradas.length /
            itensPorPagina
        );


    if (
        paginaAtual >=
        totalPaginas
    ) {

        return;
    }


    paginaAtual++;


    exibirLinhas(
        linhasFiltradas
    );
}

/*
==========================================================
CONFIGURAR FILTROS
==========================================================
*/

function configurarFiltros() {

    const botoes =
        document.querySelectorAll(
            ".btn-filtro"
        );

    const menu =
        document.getElementById(
            "menuFiltro"
        );

    const pesquisa =
        document.getElementById(
            "pesquisaFiltro"
        );

    const selecionarTodos =
        document.getElementById(
            "selecionarTodosFiltro"
        );

    const btnAplicar =
        document.getElementById(
            "btnAplicarFiltro"
        );

    const btnLimpar =
        document.getElementById(
            "btnLimparFiltro"
        );


    /*
    ------------------------------------------------------
    TRIÂNGULOS
    ------------------------------------------------------
    */

    botoes.forEach(
        function (botao) {

            botao.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    abrirFiltro(
                        botao
                    );
                }
            );
        }
    );


    /*
    ------------------------------------------------------
    PESQUISA INTERNA
    ------------------------------------------------------
    */

    if (pesquisa) {

        pesquisa.addEventListener(
            "input",
            pesquisarOpcoesFiltro
        );
    }


    /*
    ------------------------------------------------------
    SELECIONAR TODOS
    ------------------------------------------------------
    */

    if (selecionarTodos) {

        selecionarTodos.addEventListener(
            "change",
            function () {

                const checkboxes =
                    document.querySelectorAll(
                        "#listaOpcoesFiltro input[type='checkbox']"
                    );


                checkboxes.forEach(
                    function (checkbox) {

                        /*
                        Não alterar opções escondidas
                        pela pesquisa.
                        */

                        const label =
                            checkbox.closest(
                                ".opcao-filtro"
                            );


                        if (
                            label &&
                            label.style.display !== "none"
                        ) {

                            checkbox.checked =
                                selecionarTodos.checked;
                        }
                    }
                );
            }
        );
    }


    /*
    ------------------------------------------------------
    APLICAR
    ------------------------------------------------------
    */

    if (btnAplicar) {

        btnAplicar.addEventListener(
            "click",
            aplicarFiltroAtual
        );
    }


    /*
    ------------------------------------------------------
    LIMPAR
    ------------------------------------------------------
    */

    if (btnLimpar) {

        btnLimpar.addEventListener(
            "click",
            limparFiltroAtual
        );
    }


    /*
    ------------------------------------------------------
    FECHAR CLICANDO FORA
    ------------------------------------------------------
    */

    document.addEventListener(
        "click",
        function (event) {

            if (!menu) {

                return;
            }


            /*
            Clique dentro do menu.
            */

            if (
                menu.contains(
                    event.target
                )
            ) {

                return;
            }


            /*
            Clique no próprio botão do filtro.
            */

            if (
                event.target.closest(
                    ".btn-filtro"
                )
            ) {

                return;
            }


            fecharFiltro();
        }
    );
}


/*
==========================================================
ABRIR FILTRO
==========================================================
*/

function abrirFiltro(botao) {

    const menu =
        document.getElementById(
            "menuFiltro"
        );

    const titulo =
        document.getElementById(
            "tituloFiltro"
        );

    const pesquisa =
        document.getElementById(
            "pesquisaFiltro"
        );


    if (!menu) {

        return;
    }


    /*
    ------------------------------------------------------
    COLUNA ATUAL
    ------------------------------------------------------
    */

    colunaFiltroAtual =
        botao.dataset.coluna;


    /*
    ------------------------------------------------------
    TÍTULO
    ------------------------------------------------------
    */

    const th =
        botao.closest(
            "th"
        );


    const span =
        th
            ? th.querySelector(
                ".cabecalho-coluna span"
            )
            : null;


    if (titulo) {

        titulo.textContent =
            span
                ? span.textContent.trim()
                : "Filtrar";
    }


    /*
    ------------------------------------------------------
    LIMPAR PESQUISA DO MENU
    ------------------------------------------------------
    */

    if (pesquisa) {

        pesquisa.value =
            "";
    }


    /*
    ------------------------------------------------------
    CRIAR OPÇÕES
    ------------------------------------------------------
    */

    carregarOpcoesFiltro();


    /*
    ------------------------------------------------------
    POSICIONAR MENU
    ------------------------------------------------------
    */

    const posicao =
        botao.getBoundingClientRect();


    menu.style.left =
        (
            posicao.left +
            window.scrollX
        ) + "px";


    menu.style.top =
        (
            posicao.bottom +
            window.scrollY +
            4
        ) + "px";


    /*
    ------------------------------------------------------
    ABRIR
    ------------------------------------------------------
    */

    menu.classList.add(
        "ativo"
    );


    /*
    ------------------------------------------------------
    FOCO NA PESQUISA
    ------------------------------------------------------
    */

    if (pesquisa) {

        setTimeout(
            function () {

                pesquisa.focus();

            },
            50
        );
    }
}


/*
==========================================================
CARREGAR OPÇÕES DO FILTRO
==========================================================
*/

function carregarOpcoesFiltro() {

    const lista =
        document.getElementById(
            "listaOpcoesFiltro"
        );


    const selecionarTodos =
        document.getElementById(
            "selecionarTodosFiltro"
        );


    if (
        !lista ||
        !colunaFiltroAtual
    ) {

        return;
    }


    /*
    ------------------------------------------------------
    LIMPAR LISTA
    ------------------------------------------------------
    */

    lista.innerHTML =
        "";


    /*
    ------------------------------------------------------
    VALORES ÚNICOS
    ------------------------------------------------------
    */

    const valores =
        todasLinhas
            .map(
                function (item) {

                    return String(
                        item[colunaFiltroAtual] ?? ""
                    ).trim();
                }
            )
            .filter(
                function (
                    valor,
                    indice,
                    array
                ) {

                    return (
                        valor !== "" &&
                        array.indexOf(valor) === indice
                    );
                }
            )
            .sort(
                function (a, b) {

                    return a.localeCompare(
                        b,
                        "pt-BR",
                        {
                            numeric: true,
                            sensitivity: "base"
                        }
                    );
                }
            );


    /*
    ------------------------------------------------------
    FILTRO JÁ EXISTENTE
    ------------------------------------------------------
    */

    const selecionados =
        filtrosAtivos[
            colunaFiltroAtual
        ] || [];


    /*
    ------------------------------------------------------
    CRIAR CHECKBOXES
    ------------------------------------------------------
    */

    valores.forEach(
        function (valor) {

            const label =
                document.createElement(
                    "label"
                );


            label.className =
                "opcao-filtro";


            /*
            --------------------------------------------------
            CHECKBOX
            --------------------------------------------------
            */

            const checkbox =
                document.createElement(
                    "input"
                );


            checkbox.type =
                "checkbox";


            checkbox.value =
                valor;


            /*
            Se não existe filtro ativo nessa coluna,
            todas as opções começam selecionadas.
            */

            checkbox.checked =
                selecionados.length === 0 ||
                selecionados.includes(
                    valor
                );


            /*
            --------------------------------------------------
            TEXTO
            --------------------------------------------------
            */

            const span =
                document.createElement(
                    "span"
                );


            span.textContent =
                valor;


            /*
            --------------------------------------------------
            MONTAR OPÇÃO
            --------------------------------------------------
            */

            label.appendChild(
                checkbox
            );


            label.appendChild(
                span
            );


            lista.appendChild(
                label
            );
        }
    );


    /*
    ------------------------------------------------------
    SELECIONAR TODOS
    ------------------------------------------------------
    */

    if (selecionarTodos) {

        selecionarTodos.checked =
            selecionados.length === 0 ||
            selecionados.length ===
                valores.length;
    }
}


/*
==========================================================
PESQUISAR OPÇÕES DO FILTRO
==========================================================
*/

function pesquisarOpcoesFiltro() {

    const pesquisa =
        document.getElementById(
            "pesquisaFiltro"
        );


    if (!pesquisa) {

        return;
    }


    /*
    ------------------------------------------------------
    TERMO
    ------------------------------------------------------
    */

    const termo =
        pesquisa
            .value
            .trim()
            .toLowerCase();


    /*
    ------------------------------------------------------
    OPÇÕES
    ------------------------------------------------------
    */

    const opcoes =
        document.querySelectorAll(
            "#listaOpcoesFiltro .opcao-filtro"
        );


    /*
    ------------------------------------------------------
    FILTRAR VISUALMENTE
    ------------------------------------------------------
    */

    opcoes.forEach(
        function (opcao) {

            const texto =
                opcao
                    .textContent
                    .trim()
                    .toLowerCase();


            opcao.style.display =
                texto.includes(
                    termo
                )
                    ? "flex"
                    : "none";
        }
    );
}


/*
==========================================================
APLICAR FILTRO ATUAL
==========================================================
*/

function aplicarFiltroAtual() {

    if (!colunaFiltroAtual) {

        return;
    }


    /*
    ------------------------------------------------------
    CHECKBOXES
    ------------------------------------------------------
    */

    const checkboxes =
        Array.from(
            document.querySelectorAll(
                "#listaOpcoesFiltro input[type='checkbox']"
            )
        );


    /*
    ------------------------------------------------------
    VALORES SELECIONADOS
    ------------------------------------------------------
    */

    const selecionados =
        checkboxes
            .filter(
                function (checkbox) {

                    return checkbox.checked;
                }
            )
            .map(
                function (checkbox) {

                    return checkbox.value;
                }
            );


    /*
    ------------------------------------------------------
    TODOS SELECIONADOS = SEM FILTRO
    ------------------------------------------------------
    */

    if (
        selecionados.length ===
        checkboxes.length
    ) {

        delete filtrosAtivos[
            colunaFiltroAtual
        ];

    } else {

        filtrosAtivos[
            colunaFiltroAtual
        ] =
            selecionados;
    }


    /*
    ------------------------------------------------------
    VOLTAR PARA PÁGINA 1
    ------------------------------------------------------
    */

    paginaAtual =
        1;


    /*
    ------------------------------------------------------
    FECHAR MENU
    ------------------------------------------------------
    */

    fecharFiltro();


    /*
    ------------------------------------------------------
    APLICAR TODOS OS FILTROS
    ------------------------------------------------------
    */

    aplicarTodosFiltros();
}


/*
==========================================================
LIMPAR FILTRO ATUAL
==========================================================
*/

function limparFiltroAtual() {

    if (!colunaFiltroAtual) {

        return;
    }


    /*
    ------------------------------------------------------
    REMOVER FILTRO
    ------------------------------------------------------
    */

    delete filtrosAtivos[
        colunaFiltroAtual
    ];


    /*
    ------------------------------------------------------
    VOLTAR PARA PÁGINA 1
    ------------------------------------------------------
    */

    paginaAtual =
        1;


    /*
    ------------------------------------------------------
    FECHAR MENU
    ------------------------------------------------------
    */

    fecharFiltro();


    /*
    ------------------------------------------------------
    ATUALIZAR TABELA
    ------------------------------------------------------
    */

    aplicarTodosFiltros();
}


/*
==========================================================
FECHAR MENU DO FILTRO
==========================================================
*/

function fecharFiltro() {

    const menu =
        document.getElementById(
            "menuFiltro"
        );


    if (menu) {

        menu.classList.remove(
            "ativo"
        );
    }


    colunaFiltroAtual =
        null;
}


/*
==========================================================
APLICAR PESQUISA + FILTROS
==========================================================
*/

function aplicarTodosFiltros() {

    const campoPesquisa =
        document.getElementById(
            "pesquisa"
        );


    /*
    ------------------------------------------------------
    PESQUISA GERAL
    ------------------------------------------------------
    */

    const termo =
        campoPesquisa
            ? campoPesquisa
                .value
                .trim()
                .toLowerCase()
            : "";


    /*
    ------------------------------------------------------
    FILTRAR
    ------------------------------------------------------
    */

    const resultado =
        todasLinhas.filter(
            function (item) {


                /*
                --------------------------------------------------
                PESQUISA GERAL
                --------------------------------------------------
                */

                if (termo) {

                    const encontrou =
                        [
                            item.empresa,
                            item.cod,
                            item.linha,
                            item.tipo,
                            item.embarque_ida,
                            item.embarque_volta,
                            item.tarifa_cartao,
                            item.tarifa_dinheiro,
                            item.status
                        ]
                            .some(
                                function (valor) {

                                    return String(
                                        valor ?? ""
                                    )
                                        .toLowerCase()
                                        .includes(
                                            termo
                                        );
                                }
                            );


                    if (!encontrou) {

                        return false;
                    }
                }


                /*
                --------------------------------------------------
                FILTROS DAS COLUNAS
                --------------------------------------------------
                */

                for (
                    const coluna
                    in filtrosAtivos
                ) {

                    const permitidos =
                        filtrosAtivos[
                            coluna
                        ];


                    if (
                        !permitidos.includes(
                            String(
                                item[coluna] ?? ""
                            ).trim()
                        )
                    ) {

                        return false;
                    }
                }


                return true;
            }
        );


    /*
    ------------------------------------------------------
    MOSTRAR RESULTADO
    ------------------------------------------------------
    */

    exibirLinhas(
        resultado
    );


    /*
    ------------------------------------------------------
    INDICADORES DOS FILTROS
    ------------------------------------------------------
    */

    atualizarIndicadoresFiltros();
}


/*
==========================================================
INDICAR FILTROS ATIVOS
==========================================================
*/

function atualizarIndicadoresFiltros() {

    const botoes =
        document.querySelectorAll(
            ".btn-filtro"
        );


    botoes.forEach(
        function (botao) {

            const coluna =
                botao.dataset.coluna;


            if (
                Object.prototype
                    .hasOwnProperty.call(
                        filtrosAtivos,
                        coluna
                    )
            ) {

                botao.classList.add(
                    "filtro-ativo"
                );

            } else {

                botao.classList.remove(
                    "filtro-ativo"
                );
            }
        }
    );
}


/*
==========================================================
PESQUISAR LINHAS
==========================================================
*/

function pesquisarLinhas() {

    paginaAtual =
        1;


    aplicarTodosFiltros();
}

/*
==========================================================
EDITAR LINHA
==========================================================
*/

async function editarLinha(idLinha) {

    console.log(
        "Carregando id_linha:",
        idLinha
    );


    /*
    ------------------------------------------------------
    VERIFICAR MODAL
    ------------------------------------------------------
    */

    const modal =
        document.getElementById(
            "modalLinha"
        );


    if (!modal) {

        alert(
            "O formulário ainda não foi carregado."
        );

        return;
    }


    try {

        /*
        --------------------------------------------------
        BUSCAR REGISTRO NA API
        --------------------------------------------------
        */

        const resposta =
            await fetch(
                `${API_URL}?acao=buscar&id_linha=${encodeURIComponent(idLinha)}`
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro HTTP: " +
                resposta.status
            );
        }


        /*
        --------------------------------------------------
        CONVERTER RETORNO
        --------------------------------------------------
        */

        const resultado =
            await resposta.json();


        /*
        --------------------------------------------------
        VERIFICAR RETORNO
        --------------------------------------------------
        */

        if (!resultado.sucesso) {

            throw new Error(
                resultado.mensagem ||
                "Não foi possível localizar a linha."
            );
        }


        /*
        --------------------------------------------------
        DADOS RETORNADOS
        --------------------------------------------------
        */

        const linha =
            resultado.dados;


        if (!linha) {

            throw new Error(
                "Registro não encontrado."
            );
        }


        /*
        --------------------------------------------------
        PREENCHER ID INTERNO
        --------------------------------------------------
        */

        const campoId =
            document.getElementById(
                "id_linha"
            );


        if (campoId) {

            campoId.value =
                linha.id_linha ??
                idLinha;
        }


        /*
        --------------------------------------------------
        PREENCHER EMPRESA
        --------------------------------------------------
        */

        const empresa =
            document.getElementById(
                "empresa"
            );


        if (empresa) {

            empresa.value =
                linha.empresa ?? "";
        }


        /*
        --------------------------------------------------
        PREENCHER CÓDIGO
        --------------------------------------------------
        */

        const cod =
            document.getElementById(
                "cod"
            );


        if (cod) {

            cod.value =
                linha.cod ?? "";
        }


        /*
        --------------------------------------------------
        PREENCHER LINHA
        --------------------------------------------------
        */

        const campoLinha =
            document.getElementById(
                "linha"
            );


        if (campoLinha) {

            campoLinha.value =
                linha.linha ?? "";
        }


        /*
        --------------------------------------------------
        PREENCHER TIPO
        --------------------------------------------------
        */

        const tipo =
            document.getElementById(
                "tipo"
            );


        if (tipo) {

            tipo.value =
                linha.tipo ?? "";
        }


        /*
        --------------------------------------------------
        EMBARQUE IDA
        --------------------------------------------------
        */

        const embarqueIda =
            document.getElementById(
                "embarque_ida"
            );


        if (embarqueIda) {

            embarqueIda.value =
                linha.embarque_ida ?? "";
        }


        /*
        --------------------------------------------------
        EMBARQUE VOLTA
        --------------------------------------------------
        */

        const embarqueVolta =
            document.getElementById(
                "embarque_volta"
            );


        if (embarqueVolta) {

            embarqueVolta.value =
                linha.embarque_volta ?? "";
        }


        /*
        --------------------------------------------------
        TARIFA CARTÃO
        --------------------------------------------------
        */

        const tarifaCartao =
            document.getElementById(
                "tarifa_cartao"
            );


        if (tarifaCartao) {

            tarifaCartao.value =
                normalizarNumeroFormulario(
                    linha.tarifa_cartao
                );
        }


        /*
        --------------------------------------------------
        TARIFA DINHEIRO
        --------------------------------------------------
        */

        const tarifaDinheiro =
            document.getElementById(
                "tarifa_dinheiro"
            );


        if (tarifaDinheiro) {

            tarifaDinheiro.value =
                normalizarNumeroFormulario(
                    linha.tarifa_dinheiro
                );
        }


        /*
        --------------------------------------------------
        STATUS
        --------------------------------------------------
        */

        const status =
            document.getElementById(
                "status"
            );


        if (status) {

            status.value =
                linha.status ??
                "Ativa";
        }


        /*
        --------------------------------------------------
        ALTERAR TÍTULO
        --------------------------------------------------
        */

        const titulo =
            document.getElementById(
                "tituloModal"
            );


        if (titulo) {

            titulo.textContent =
                "Editar Linha";
        }


        /*
        --------------------------------------------------
        ABRIR MODAL
        --------------------------------------------------
        */

        modal.classList.add(
            "ativo"
        );


        /*
        --------------------------------------------------
        FOCO
        --------------------------------------------------
        */

        if (empresa) {

            empresa.focus();
        }


    } catch (erro) {

        console.error(
            "Erro ao editar linha:",
            erro
        );


        alert(
            "Não foi possível carregar a linha.\n\n" +
            erro.message
        );
    }
}


/*
==========================================================
ABRIR MODAL DE EXCLUSÃO
==========================================================
*/

function excluirLinha(idLinha) {

    const modal =
        document.getElementById(
            "modalExclusao"
        );


    const descricao =
        document.getElementById(
            "descricaoExclusao"
        );


    if (
        !modal ||
        !descricao
    ) {

        alert(
            "A janela de confirmação ainda não foi carregada."
        );

        return;
    }


    /*
    ------------------------------------------------------
    LOCALIZAR REGISTRO
    ------------------------------------------------------
    */

    const registro =
        todasLinhas.find(
            function (item) {

                return (
                    Number(item.id_linha) ===
                    Number(idLinha)
                );
            }
        );


    /*
    ------------------------------------------------------
    GUARDAR ID
    ------------------------------------------------------
    */

    idLinhaParaExcluir =
        idLinha;


    /*
    ------------------------------------------------------
    MOSTRAR DESCRIÇÃO
    ------------------------------------------------------
    */

    if (registro) {

        descricao.textContent =
            `${registro.cod} - ${registro.linha}`;

    } else {

        descricao.textContent =
            `ID ${idLinha}`;
    }


    /*
    ------------------------------------------------------
    ABRIR MODAL
    ------------------------------------------------------
    */

    modal.classList.add(
        "ativo"
    );
}


/*
==========================================================
FECHAR MODAL DE EXCLUSÃO
==========================================================
*/

function fecharModalExclusao() {

    const modal =
        document.getElementById(
            "modalExclusao"
        );


    if (modal) {

        modal.classList.remove(
            "ativo"
        );
    }


    idLinhaParaExcluir =
        null;
}


/*
==========================================================
CONFIRMAR EXCLUSÃO
==========================================================
*/

async function confirmarExclusaoLinha() {

    if (!idLinhaParaExcluir) {

        return;
    }


    const idLinha =
        idLinhaParaExcluir;


    const botao =
        document.getElementById(
            "btnConfirmarExclusao"
        );


    /*
    ------------------------------------------------------
    BLOQUEAR BOTÃO
    ------------------------------------------------------
    */

    if (botao) {

        botao.disabled =
            true;

        botao.textContent =
            "EXCLUINDO...";
    }


    try {

        /*
        --------------------------------------------------
        ENVIAR PARA API
        --------------------------------------------------
        */

        const resposta =
            await fetch(
                API_URL,
                {
                    method: "POST",

                    body:
                        JSON.stringify(
                            {
                                acao:
                                    "excluir",

                                id_linha:
                                    idLinha
                            }
                        )
                }
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro HTTP: " +
                resposta.status
            );
        }


        /*
        --------------------------------------------------
        RETORNO
        --------------------------------------------------
        */

        const resultado =
            await resposta.json();


        if (!resultado.sucesso) {

            throw new Error(
                resultado.mensagem ||
                "Não foi possível excluir a linha."
            );
        }


        /*
        --------------------------------------------------
        FECHAR MODAL
        --------------------------------------------------
        */

        fecharModalExclusao();


        /*
        --------------------------------------------------
        MENSAGEM
        --------------------------------------------------
        */

        mostrarMensagem(
            resultado.mensagem ||
            "Linha excluída com sucesso."
        );


        /*
        --------------------------------------------------
        ATUALIZAR LISTAGEM
        --------------------------------------------------
        */

        await carregarLinhas();


    } catch (erro) {

        console.error(
            "Erro ao excluir linha:",
            erro
        );


        alert(
            "Não foi possível excluir a linha.\n\n" +
            erro.message
        );


    } finally {

        /*
        --------------------------------------------------
        REATIVAR BOTÃO
        --------------------------------------------------
        */

        if (botao) {

            botao.disabled =
                false;

            botao.textContent =
                "EXCLUIR";
        }
    }
}


/*
==========================================================
NORMALIZAR NÚMERO PARA FORMULÁRIO
==========================================================
*/

function normalizarNumeroFormulario(valor) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        return "";
    }


    return String(
        valor
    )
        .replace(
            ",",
            "."
        );
}


/*
==========================================================
FORMATAR TARIFA
==========================================================
*/

function formatarTarifa(valor) {

    /*
    ------------------------------------------------------
    VAZIO
    ------------------------------------------------------
    */

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {

        return "";
    }


    /*
    ------------------------------------------------------
    CONVERTER
    ------------------------------------------------------
    */

    const numero =
        Number(
            String(valor)
                .replace(
                    ",",
                    "."
                )
        );


    /*
    ------------------------------------------------------
    VALOR INVÁLIDO
    ------------------------------------------------------
    */

    if (
        isNaN(numero)
    ) {

        return escaparHTML(
            valor
        );
    }


    /*
    ------------------------------------------------------
    FORMATO BRASILEIRO
    ------------------------------------------------------
    */

    return numero.toLocaleString(
        "pt-BR",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );
}


/*
==========================================================
ESCAPAR HTML
==========================================================
*/

function escaparHTML(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {

        return "";
    }


    return String(valor)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );
}


/*
==========================================================
MOSTRAR MENSAGEM
==========================================================
*/

function mostrarMensagem(texto) {

    const elemento =
        document.getElementById(
            "mensagem"
        );


    if (!elemento) {

        return;
    }


    elemento.textContent =
        texto;


    /*
    ------------------------------------------------------
    LIMPAR APÓS 5 SEGUNDOS
    ------------------------------------------------------
    */

    setTimeout(
        function () {

            elemento.textContent =
                "";

        },
        5000
    );
}