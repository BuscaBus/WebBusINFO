
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
        PAGINAÇÃO
        --------------------------------------------------
        */

        const btnPaginaAnterior =
            document.getElementById("btnPaginaAnterior");

        const btnProximaPagina =
            document.getElementById("btnProximaPagina");

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

            configurarCampoKml();

            await carregarEmpresasSelect();

            await carregarTiposSelect();

            await carregarModalExclusao();

            configurarEventosModalExclusao();

            await carregarModalMapa();

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
        await fetch("./modals/linha.html");

    if (!resposta.ok) {
        throw new Error(
            `Erro ${resposta.status} ao carregar modals/linha.html`
        );
    }

    const html = await resposta.text();

    const container =
        document.getElementById("containerModal");

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
        await fetch("./modals/exclusao.html");

    if (!resposta.ok) {
        throw new Error(
            `Erro ${resposta.status} ao carregar modals/exclusao.html`
        );
    }

    const html = await resposta.text();

    const container =
        document.getElementById(
            "containerModalExclusao"
        );

    if (!container) {
        throw new Error(
            "containerModalExclusao não encontrado no index.html."
        );
    }

    container.innerHTML = html;
}


/*
==========================================================
CONFIGURAR EVENTOS DA MODAL DE EXCLUSÃO
==========================================================
*/

function configurarEventosModalExclusao() {

    const modal =
        document.getElementById("modalExclusao");

    const btnFechar =
        document.getElementById("btnFecharExclusao");

    const btnCancelar =
        document.getElementById("btnCancelarExclusao");

    const btnConfirmar =
        document.getElementById("btnConfirmarExclusao");


    /*
    ------------------------------------------------------
    BOTÃO FECHAR
    ------------------------------------------------------
    */

    if (btnFechar) {

        btnFechar.addEventListener(
            "click",
            fecharModalExclusao
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
            fecharModalExclusao
        );
    }


    /*
    ------------------------------------------------------
    BOTÃO CONFIRMAR EXCLUSÃO
    ------------------------------------------------------
    */

    if (btnConfirmar) {

        btnConfirmar.addEventListener(
            "click",
            confirmarExclusaoLinha
        );
    }


    /*
    ------------------------------------------------------
    FECHAR CLICANDO FORA DA MODAL
    ------------------------------------------------------
    */

    if (modal) {

        modal.addEventListener(
            "click",
            function (event) {

                if (event.target === modal) {
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
        document.getElementById("btnFecharModal");

    const btnCancelar =
        document.getElementById("btnCancelar");

    const formulario =
        document.getElementById("formLinha");

    const modal =
        document.getElementById("modalLinha");


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
    FORMULÁRIO DE CADASTRO
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
    FECHAR CLICANDO FORA DA MODAL
    ------------------------------------------------------
    */

    if (modal) {

        modal.addEventListener(
            "click",
            function (event) {

                if (event.target === modal) {
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

    const inputKml = document.getElementById("arquivoKml");
    const informacaoKml = document.getElementById("kmlSelecionado");

    if (inputKml) {
        inputKml.value = "";
    }

    if (informacaoKml) {
        informacaoKml.textContent = "";
    }    


    /*
    ------------------------------------------------------
    VERIFICAR FORMULÁRIO
    ------------------------------------------------------
    */

    if (!modal || !formulario) {

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
    LIMPAR OPÇÕES TEMPORÁRIAS DE TIPOS ANTIGOS
    ------------------------------------------------------
    */

    const selectTipo =
        document.getElementById("tipo");

    if (selectTipo) {

        selectTipo
            .querySelectorAll(
                'option[data-tipo-antigo="1"]'
            )
            .forEach(
                option => option.remove()
            );

        // Nenhuma tarifa selecionada inicialmente.
        selectTipo.value = "";
    }


    /*
    ------------------------------------------------------
    LIMPAR VALORES DAS TARIFAS
    ------------------------------------------------------
    */

    const tarifaCartao =
        document.getElementById("tarifa_cartao");

    const tarifaDinheiro =
        document.getElementById("tarifa_dinheiro");

    if (tarifaCartao) {
        tarifaCartao.value = "";
    }

    if (tarifaDinheiro) {
        tarifaDinheiro.value = "";
    }


    /*
    ------------------------------------------------------
    LIMPAR ID DA LINHA
    ------------------------------------------------------
    */

    const campoId =
        document.getElementById("id_linha");

    if (campoId) {
        campoId.value = "";
    }


    /*
    ------------------------------------------------------
    TÍTULO DA MODAL
    ------------------------------------------------------
    */

    const titulo =
        document.getElementById("tituloModal");

    if (titulo) {
        titulo.textContent = "Nova Linha";
    }


    /*
    ------------------------------------------------------
    STATUS PADRÃO
    ------------------------------------------------------
    */

    const status =
        document.getElementById("status");

    if (status) {
        status.value = "Ativa";
    }


    /*
    ------------------------------------------------------
    ABRIR MODAL
    ------------------------------------------------------
    */

    modal.classList.add("ativo");


    /*
    ------------------------------------------------------
    FOCO NO CAMPO EMPRESA
    ------------------------------------------------------
    */

    setTimeout(
        function () {

            const empresa =
                document.getElementById("empresa");

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
        document.getElementById("modalLinha");

    if (modal) {
        modal.classList.remove("ativo");
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
        document.getElementById("btnSalvar");


    /*
    ------------------------------------------------------
    ID DA LINHA
    ------------------------------------------------------
    */

    const campoId =
        document.getElementById("id_linha");

    const idLinha =
        campoId ? campoId.value : "";


    /*
    ------------------------------------------------------
    TARIFA SELECIONADA
    ------------------------------------------------------
    */

    const selectTipo =
        document.getElementById("tipo");

    if (!selectTipo) {

        alert("Campo Tipo não encontrado.");

        return;
    }

    const opcaoSelecionada =
        selectTipo.selectedOptions[0];

    // O value do select corresponde ao id_tarifa.
    const idTarifa =
        selectTipo.value.trim();

    // O texto da opção corresponde ao nome da tarifa.
    const nomeTipo =
        opcaoSelecionada
            ? opcaoSelecionada.textContent.trim()
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

        /*
        ----------------------------------------------
        RELACIONAMENTO COM A ABA TARIFAS
        ----------------------------------------------
        */

        id_tarifa:
            idTarifa,

        tipo:
            nomeTipo,

        /*
        ----------------------------------------------
        EMBARQUES
        ----------------------------------------------
        */

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

        /*
        ----------------------------------------------
        VALORES DA TARIFA
        ----------------------------------------------
        */

        tarifa_cartao:
            document
                .getElementById("tarifa_cartao")
                .value,

        tarifa_dinheiro:
            document
                .getElementById("tarifa_dinheiro")
                .value,

        /*
        ----------------------------------------------
        STATUS
        ----------------------------------------------
        */

        status:
            document
                .getElementById("status")
                .value
    };


    /*
    ------------------------------------------------------
    VALIDAÇÃO DOS CAMPOS OBRIGATÓRIOS
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
    VALIDAR TARIFA SELECIONADA
    ------------------------------------------------------
    */

    if (
        !dados.id_tarifa ||
        !/^\d+$/.test(dados.id_tarifa) ||
        Number(dados.id_tarifa) <= 0
    ) {

        alert(
            "Selecione uma tarifa válida no campo Tipo."
        );

        return;
    }


    /*
    ------------------------------------------------------
    DESABILITAR BOTÃO SALVAR
    ------------------------------------------------------
    */

    if (botao) {

        botao.disabled = true;

        botao.textContent = "SALVANDO...";
    }


    try {

        /*
        --------------------------------------------------
        ENVIAR DADOS PARA GOOGLE APPS SCRIPT
        --------------------------------------------------
        */

        const resposta = await fetch(
            API_URL,
            {
                method: "POST",

                body: JSON.stringify(dados)
            }
        );


        /*
        --------------------------------------------------
        VERIFICAR RESPOSTA HTTP
        --------------------------------------------------
        */

        if (!resposta.ok) {

            throw new Error(
                "Erro HTTP: " +
                resposta.status
            );
        }


        /*
        --------------------------------------------------
        CONVERTER RESPOSTA PARA JSON
        --------------------------------------------------
        */

        const resultado =
            await resposta.json();


        /*
        --------------------------------------------------
        VERIFICAR RESULTADO DA API
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
    IDENTIFICAR A LINHA SALVA
    --------------------------------------------------
    */

    // Cadastro: usa o ID retornado pelo Apps Script.
    // Edição: usa o ID já existente no formulário.

    const idLinhaSalva =
        resultado.id_linha || dados.id_linha;

    console.log(
        "Linha salva com ID:",
        idLinhaSalva
    );


    /*
    --------------------------------------------------
    ENVIAR ARQUIVO KML
    --------------------------------------------------
    */

    let mensagemKml = "";

    const campoKml =
        document.getElementById("arquivoKml");

    if (campoKml && campoKml.files.length > 0) {

        console.log(
            "Arquivo KML selecionado:",
            campoKml.files[0].name
        );

        try {

            const resultadoKml =
                await enviarKmlLinha(idLinhaSalva);

            console.log(
                "Resultado do upload KML:",
                resultadoKml
            );

            mensagemKml =
                " Trajeto KML salvo com sucesso.";

        } catch (erroKml) {

            console.error(
                "Erro no upload KML:",
                erroKml
            );

            mensagemKml =
                " ATENÇÃO: A linha foi salva, " +
                "mas o KML não foi enviado: " +
                erroKml.message;

        }

    } else {

        console.log(
            "Nenhum arquivo KML selecionado."
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
    MOSTRAR MENSAGEM
    --------------------------------------------------
    */

    mostrarMensagem(
        (
            resultado.mensagem ||
            (
                idLinha
                    ? "Linha atualizada com sucesso."
                    : "Linha cadastrada com sucesso."
            )
        ) + mensagemKml
    );


            /*
            --------------------------------------------------
            ATUALIZAR LISTAGEM
            --------------------------------------------------
            */

            await carregarLinhas();


        } catch (erro) {

            console.error(
                "Erro ao salvar linha:",
                erro
            );

            alert(
                "Não foi possível salvar a linha.\n\n" +
                erro.message
            );


        } finally {

            /*
            --------------------------------------------------
            REATIVAR BOTÃO SALVAR
            --------------------------------------------------
            */

            if (botao) {

                botao.disabled = false;

                botao.textContent = "SALVAR";
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
            document.getElementById("listaLinhas");

        if (!tbody) {

            console.error(
                "listaLinhas não encontrado."
            );

            return;
        }


        /*
        ------------------------------------------------------
        MOSTRAR CARREGAMENTO
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

        const resposta = await fetch(
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
        CONVERTER RESPOSTA
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
        ARMAZENAR LINHAS RECEBIDAS
        --------------------------------------------------
        */

        todasLinhas =
            Array.isArray(resultado.dados)
                ? resultado.dados
                : [];


        /*
        --------------------------------------------------
        INFORMAÇÕES PARA CONFERÊNCIA
        --------------------------------------------------
        */

        console.log(
            "TOTAL DE LINHAS:",
            todasLinhas.length
        );

        console.log(
            "PRIMEIRA LINHA:",
            todasLinhas[0] || null
        );

        console.log(
            "EXEMPLO DE RELACIONAMENTO:",
            todasLinhas.find(
                item => String(item.id_tarifa ?? "").trim()
            ) || null
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
            parametros.get("empresa");


        /*
        --------------------------------------------------
        PREENCHER PESQUISA
        --------------------------------------------------
        */

        const pesquisa =
            document.getElementById("pesquisa");

        if (empresaURL && pesquisa) {

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
        FILTRAR EMPRESA RECEBIDA PELA URL
        --------------------------------------------------
        */

        if (empresaURL) {

            const empresaProcurada =
                normalizarTexto(empresaURL);

            const linhasEmpresa =
                todasLinhas.filter(
                    function (item) {

                        return (
                            normalizarTexto(item.empresa) ===
                            empresaProcurada
                        );
                    }
                );

            console.log(
                "LINHAS DA EMPRESA:",
                linhasEmpresa.length
            );

            exibirLinhas(linhasEmpresa);

        } else {

            /*
            ----------------------------------------------
            APLICAR PESQUISA E FILTROS EXISTENTES
            ----------------------------------------------
            */

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

    return String(valor ?? "")

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
        document.getElementById("listaLinhas");

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

    linhasFiltradas = linhas;


    /*
    ------------------------------------------------------
    LIMPAR TABELA
    ------------------------------------------------------
    */

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
    CALCULAR TOTAL DE PÁGINAS
    ------------------------------------------------------
    */

    const totalPaginas =
        Math.ceil(
            linhas.length / itensPorPagina
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
        (paginaAtual - 1) * itensPorPagina;

    const fim =
        inicio + itensPorPagina;

    const linhasPagina =
        linhas.slice(inicio, fim);


    /*
    ------------------------------------------------------
    EXIBIR REGISTROS
    ------------------------------------------------------
    */

    linhasPagina.forEach(
        function (item) {

            const tr =
                document.createElement("tr");


            /*
            ----------------------------------------------
            STATUS
            ----------------------------------------------
            */

            const statusClasse =
                String(item.status || "")
                    .toLowerCase() === "ativa"

                    ? "status-ativa"
                    : "status-inativa";


            /*
            ----------------------------------------------
            CONTEÚDO DA LINHA
            ----------------------------------------------
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
                        class="btn-mapa"
                        onclick="abrirMapaLinha(${Number(item.id_linha)})"
                        ${String(item.id_kml || "").trim() ? "" : "disabled"}
                        title="${String(item.id_kml || "").trim()
                            ? "Visualizar trajeto"
                            : "Linha sem KML cadastrado"}"
                    >
                        Mapa
                    </button>

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
        }
    );


    /*
    ------------------------------------------------------
    ATUALIZAR PAGINAÇÃO
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
        document.getElementById("infoPagina");

    const btnAnterior =
        document.getElementById("btnPaginaAnterior");

    const btnProxima =
        document.getElementById("btnProximaPagina");

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
                totalItens / itensPorPagina
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

    exibirLinhas(linhasFiltradas);
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

    if (paginaAtual >= totalPaginas) {
        return;
    }

    paginaAtual++;

    exibirLinhas(linhasFiltradas);
}


/*
==========================================================
CONFIGURAR FILTROS
==========================================================
*/

function configurarFiltros() {

    const botoes =
        document.querySelectorAll(".btn-filtro");

    const menu =
        document.getElementById("menuFiltro");

    const pesquisa =
        document.getElementById("pesquisaFiltro");

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
    BOTÕES DE FILTRO
    ------------------------------------------------------
    */

    botoes.forEach(
        function (botao) {

            botao.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    abrirFiltro(botao);
                }
            );
        }
    );


    /*
    ------------------------------------------------------
    PESQUISA DENTRO DO FILTRO
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
    APLICAR FILTRO
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
    LIMPAR FILTRO
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
    FECHAR MENU CLICANDO FORA
    ------------------------------------------------------
    */

    document.addEventListener(
        "click",
        function (event) {

            if (!menu) {
                return;
            }

            if (menu.contains(event.target)) {
                return;
            }

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
        document.getElementById("menuFiltro");

    const titulo =
        document.getElementById("tituloFiltro");

    const pesquisa =
        document.getElementById("pesquisaFiltro");

    if (!menu) {
        return;
    }


    /*
    ------------------------------------------------------
    IDENTIFICAR COLUNA
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
        botao.closest("th");

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
        pesquisa.value = "";
    }


    /*
    ------------------------------------------------------
    CARREGAR OPÇÕES
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
    ABRIR MENU
    ------------------------------------------------------
    */

    menu.classList.add("ativo");


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

    lista.innerHTML = "";


    /*
    ------------------------------------------------------
    OBTER VALORES ÚNICOS
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
    FILTROS JÁ SELECIONADOS
    ------------------------------------------------------
    */

    const selecionados =
        filtrosAtivos[colunaFiltroAtual] || [];


    /*
    ------------------------------------------------------
    CRIAR CHECKBOXES
    ------------------------------------------------------
    */

    valores.forEach(
        function (valor) {

            const label =
                document.createElement("label");

            label.className =
                "opcao-filtro";

            const checkbox =
                document.createElement("input");

            checkbox.type =
                "checkbox";

            checkbox.value =
                valor;

            checkbox.checked =
                selecionados.length === 0 ||
                selecionados.includes(valor);

            const span =
                document.createElement("span");

            span.textContent =
                valor;

            label.appendChild(checkbox);

            label.appendChild(span);

            lista.appendChild(label);
        }
    );


    /*
    ------------------------------------------------------
    MARCAR SELECIONAR TODOS
    ------------------------------------------------------
    */

    if (selecionarTodos) {

        selecionarTodos.checked =
            selecionados.length === 0 ||
            selecionados.length === valores.length;
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

    const termo =
        pesquisa.value
            .trim()
            .toLowerCase();

    const opcoes =
        document.querySelectorAll(
            "#listaOpcoesFiltro .opcao-filtro"
        );

    opcoes.forEach(
        function (opcao) {

            const texto =
                opcao.textContent
                    .trim()
                    .toLowerCase();

            opcao.style.display =
                texto.includes(termo)
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

    const checkboxes =
        Array.from(
            document.querySelectorAll(
                "#listaOpcoesFiltro input[type='checkbox']"
            )
        );

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
    TODOS SELECIONADOS
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
        ] = selecionados;
    }

    paginaAtual = 1;

    fecharFiltro();

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

    delete filtrosAtivos[
        colunaFiltroAtual
    ];

    paginaAtual = 1;

    fecharFiltro();

    aplicarTodosFiltros();
}


/*
==========================================================
FECHAR MENU DO FILTRO
==========================================================
*/

function fecharFiltro() {

    const menu =
        document.getElementById("menuFiltro");

    if (menu) {
        menu.classList.remove("ativo");
    }

    colunaFiltroAtual = null;
}


/*
==========================================================
APLICAR PESQUISA E FILTROS
==========================================================
*/

function aplicarTodosFiltros() {

    const campoPesquisa =
        document.getElementById("pesquisa");

    const termo =
        campoPesquisa
            ? normalizarTexto(
                campoPesquisa.value
            )
            : "";


    /*
    ------------------------------------------------------
    FILTRAR REGISTROS
    ------------------------------------------------------
    */

    const resultado =
        todasLinhas.filter(
            function (item) {

                /*
                ------------------------------------------
                PESQUISA GERAL
                ------------------------------------------
                */

                if (termo) {

                    const encontrou = [

                        item.empresa,
                        item.cod,
                        item.linha,
                        item.tipo,
                        item.embarque_ida,
                        item.embarque_volta,
                        item.tarifa_cartao,
                        item.tarifa_dinheiro,
                        item.status

                    ].some(
                        function (valor) {

                            return normalizarTexto(
                                valor
                            ).includes(termo);
                        }
                    );

                    if (!encontrou) {
                        return false;
                    }
                }


                /*
                ------------------------------------------
                FILTROS DAS COLUNAS
                ------------------------------------------
                */

                for (
                    const coluna in filtrosAtivos
                ) {

                    const permitidos =
                        filtrosAtivos[coluna];

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

    exibirLinhas(resultado);

    atualizarIndicadoresFiltros();
}


/*
==========================================================
INDICAR FILTROS ATIVOS
==========================================================
*/

function atualizarIndicadoresFiltros() {

    const botoes =
        document.querySelectorAll(".btn-filtro");

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

    paginaAtual = 1;

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

    const inputKml = document.getElementById("arquivoKml");
    const informacaoKml = document.getElementById("kmlSelecionado");

    if (inputKml) {
        inputKml.value = "";
    }

    if (informacaoKml) {
        informacaoKml.textContent = "";
    }

    /*
    ------------------------------------------------------
    VERIFICAR MODAL
    ------------------------------------------------------
    */

    const modal =
        document.getElementById("modalLinha");

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

        const resposta = await fetch(
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

        if (!resultado.sucesso) {

            throw new Error(
                resultado.mensagem ||
                "Não foi possível localizar a linha."
            );
        }

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
            document.getElementById("id_linha");

        if (campoId) {

            campoId.value =
                linha.id_linha ?? idLinha;
        }


        /*
        --------------------------------------------------
        PREENCHER EMPRESA
        --------------------------------------------------
        */

        const empresa =
            document.getElementById("empresa");

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
            document.getElementById("cod");

        if (cod) {

            cod.value =
                linha.cod ?? "";
        }


        /*
        --------------------------------------------------
        PREENCHER NOME DA LINHA
        --------------------------------------------------
        */

        const campoLinha =
            document.getElementById("linha");

        if (campoLinha) {

            campoLinha.value =
                linha.linha ?? "";
        }


        /*
        --------------------------------------------------
        PREENCHER TIPO PELO ID_TARIFA
        --------------------------------------------------
        */

        const selectTipo =
            document.getElementById("tipo");

        if (selectTipo) {

            /*
            ----------------------------------------------
            REMOVER OPÇÕES TEMPORÁRIAS ANTERIORES
            ----------------------------------------------
            */

            selectTipo
                .querySelectorAll(
                    'option[data-tipo-antigo="1"]'
                )
                .forEach(
                    option => option.remove()
                );


            /*
            ----------------------------------------------
            IDENTIFICAR TARIFA E TIPO
            ----------------------------------------------
            */

            const idTarifa =
                String(
                    linha.id_tarifa ?? ""
                ).trim();

            const tipoAtual =
                String(
                    linha.tipo ?? ""
                ).trim();


            /*
            ----------------------------------------------
            PROCURAR PELO ID DA TARIFA
            ----------------------------------------------
            */

            const opcaoPorId =
                Array.from(selectTipo.options)
                    .find(
                        option =>
                            idTarifa !== "" &&
                            option.value === idTarifa
                    );


            if (opcaoPorId) {

                /*
                ------------------------------------------
                TARIFA VINCULADA ENCONTRADA
                ------------------------------------------
                */

                selectTipo.value =
                    opcaoPorId.value;

            } else if (idTarifa) {

                /*
                ------------------------------------------
                ID INFORMADO, MAS TARIFA NÃO ENCONTRADA
                ------------------------------------------
                */

                const option =
                    document.createElement("option");

                option.value = "";

                option.textContent =
                    tipoAtual
                        ? `${tipoAtual} (tarifa não encontrada: ID ${idTarifa})`
                        : `Tarifa não encontrada: ID ${idTarifa}`;

                option.dataset.tipoAntigo = "1";

                selectTipo.appendChild(option);

                selectTipo.selectedIndex =
                    selectTipo.options.length - 1;

            } else {

                /*
                ------------------------------------------
                REGISTRO ANTIGO SEM ID_TARIFA
                ------------------------------------------
                */

                const opcoesCorrespondentes =
                    Array.from(selectTipo.options)
                        .filter(
                            option =>
                                option.value !== "" &&
                                normalizarTexto(
                                    option.textContent
                                ) === normalizarTexto(
                                    tipoAtual
                                )
                        );

                if (
                    tipoAtual &&
                    opcoesCorrespondentes.length === 1
                ) {

                    /*
                    --------------------------------------
                    CORRESPONDÊNCIA ÚNICA PELO NOME
                    --------------------------------------
                    */

                    selectTipo.value =
                        opcoesCorrespondentes[0].value;

                } else if (tipoAtual) {

                    /*
                    --------------------------------------
                    PRESERVAR TIPO ANTIGO SEM CRIAR
                    VÍNCULO AUTOMÁTICO INCORRETO
                    --------------------------------------
                    */

                    const option =
                        document.createElement("option");

                    option.value = "";

                    option.textContent =
                        tipoAtual +
                        " (selecione uma tarifa)";

                    option.dataset.tipoAntigo = "1";

                    selectTipo.appendChild(option);

                    selectTipo.selectedIndex =
                        selectTipo.options.length - 1;

                } else {

                    selectTipo.value = "";
                }
            }
        }


        /*
        --------------------------------------------------
        PREENCHER EMBARQUE IDA
        --------------------------------------------------
        */

        const embarqueIda =
            document.getElementById("embarque_ida");

        if (embarqueIda) {

            embarqueIda.value =
                linha.embarque_ida ?? "";
        }


        /*
        --------------------------------------------------
        PREENCHER EMBARQUE VOLTA
        --------------------------------------------------
        */

        const embarqueVolta =
            document.getElementById("embarque_volta");

        if (embarqueVolta) {

            embarqueVolta.value =
                linha.embarque_volta ?? "";
        }


        /*
        --------------------------------------------------
        PREENCHER TARIFA CARTÃO
        --------------------------------------------------
        */

        const tarifaCartao =
            document.getElementById("tarifa_cartao");

        if (tarifaCartao) {

            tarifaCartao.value =
                normalizarNumeroFormulario(
                    linha.tarifa_cartao
                );
        }


        /*
        --------------------------------------------------
        PREENCHER TARIFA DINHEIRO
        --------------------------------------------------
        */

        const tarifaDinheiro =
            document.getElementById("tarifa_dinheiro");

        if (tarifaDinheiro) {

            tarifaDinheiro.value =
                normalizarNumeroFormulario(
                    linha.tarifa_dinheiro
                );
        }


        /*
        --------------------------------------------------
        PREENCHER STATUS
        --------------------------------------------------
        */

        const status =
            document.getElementById("status");

        if (status) {

            status.value =
                linha.status ?? "Ativa";
        }


        /*
        --------------------------------------------------
        ALTERAR TÍTULO
        --------------------------------------------------
        */

        const titulo =
            document.getElementById("tituloModal");

        if (titulo) {

            titulo.textContent =
                "Editar Linha";
        }


        /*
        --------------------------------------------------
        ABRIR MODAL
        --------------------------------------------------
        */

        modal.classList.add("ativo");


        /*
        --------------------------------------------------
        FOCO NO CAMPO EMPRESA
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
EXCLUIR LINHA
==========================================================
*/

function excluirLinha(idLinha) {

    /*
    ------------------------------------------------------
    VALIDAR ID
    ------------------------------------------------------
    */

    if (
        !idLinha ||
        Number(idLinha) <= 0
    ) {

        alert(
            "Identificador da linha inválido."
        );

        return;
    }


    /*
    ------------------------------------------------------
    GUARDAR ID PARA EXCLUSÃO
    ------------------------------------------------------
    */

    idLinhaParaExcluir = idLinha;


    /*
    ------------------------------------------------------
    LOCALIZAR REGISTRO
    ------------------------------------------------------
    */

    const linha =
        todasLinhas.find(
            item =>
                String(item.id_linha) ===
                String(idLinha)
        );


    /*
    ------------------------------------------------------
    IDENTIFICAR MODAL
    ------------------------------------------------------
    */

    const modal =
        document.getElementById("modalExclusao");

    if (!modal) {

        alert(
            "Modal de exclusão não encontrado."
        );

        return;
    }


    /*
    ------------------------------------------------------
    DESCRIÇÃO DA LINHA
    ------------------------------------------------------
    */

    const descricao =
        document.getElementById(
            "descricaoExclusao"
        );

    if (descricao) {

        if (linha) {

            descricao.textContent =
                `${linha.cod} - ${linha.linha}`;

        } else {

            descricao.textContent =
                `Linha ID ${idLinha}`;
        }
    }


    /*
    ------------------------------------------------------
    ABRIR MODAL
    ------------------------------------------------------
    */

    modal.classList.add("ativo");
}


/*
==========================================================
FECHAR MODAL DE EXCLUSÃO
==========================================================
*/

function fecharModalExclusao() {

    const modal =
        document.getElementById("modalExclusao");

    if (modal) {

        modal.classList.remove("ativo");
    }

    /*
    ------------------------------------------------------
    LIMPAR IDENTIFICADOR
    ------------------------------------------------------
    */

    idLinhaParaExcluir = null;
}


/*
==========================================================
CONFIRMAR EXCLUSÃO DA LINHA
==========================================================
*/

async function confirmarExclusaoLinha() {

    /*
    ------------------------------------------------------
    VALIDAR ID
    ------------------------------------------------------
    */

    if (!idLinhaParaExcluir) {

        alert(
            "Nenhuma linha selecionada para exclusão."
        );

        return;
    }


    /*
    ------------------------------------------------------
    GUARDAR ID ANTES DE ENVIAR
    ------------------------------------------------------
    */

    const idLinha =
        idLinhaParaExcluir;


    /*
    ------------------------------------------------------
    BOTÃO CONFIRMAR
    ------------------------------------------------------
    */

    const botao =
        document.getElementById(
            "btnConfirmarExclusao"
        );


    /*
    ------------------------------------------------------
    DESABILITAR BOTÃO
    ------------------------------------------------------
    */

    if (botao) {

        botao.disabled = true;

        botao.textContent = "EXCLUINDO...";
    }


    try {

        /*
        --------------------------------------------------
        ENVIAR EXCLUSÃO PARA API
        --------------------------------------------------
        */

        const resposta = await fetch(
            API_URL,
            {
                method: "POST",

                body: JSON.stringify({
                    acao: "excluir",
                    id_linha: idLinha
                })
            }
        );


        /*
        --------------------------------------------------
        VERIFICAR RESPOSTA HTTP
        --------------------------------------------------
        */

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
        VERIFICAR SUCESSO
        --------------------------------------------------
        */

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
        MOSTRAR MENSAGEM
        --------------------------------------------------
        */

        mostrarMensagem(
            resultado.mensagem ||
            "Linha excluída com sucesso."
        );


        /*
        --------------------------------------------------
        ATUALIZAR TABELA
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

            botao.disabled = false;

            botao.textContent = "EXCLUIR";
        }
    }
}


/*
==========================================================
CARREGAR EMPRESAS NO SELECT
==========================================================
*/

async function carregarEmpresasSelect() {

    const selectEmpresa =
        document.getElementById("empresa");

    if (!selectEmpresa) {

        console.warn(
            "Campo empresa não encontrado."
        );

        return;
    }

    selectEmpresa.disabled = true;

    selectEmpresa.innerHTML = `
        <option value="">
            Carregando empresas...
        </option>
    `;

    try {

        const resposta = await fetch(
            `${API_URL}?acao=listar_empresas`
        );

        if (!resposta.ok) {

            throw new Error(
                "Erro HTTP: " + resposta.status
            );
        }

        const resultado =
            await resposta.json();

        if (!resultado.sucesso) {

            throw new Error(
                resultado.mensagem ||
                "Erro ao carregar empresas."
            );
        }

        const empresas =
            Array.isArray(resultado.dados)
                ? resultado.dados
                : [];

        /*
        --------------------------------------------------
        ORDENAR EMPRESAS
        --------------------------------------------------
        */

        empresas.sort(
            (a, b) =>
                String(a.empresa || "")
                    .localeCompare(
                        String(b.empresa || ""),
                        "pt-BR"
                    )
        );

        /*
        --------------------------------------------------
        OPÇÃO INICIAL
        --------------------------------------------------
        */

        selectEmpresa.innerHTML = `
            <option value="">
                Selecione uma empresa
            </option>
        `;

        /*
        --------------------------------------------------
        ADICIONAR EMPRESAS
        --------------------------------------------------
        */

        empresas.forEach(
            function (empresa) {

                const nome =
                    String(
                        empresa.empresa || ""
                    ).trim();

                if (!nome) {
                    return;
                }

                const option =
                    document.createElement("option");

                option.value = nome;

                option.textContent = nome;

                selectEmpresa.appendChild(option);
            }
        );

        console.log(
            "Empresas carregadas:",
            empresas.length
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar empresas:",
            erro
        );

        selectEmpresa.innerHTML = `
            <option value="">
                Erro ao carregar empresas
            </option>
        `;

    } finally {

        selectEmpresa.disabled = false;
    }
}


/*
==========================================================
CARREGAR TIPOS DE TARIFAS NO SELECT
==========================================================
*/

async function carregarTiposSelect() {

    const selectTipo =
        document.getElementById("tipo");

    if (!selectTipo) {

        console.warn(
            "Campo tipo não encontrado."
        );

        return;
    }

    /*
    ------------------------------------------------------
    DESABILITAR ENQUANTO CARREGA
    ------------------------------------------------------
    */

    selectTipo.disabled = true;

    selectTipo.innerHTML = `
        <option value="">
            Carregando tarifas...
        </option>
    `;

    try {

        /*
        --------------------------------------------------
        BUSCAR TARIFAS NA API
        --------------------------------------------------
        */

        const resposta = await fetch(
            `${API_URL}?acao=listar_tarifas`
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
                "Erro ao carregar tarifas."
            );
        }

        /*
        --------------------------------------------------
        RECEBER TARIFAS
        --------------------------------------------------
        */

        const tarifas =
            Array.isArray(resultado.dados)
                ? resultado.dados
                : [];

        /*
        --------------------------------------------------
        ORDENAR POR TIPO
        --------------------------------------------------
        */

        tarifas.sort(
            function (a, b) {

                return String(a.tipo || "")
                    .localeCompare(
                        String(b.tipo || ""),
                        "pt-BR"
                    );
            }
        );

        /*
        --------------------------------------------------
        CRIAR OPÇÃO INICIAL
        --------------------------------------------------
        */

        selectTipo.innerHTML = `
            <option value="">
                Selecione uma tarifa
            </option>
        `;

        /*
        --------------------------------------------------
        ADICIONAR TARIFAS
        --------------------------------------------------
        */

        tarifas.forEach(
            function (tarifa) {

                const idTarifa =
                    String(
                        tarifa.id_tarifa ?? ""
                    ).trim();

                const nomeTipo =
                    String(
                        tarifa.tipo ?? ""
                    ).trim();

                if (
                    !idTarifa ||
                    !nomeTipo
                ) {
                    return;
                }

                /*
                ------------------------------------------
                CRIAR OPÇÃO
                ------------------------------------------
                */

                const option =
                    document.createElement("option");

                /*
                ------------------------------------------
                VALUE = ID_TARIFA
                ------------------------------------------
                */

                option.value = idTarifa;

                /*
                ------------------------------------------
                TEXTO = NOME DO TIPO
                ------------------------------------------
                */

                option.textContent = nomeTipo;

                /*
                ------------------------------------------
                GUARDAR VALORES DA TARIFA
                ------------------------------------------
                */

                option.dataset.cartao =
                    tarifa.tarifa_cartao ?? "";

                option.dataset.dinheiro =
                    tarifa.tarifa_dinheiro ?? "";

                /*
                ------------------------------------------
                ADICIONAR AO SELECT
                ------------------------------------------
                */

                selectTipo.appendChild(option);
            }
        );

        console.log(
            "Tarifas carregadas:",
            tarifas.length
        );

    } catch (erro) {

        console.error(
            "Erro ao carregar tarifas:",
            erro
        );

        selectTipo.innerHTML = `
            <option value="">
                Erro ao carregar tarifas
            </option>
        `;

    } finally {

        selectTipo.disabled = false;
    }


    /*
    ------------------------------------------------------
    PREENCHER VALORES AO SELECIONAR TARIFA
    ------------------------------------------------------
    */

    selectTipo.addEventListener(
        "change",
        function () {

            const option =
                selectTipo.selectedOptions[0];

            const campoCartao =
                document.getElementById(
                    "tarifa_cartao"
                );

            const campoDinheiro =
                document.getElementById(
                    "tarifa_dinheiro"
                );

            if (
                !campoCartao ||
                !campoDinheiro
            ) {
                return;
            }

            /*
            ----------------------------------------------
            NENHUMA TARIFA SELECIONADA
            ----------------------------------------------
            */

            if (
                !option ||
                !selectTipo.value
            ) {

                campoCartao.value = "";

                campoDinheiro.value = "";

                return;
            }

            /*
            ----------------------------------------------
            VALORES DA TARIFA SELECIONADA
            ----------------------------------------------
            */

            const valorCartao =
                option.dataset.cartao ?? "";

            const valorDinheiro =
                option.dataset.dinheiro ?? "";

            /*
            ----------------------------------------------
            PREENCHER CAMPOS
            ----------------------------------------------
            */

            campoCartao.value =
                normalizarNumeroFormulario(
                    valorCartao
                );

            campoDinheiro.value =
                normalizarNumeroFormulario(
                    valorDinheiro
                );

            console.log(
                "Tarifa selecionada:",
                {
                    id_tarifa: selectTipo.value,
                    tipo: option.textContent.trim(),
                    cartao: valorCartao,
                    dinheiro: valorDinheiro
                }
            );
        }
    );
}


/*
==========================================================
FORMATAR TARIFA PARA EXIBIÇÃO NA TABELA
==========================================================
*/

function formatarTarifa(valor) {

    if (
        valor === null ||
        valor === undefined ||
        String(valor).trim() === ""
    ) {
        return "-";
    }

    const numero =
        converterValorMonetario(valor);

    if (!Number.isFinite(numero)) {
        return "-";
    }

    return numero.toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );
}


/*
==========================================================
CONVERTER VALOR MONETÁRIO PARA NÚMERO
==========================================================
*/

function converterValorMonetario(valor) {

    if (
        valor === null ||
        valor === undefined ||
        String(valor).trim() === ""
    ) {
        return NaN;
    }

    if (typeof valor === "number") {
        return valor;
    }

    let texto =
        String(valor)
            .trim()
            .replace(/R\$\s*/gi, "")
            .replace(/\s/g, "");

    /*
    ------------------------------------------------------
    IDENTIFICAR SEPARADORES DECIMAIS
    ------------------------------------------------------
    */

    const temVirgula =
        texto.includes(",");

    const temPonto =
        texto.includes(".");

    if (temVirgula && temPonto) {

        /*
        --------------------------------------------------
        O ÚLTIMO SEPARADOR É O DECIMAL
        --------------------------------------------------
        */

        if (
            texto.lastIndexOf(",") >
            texto.lastIndexOf(".")
        ) {

            // Exemplo: 1.234,56
            texto = texto
                .replace(/\./g, "")
                .replace(",", ".");

        } else {

            // Exemplo: 1,234.56
            texto = texto.replace(/,/g, "");
        }

    } else if (temVirgula) {

        // Exemplo: 5,50
        texto = texto.replace(",", ".");

    } else if (
        /^\d{1,3}(\.\d{3})+$/.test(texto)
    ) {

        // Exemplo: 1.234
        texto = texto.replace(/\./g, "");
    }

    if (
        !/^-?\d+(\.\d+)?$/.test(texto)
    ) {
        return NaN;
    }

    return Number(texto);
}


/*
==========================================================
NORMALIZAR NÚMERO PARA CAMPO DO FORMULÁRIO
==========================================================
*/

function normalizarNumeroFormulario(valor) {

    if (
        valor === null ||
        valor === undefined ||
        String(valor).trim() === ""
    ) {
        return "";
    }

    const numero =
        converterValorMonetario(valor);

    if (!Number.isFinite(numero)) {
        return "";
    }

    /*
    ------------------------------------------------------
    RETORNAR COM DUAS CASAS DECIMAIS
    ------------------------------------------------------
    */

    return numero.toFixed(2);
}


/*
==========================================================
FORMATAR TARIFA PARA INPUT
==========================================================
*/

function formatarTarifaInput(valor) {

    return normalizarNumeroFormulario(valor);
}


/*
==========================================================
ESCAPAR HTML
==========================================================
*/

function escaparHTML(valor) {

    const texto =
        String(valor ?? "");

    return texto
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}


/*
==========================================================
MOSTRAR MENSAGEM
==========================================================
*/

function mostrarMensagem(mensagem) {

    const texto =
        String(mensagem ?? "").trim();

    if (!texto) {
        return;
    }

    /*
    ------------------------------------------------------
    PROCURAR ELEMENTO DE MENSAGEM
    ------------------------------------------------------
    */

    const elemento =
        document.getElementById("mensagem") ||
        document.getElementById("mensagemSistema");

    /*
    ------------------------------------------------------
    SE NÃO EXISTIR ELEMENTO, MOSTRAR ALERTA
    ------------------------------------------------------
    */

    if (!elemento) {

        alert(texto);

        return;
    }

    /*
    ------------------------------------------------------
    EXIBIR MENSAGEM
    ------------------------------------------------------
    */

    elemento.textContent = texto;

    elemento.style.display = "block";

    /*
    ------------------------------------------------------
    EVITAR TEMPORIZADORES DUPLICADOS
    ------------------------------------------------------
    */

    if (mostrarMensagem.temporizador) {

        clearTimeout(
            mostrarMensagem.temporizador
        );
    }

    /*
    ------------------------------------------------------
    OCULTAR APÓS 4 SEGUNDOS
    ------------------------------------------------------
    */

    mostrarMensagem.temporizador =
        setTimeout(
            function () {

                elemento.style.display = "none";

            },
            4000
        );
}


/*
==================================================
VALIDAR ARQUIVO KML SELECIONADO
==================================================
*/

function configurarCampoKml() {

    const inputKml =
        document.getElementById("arquivoKml");

    const informacao =
        document.getElementById("kmlSelecionado");

    if (!inputKml || !informacao) {
        return;
    }

    // Evita registrar o evento mais de uma vez.
    if (inputKml.dataset.configurado === "1") {
        return;
    }

    inputKml.dataset.configurado = "1";

    inputKml.addEventListener("change", function () {

        const arquivo = inputKml.files[0];

        informacao.textContent = "";

        if (!arquivo) {
            return;
        }

        // Aceitar somente arquivos .kml.
        if (!arquivo.name.toLowerCase().endsWith(".kml")) {

            alert("Selecione um arquivo no formato KML.");

            inputKml.value = "";
            return;
        }

        // Limite inicial de 5 MB.
        const tamanhoMaximo = 5 * 1024 * 1024;

        if (arquivo.size > tamanhoMaximo) {

            alert("O arquivo KML deve ter no máximo 5 MB.");

            inputKml.value = "";
            return;
        }

        informacao.textContent =
            "Arquivo selecionado: " + arquivo.name;

    });
}



/*
==================================================
ENVIAR KML PARA GOOGLE DRIVE
==================================================
*/

async function enviarKmlLinha(idLinha) {

    const inputKml =
        document.getElementById("arquivoKml");

    if (!inputKml || !inputKml.files.length) {
        return {
            sucesso: true,
            ignorado: true
        };
    }

    if (!idLinha) {
        throw new Error(
            "ID da linha não recebido após o cadastro."
        );
    }

    const arquivo = inputKml.files[0];

    if (!arquivo.name.toLowerCase().endsWith(".kml")) {
        throw new Error("Selecione um arquivo KML.");
    }

    if (arquivo.size > 5 * 1024 * 1024) {
        throw new Error("O KML deve ter no máximo 5 MB.");
    }

    const base64 = await new Promise((resolve, reject) => {

        const leitor = new FileReader();

        leitor.onload = () => {

            const resultado = String(leitor.result || "");

            resolve(resultado.split(",")[1] || "");
        };

        leitor.onerror = () => {
            reject(new Error("Erro ao ler o arquivo KML."));
        };

        leitor.readAsDataURL(arquivo);
    });

    console.log("INICIANDO UPLOAD KML");
    console.log("ID da linha:", idLinha);
    console.log("Arquivo:", arquivo.name);
    console.log("Tamanho:", arquivo.size);
    console.log("Base64 gerado:", base64.length);

    const resposta = await fetch(API_URL, {

        method: "POST",

        body: JSON.stringify({
            acao: "salvar_kml",
            id_linha: idLinha,
            nome_arquivo: arquivo.name,
            arquivo_base64: base64
        })
    });

    if (!resposta.ok) {
        throw new Error(
            "Erro HTTP ao enviar KML: " + resposta.status
        );
    }

    const resultado = await resposta.json();

    console.log("RESPOSTA DO UPLOAD KML:", resultado);

    if (!resultado.sucesso) {
        throw new Error(
            resultado.mensagem || "Erro ao salvar o KML."
        );
    }

    if (!resultado.id_kml) {
        throw new Error(
            "A API não retornou o ID do arquivo KML."
        );
    }

    return resultado;
}



/*
==================================================
CARREGAR MODAL DO MAPA
==================================================
*/

async function carregarModalMapa() {

    const container =
        document.getElementById("containerModalMapa");

    if (!container) {
        throw new Error(
            "Container do modal mapa não encontrado."
        );
    }

    const resposta = await fetch("./modals/mapa.html");

    if (!resposta.ok) {
        throw new Error(
            "Erro ao carregar modals/mapa.html."
        );
    }

    container.innerHTML = await resposta.text();

    const modal = document.getElementById("modalMapa");
    const btnFechar = document.getElementById("btnFecharMapa");
    const btnVoltar = document.getElementById("btnVoltarMapa");
    const elementoMapa = document.getElementById("mapaLinha");

    if (!modal || !elementoMapa) {
        throw new Error(
            "modalMapa ou mapaLinha não encontrado no HTML."
        );
    }

    if (btnFechar) {
        btnFechar.addEventListener("click", fecharMapaLinha);
    }

    if (btnVoltar) {
        btnVoltar.addEventListener("click", fecharMapaLinha);
    }

    modal.addEventListener("click", function(event) {

        if (event.target === modal) {
            fecharMapaLinha();
        }

    });

    configurarControlesSentido();

    console.log("Modal mapa carregado com sucesso.");
}




/*
==================================================
MAPA LEAFLET E CAMADAS DOS SENTIDOS
==================================================
*/

// Instância principal do mapa
let mapaLinhaLeaflet = null;

// Camadas independentes
let camadaIda = null;
let camadaVolta = null;

// Sentido selecionado
let sentidoSelecionado = "ambos";


/*
==================================================
ABRIR MAPA DA LINHA
==================================================
*/

async function abrirMapaLinha(idLinha) {

    const modal = document.getElementById("modalMapa");
    const titulo = document.getElementById("tituloMapa");
    const legenda = document.getElementById("legendaMapa");

    if (!document.getElementById("mapaLinha")) {

    console.error(
        "Elemento mapaLinha não encontrado."
    );

    alert(
        "O mapa ainda não está disponível. Atualize a página."
    );

    return;
    }

    if (!modal || typeof L === "undefined") {
        alert("O mapa ainda não foi carregado.");
        return;
    }

    const linha = todasLinhas.find(
        item => String(item.id_linha) === String(idLinha)
    );

    titulo.textContent = linha
        ? `${linha.cod} - ${linha.linha}`
        : `Mapa da linha ${idLinha}`;

    legenda.textContent = "Carregando trajeto...";

    modal.classList.add("ativo");

    
    if (!mapaLinhaLeaflet) {

        mapaLinhaLeaflet = L.map("mapaLinha");

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                maxZoom: 19,
                attribution: "&copy; OpenStreetMap contributors"
            }
        ).addTo(mapaLinhaLeaflet);
    }

    // Limpar as camadas da linha anteriormente exibida
    if (camadaIda) {
        mapaLinhaLeaflet.removeLayer(camadaIda);
    }

    if (camadaVolta) {
        mapaLinhaLeaflet.removeLayer(camadaVolta);
    }


    camadaIda = null;
    camadaVolta = null;

    selecionarSentidoMapa("ambos");

    mapaLinhaLeaflet.setView([-15.78, -47.93], 4);

    setTimeout(() => {
        mapaLinhaLeaflet.invalidateSize();
    }, 100);

    try {

        const resposta = await fetch(
            `${API_URL}?acao=obter_kml&id_linha=${encodeURIComponent(idLinha)}`
        );

        if (!resposta.ok) {
            throw new Error("Erro HTTP: " + resposta.status);
        }

        const resultado = await resposta.json();

        if (!resultado.sucesso) {
            throw new Error(
                resultado.mensagem || "Não foi possível obter o KML."
            );
        }

        const trajetos = extrairTrajetosKml(resultado.kml);

        if (!trajetos.length) {
            throw new Error(
                "O KML não contém trajetos LineString válidos."
            );
        }

        legenda.innerHTML = "";

       
    /*
    ==================================================
    CRIAR CAMADAS SEPARADAS - IDA E VOLTA
    ==================================================
    */

    camadaIda = L.featureGroup();
    camadaVolta = L.featureGroup();

    trajetos.forEach((trajeto, indice) => {

        const nome = String(trajeto.nome || "").toLowerCase();

        // Identificar o sentido pelo nome do Placemark.
        // Se não houver identificação, usar a ordem:
        // primeiro trajeto = ida; segundo = volta.

        let sentido;

        if (/\bida\b/i.test(nome)) {
            sentido = "ida";
        } else if (/\bvolta\b/i.test(nome)) {
            sentido = "volta";
        } else {
            sentido = indice === 0 ? "ida" : "volta";
        }

        const cor = sentido === "ida"
            ? "#1565c0"
            : "#e65100";

        const camada = sentido === "ida"
            ? camadaIda
            : camadaVolta;

        L.polyline(trajeto.pontos, {
            color: cor,
            weight: 4,
            opacity: 0.9
        })
        .bindPopup(trajeto.nome)
        .addTo(camada);

    });

    // Mostrar ambos inicialmente.
    selecionarSentidoMapa("ambos");

    
    document.getElementById("legendaMapa").textContent =
        "Selecione um sentido para visualizar.";

    } catch (erro) {

        console.error(
            "Erro ao carregar mapa:",
            erro
        );

        if (legenda) {
            legenda.textContent =
                "Erro ao carregar trajeto: " + erro.message;
        }

    } finally {

        if (mapaLinhaLeaflet) {
            setTimeout(() => {
                mapaLinhaLeaflet.invalidateSize();
            }, 100);
        }

    }

}

/*
==================================================
EXTRAIR TRAJETOS DO KML
==================================================
*/

function extrairTrajetosKml(conteudoKml) {

    const documento = new DOMParser().parseFromString(
        conteudoKml,
        "application/xml"
    );

    if (
        documento.getElementsByTagName("parsererror").length
    ) {
        throw new Error("XML do KML inválido.");
    }

    const elementos = Array.from(
        documento.getElementsByTagName("*")
    );

    const placemarks = elementos.filter(
        elemento => elemento.localName === "Placemark"
    );

    const trajetos = [];

    placemarks.forEach((placemark, indicePlacemark) => {

        const filhos = Array.from(placemark.children);

        const elementoNome = filhos.find(
            elemento => elemento.localName === "name"
        );

        const nome = elementoNome?.textContent?.trim()
            || `Trajeto ${indicePlacemark + 1}`;

        const linhas = Array.from(
            placemark.getElementsByTagName("*")
        ).filter(
            elemento => elemento.localName === "LineString"
        );

        linhas.forEach((linha, indiceLinha) => {

            const coordenadas = Array.from(
                linha.getElementsByTagName("*")
            ).find(
                elemento => elemento.localName === "coordinates"
            );

            if (!coordenadas) return;

            const pontos = coordenadas.textContent
                .trim()
                .split(/\s+/)
                .map(par => {

                    const valores = par.split(",");

                    const longitude = Number(valores[0]);
                    const latitude = Number(valores[1]);

                    if (
                        !Number.isFinite(latitude) ||
                        !Number.isFinite(longitude) ||
                        Math.abs(latitude) > 90 ||
                        Math.abs(longitude) > 180
                    ) {
                        return null;
                    }

                    return [latitude, longitude];
                })
                .filter(Boolean);

            if (pontos.length >= 2) {
                trajetos.push({
                    nome: linhas.length > 1
                        ? `${nome} (${indiceLinha + 1})`
                        : nome,
                    pontos: pontos
                });
            }
        });
    });

    return trajetos;
}


/*
==================================================
FECHAR MAPA
==================================================
*/

function fecharMapaLinha() {

    const modal = document.getElementById("modalMapa");

    if (modal) {
        modal.classList.remove("ativo");
    }
}


/*
==================================================
CONFIGURAR BOTÕES IDA / VOLTA / AMBOS
==================================================
*/

function configurarControlesSentido() {

    const botoes = document.querySelectorAll(
        "#modalMapa .btn-sentido"
    );

    botoes.forEach(botao => {

        botao.addEventListener("click", function() {

            selecionarSentidoMapa(
                this.dataset.sentido
            );

        });

    });
}


/*
==================================================
SELECIONAR SENTIDO DO MAPA
==================================================
*/

function selecionarSentidoMapa(sentido) {

    if (!["ambos", "ida", "volta"].includes(sentido)) {
        return;
    }

    sentidoSelecionado = sentido;

    // Atualizar aparência dos botões.
    document.querySelectorAll(
        "#modalMapa .btn-sentido"
    ).forEach(botao => {

        const ativo =
            botao.dataset.sentido === sentido;

        botao.classList.toggle("ativo", ativo);

        botao.setAttribute(
            "aria-pressed",
            String(ativo)
        );
    });

    if (!mapaLinhaLeaflet) {
        return;
    }

    // Remover os trajetos atualmente visíveis.
    if (camadaIda) {
        mapaLinhaLeaflet.removeLayer(camadaIda);
    }

    if (camadaVolta) {
        mapaLinhaLeaflet.removeLayer(camadaVolta);
    }

    // Mostrar os trajetos selecionados.
    if (
        (sentido === "ambos" || sentido === "ida") &&
        camadaIda
    ) {
        camadaIda.addTo(mapaLinhaLeaflet);
    }

    if (
        (sentido === "ambos" || sentido === "volta") &&
        camadaVolta
    ) {
        camadaVolta.addTo(mapaLinhaLeaflet);
    }

    // Centralizar somente os trajetos visíveis.
    const camadasVisiveis = L.featureGroup();

    if (
        (sentido === "ambos" || sentido === "ida") &&
        camadaIda
    ) {
        camadasVisiveis.addLayer(camadaIda);
    }

    if (
        (sentido === "ambos" || sentido === "volta") &&
        camadaVolta
    ) {
        camadasVisiveis.addLayer(camadaVolta);
    }

    if (camadasVisiveis.getLayers().length) {

        const limites = camadasVisiveis.getBounds();

        if (limites.isValid()) {
            mapaLinhaLeaflet.fitBounds(limites, {
                padding: [30, 30],
                maxZoom: 16
            });
        }
    }
}



