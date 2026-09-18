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
const itensPorPagina = 10;
let linhasFiltradas = [];

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
            document.getElementById("pesquisa");

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
            document.getElementById("btnNovaLinha");

        if (btnNovaLinha) {

            btnNovaLinha.addEventListener(
                "click",
                abrirNovaLinha
            );
        }

        /*
----------------------------------------------------------
PAGINAÇÃO
----------------------------------------------------------
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
        CARREGAR LINHAS
        --------------------------------------------------
        */

        carregarLinhas();


        /*
        --------------------------------------------------
        CARREGAR MODAL
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
CARREGAR MODAL
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


    container.innerHTML = html;
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
CONFIGURAR EVENTOS DA MODAL
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


    /*
    ------------------------------------------------------
    VERIFICAR SE A MODAL FOI CARREGADA
    ------------------------------------------------------
    */

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
    FOCO NO PRIMEIRO CAMPO
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
        JSON
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
        EXIBIR
        --------------------------------------------------
        */

        exibirLinhas(
            todasLinhas
        );


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
    GUARDAR LISTA ATUAL
    ------------------------------------------------------
    */

    linhasFiltradas = linhas;

    tbody.innerHTML = "";


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

    if (paginaAtual > totalPaginas) {
        paginaAtual = totalPaginas;
    }

    if (paginaAtual < 1) {
        paginaAtual = 1;
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
    EXIBIR SOMENTE OS REGISTROS DA PÁGINA
    ------------------------------------------------------
    */

    linhasPagina.forEach(
        function (item) {

            const tr =
                document.createElement(
                    "tr"
                );


            const statusClasse =
                String(
                    item.status || ""
                )
                    .toLowerCase() ===
                    "ativa"

                    ? "status-ativa"
                    : "status-inativa";


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


    const totalItens =
        linhasFiltradas.length;


    const totalPaginas =
        Math.max(
            1,
            Math.ceil(
                totalItens /
                itensPorPagina
            )
        );


    infoPagina.textContent =
        `Página ${paginaAtual} de ${totalPaginas}`;


    btnAnterior.disabled =
        paginaAtual <= 1;


    btnProxima.disabled =
        paginaAtual >= totalPaginas;
}


/*
==========================================================
PÁGINA ANTERIOR
==========================================================
*/

function paginaAnterior() {

    if (paginaAtual <= 1) {
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
PESQUISAR LINHAS
==========================================================
*/

function pesquisarLinhas() {

    const campoPesquisa =
        document.getElementById(
            "pesquisa"
        );


    if (!campoPesquisa) {

        return;
    }


    const termo =
        campoPesquisa
            .value
            .trim()
            .toLowerCase();


    /*
    ------------------------------------------------------
    SEM TERMO
    ------------------------------------------------------
    */

    if (!termo) {

    paginaAtual = 1;

    exibirLinhas(
        todasLinhas
    );

    return;
}


    /*
    ------------------------------------------------------
    FILTRAR
    ------------------------------------------------------
    */

    const filtradas =
        todasLinhas.filter(
            function (item) {

                return (

                    String(
                        item.empresa || ""
                    )
                        .toLowerCase()
                        .includes(termo)

                    ||

                    String(
                        item.cod || ""
                    )
                        .toLowerCase()
                        .includes(termo)

                    ||

                    String(
                        item.linha || ""
                    )
                        .toLowerCase()
                        .includes(termo)

                    ||

                    String(
                        item.tipo || ""
                    )
                        .toLowerCase()
                        .includes(termo)

                    ||

                    String(
                        item.embarque_ida || ""
                    )
                        .toLowerCase()
                        .includes(termo)

                    ||

                    String(
                        item.embarque_volta || ""
                    )
                        .toLowerCase()
                        .includes(termo)

                    ||

                    String(
                        item.status || ""
                    )
                        .toLowerCase()
                        .includes(termo)
                );
            }
        );
    
    paginaAtual = 1;

exibirLinhas(
    filtradas
);   

}


/*
==========================================================
EDITAR LINHA

Implementaremos completamente na próxima etapa.
Por enquanto mostra o ID interno.
==========================================================
*/

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

        document
            .getElementById("id_linha")
            .value =
            linha.id_linha ?? idLinha;


        /*
        --------------------------------------------------
        PREENCHER FORMULÁRIO
        --------------------------------------------------
        */

        document
            .getElementById("empresa")
            .value =
            linha.empresa ?? "";


        document
            .getElementById("cod")
            .value =
            linha.cod ?? "";


        document
            .getElementById("linha")
            .value =
            linha.linha ?? "";


        document
            .getElementById("tipo")
            .value =
            linha.tipo ?? "";


        document
            .getElementById("embarque_ida")
            .value =
            linha.embarque_ida ?? "";


        document
            .getElementById("embarque_volta")
            .value =
            linha.embarque_volta ?? "";


        document
            .getElementById("tarifa_cartao")
            .value =
            normalizarNumeroFormulario(
                linha.tarifa_cartao
            );


        document
            .getElementById("tarifa_dinheiro")
            .value =
            normalizarNumeroFormulario(
                linha.tarifa_dinheiro
            );


        document
            .getElementById("status")
            .value =
            linha.status ?? "Ativa";


        /*
        --------------------------------------------------
        ALTERAR TÍTULO
        --------------------------------------------------
        */

        document
            .getElementById("tituloModal")
            .textContent =
            "Editar Linha";


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

        document
            .getElementById("empresa")
            .focus();


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
EXCLUIR LINHA

Implementaremos completamente depois da edição.
Por enquanto mostra o ID interno.
==========================================================
*/

/*
==========================================================
EXCLUIR LINHA
==========================================================
*/

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

                return Number(item.id_linha) ===
                    Number(idLinha);
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
                                acao: "excluir",

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


    return String(valor)
        .replace(",", ".");
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
                .replace(",", ".")
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

            elemento.textContent = "";

        },
        5000
    );
}