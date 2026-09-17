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


/*
==========================================================
INICIALIZAÇÃO
==========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        /*
        ================================================
        CARREGAR MODAL
        ================================================
        */

        await carregarModalLinha();


        /*
        ================================================
        CARREGAR DADOS
        ================================================
        */

        carregarLinhas();


        /*
        ================================================
        PESQUISA
        ================================================
        */

        document
            .getElementById("pesquisa")
            .addEventListener(
                "input",
                pesquisarLinhas
            );


        /*
        ================================================
        NOVA LINHA
        ================================================
        */

        document
            .getElementById("btnNovaLinha")
            .addEventListener(
                "click",
                abrirNovaLinha
            );


        /*
        ================================================
        EVENTOS DA MODAL
        ================================================
        */

        configurarEventosModal();
    }
);

/*
==========================================================
CARREGAR LINHAS
==========================================================
*/

async function carregarLinhas() {

    const tbody =
        document.getElementById("listaLinhas");

    tbody.innerHTML = `
        <tr>
            <td colspan="10">
                Carregando dados...
            </td>
        </tr>
    `;

    try {

        const resposta =
            await fetch(
                `${API_URL}?acao=listar`
            );

        const resultado =
            await resposta.json();

        if (!resultado.sucesso) {

            throw new Error(
                resultado.mensagem ||
                "Erro ao carregar dados."
            );
        }

        todasLinhas =
            resultado.dados || [];

        exibirLinhas(todasLinhas);

    } catch (erro) {

        console.error(erro);

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
        document.getElementById("listaLinhas");

    tbody.innerHTML = "";

    if (!linhas.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="10">
                    Nenhuma linha encontrada.
                </td>
            </tr>
        `;

        return;
    }

    linhas.forEach(item => {

        const tr =
            document.createElement("tr");

        const statusClasse =
            String(item.status)
                .toLowerCase() === "ativa"
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

        tbody.appendChild(tr);
    });
}


/*
==========================================================
PESQUISAR
==========================================================
*/

function pesquisarLinhas() {

    const termo =
        document
            .getElementById("pesquisa")
            .value
            .trim()
            .toLowerCase();

    if (!termo) {

        exibirLinhas(todasLinhas);

        return;
    }

    const filtradas =
        todasLinhas.filter(item => {

            return (

                String(item.empresa || "")
                    .toLowerCase()
                    .includes(termo)

                ||

                String(item.cod || "")
                    .toLowerCase()
                    .includes(termo)

                ||

                String(item.linha || "")
                    .toLowerCase()
                    .includes(termo)

                ||

                String(item.tipo || "")
                    .toLowerCase()
                    .includes(termo)

                ||

                String(item.embarque_ida || "")
                    .toLowerCase()
                    .includes(termo)

                ||

                String(item.embarque_volta || "")
                    .toLowerCase()
                    .includes(termo)

                ||

                String(item.status || "")
                    .toLowerCase()
                    .includes(termo)
            );
        });

    exibirLinhas(filtradas);
}


/*
==========================================================
EDITAR

Implementaremos na próxima etapa.
==========================================================
*/

function editarLinha(idLinha) {

    console.log(
        "Editar id_linha:",
        idLinha
    );

    alert(
        "Editar id_linha: " +
        idLinha
    );
}


/*
==========================================================
EXCLUIR

Implementaremos na próxima etapa.
==========================================================
*/

function excluirLinha(idLinha) {

    console.log(
        "Excluir id_linha:",
        idLinha
    );

    alert(
        "Excluir id_linha: " +
        idLinha
    );
}


/*
==========================================================
FORMATAR TARIFA
==========================================================
*/

function formatarTarifa(valor) {

    if (
        valor === null ||
        valor === undefined ||
        valor === ""
    ) {
        return "";
    }

    const numero =
        Number(
            String(valor)
                .replace(",", ".")
        );

    if (isNaN(numero)) {
        return escaparHTML(valor);
    }

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
SEGURANÇA PARA TEXTO HTML
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
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/*
==========================================================
MENSAGEM
==========================================================
*/

function mostrarMensagem(texto) {

    document
        .getElementById("mensagem")
        .textContent = texto;
}

/*
==========================================================
CARREGAR MODAL DE LINHA
==========================================================
*/

async function carregarModalLinha() {

    try {

        const resposta =
            await fetch(
                "modals/linha.html"
            );


        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar linha.html."
            );
        }


        const html =
            await resposta.text();


        document
            .getElementById("containerModal")
            .innerHTML = html;


    } catch (erro) {

        console.error(
            "Erro ao carregar modal:",
            erro
        );

        throw erro;
    }
}

/*
==========================================================
CONFIGURAR EVENTOS DA MODAL
==========================================================
*/

function configurarEventosModal() {

    /*
    ------------------------------------------------------
    FECHAR
    ------------------------------------------------------
    */

    document
        .getElementById("btnFecharModal")
        .addEventListener(
            "click",
            fecharModal
        );


    /*
    ------------------------------------------------------
    CANCELAR
    ------------------------------------------------------
    */

    document
        .getElementById("btnCancelar")
        .addEventListener(
            "click",
            fecharModal
        );


    /*
    ------------------------------------------------------
    SALVAR
    ------------------------------------------------------
    */

    document
        .getElementById("formLinha")
        .addEventListener(
            "submit",
            salvarLinha
        );


    /*
    ------------------------------------------------------
    CLICAR FORA DA MODAL
    ------------------------------------------------------
    */

    document
        .getElementById("modalLinha")
        .addEventListener(
            "click",
            function (event) {

                if (
                    event.target === this
                ) {

                    fecharModal();
                }
            }
        );
}