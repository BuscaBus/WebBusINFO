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
        --------------------------------------------------
        CARREGAR REGISTROS
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
    FECHAR
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
    CANCELAR
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
    SALVAR
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
        document.getElementById("modalLinha");

    const formulario =
        document.getElementById("formLinha");

    if (!modal || !formulario) {

        alert(
            "O formulário ainda não foi carregado."
        );

        return;
    }

    formulario.reset();

    document
        .getElementById("id_linha")
        .value = "";

    document
        .getElementById("tituloModal")
        .textContent = "Nova Linha";

    document
        .getElementById("status")
        .value = "Ativa";

    modal.classList.add("ativo");

    setTimeout(
        function () {

            document
                .getElementById("empresa")
                .focus();

        },
        100
    );
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

    document
        .getElementById("id_linha")
        .value = "";


    /*
    ------------------------------------------------------
    TÍTULO
    ------------------------------------------------------
    */

    document
        .getElementById("tituloModal")
        .textContent = "Nova Linha";


    /*
    ------------------------------------------------------
    STATUS PADRÃO
    ------------------------------------------------------
    */

    document
        .getElementById("status")
        .value = "Ativa";


    /*
    ------------------------------------------------------
    ABRIR
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

            document
                .getElementById("empresa")
                .focus();

        },
        100
    );


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
    PEGAR ID
    ------------------------------------------------------
    */

    const idLinha =
        document
            .getElementById("id_linha")
            .value;


    /*
    ------------------------------------------------------
    MONTAR OBJETO
    ------------------------------------------------------
    */

    const dados = {

        /*
        Se não existir ID:
        CADASTRAR

        Se existir ID:
        futuramente EDITAR
        */

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
            "Linha cadastrada com sucesso."
        );


        /*
        --------------------------------------------------
        RECARREGAR LISTAGEM
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


        if (!resposta.ok) {

            throw new Error(
                "Erro HTTP: " +
                resposta.status
            );
        }


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


    tbody.innerHTML = "";


    /*
    ------------------------------------------------------
    NENHUM REGISTRO
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

        return;
    }


    /*
    ------------------------------------------------------
    CRIAR LINHAS DA TABELA
    ------------------------------------------------------
    */

    linhas.forEach(
        item => {

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
}


/*
==========================================================
PESQUISAR
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
    SEM PESQUISA
    ------------------------------------------------------
    */

    if (!termo) {

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
            item => {

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


    exibirLinhas(
        filtradas
    );
}


/*
==========================================================
EDITAR

Por enquanto apenas confirma o ID.
Implementaremos completamente na Etapa 5.
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

Por enquanto apenas confirma o ID.
Implementaremos posteriormente.
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


    if (
        isNaN(numero)
    ) {

        return escaparHTML(
            valor
        );
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
    Limpa a mensagem depois de 5 segundos
    */

    setTimeout(
        function () {

            elemento.textContent = "";

        },
        5000
    );
}