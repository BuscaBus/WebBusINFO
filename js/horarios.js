
/*
==========================================================
CONFIGURAÇÃO DA API
==========================================================
*/

const API_HORARIOS_URL =
    "https://script.google.com/macros/s/AKfycby4yCUL5jcSiE1UVBUIg1JPeoZmjE57h6rTXn14FYwIzOW3blMCNM4eIZJCgFdz0M17/exec";


/*
==========================================================
VARIÁVEIS
==========================================================
*/

let linhaSelecionada = null;
let idLinhaHorarios = null;


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
        IDENTIFICAR LINHA RECEBIDA PELA URL
        --------------------------------------------------
        */

        const parametros =
            new URLSearchParams(window.location.search);

        idLinhaHorarios =
            parametros.get("id_linha");

        if (
            !idLinhaHorarios ||
            !/^\d+$/.test(idLinhaHorarios) ||
            Number(idLinhaHorarios) <= 0
        ) {

            mostrarMensagemHorarios(
                "Identificador da linha inválido."
            );

            document.getElementById("tituloLinha")
                .textContent = "Linha não identificada";

            return;
        }

        /*
        --------------------------------------------------
        CONFIGURAR BOTÃO VOLTAR
        --------------------------------------------------
        */

        const btnVoltar =
            document.getElementById("btnVoltar");

        if (btnVoltar) {

            btnVoltar.href =
                "./index.html";
        }

        /*
        --------------------------------------------------
        CARREGAR DADOS DA LINHA
        --------------------------------------------------
        */

        await carregarDadosLinha();

    }
);


/*
==========================================================
CARREGAR DADOS DA LINHA
==========================================================
*/

async function carregarDadosLinha() {

    const titulo =
        document.getElementById("tituloLinha");

    const selectViagem =
        document.getElementById("viagem");

    if (!titulo || !selectViagem) {
        return;
    }

    titulo.textContent =
        "Carregando dados da linha...";

    selectViagem.innerHTML =
        '<option value="">Carregando embarques...</option>';

    try {

        /*
        --------------------------------------------------
        CONSULTAR API
        --------------------------------------------------
        */

        const resposta = await fetch(
            `${API_HORARIOS_URL}?acao=buscar&id_linha=${encodeURIComponent(idLinhaHorarios)}`
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
                "Não foi possível carregar a linha."
            );
        }

        /*
        --------------------------------------------------
        ARMAZENAR LINHA
        --------------------------------------------------
        */

        linhaSelecionada =
            resultado.dados;

        if (!linhaSelecionada) {

            throw new Error(
                "Linha não encontrada."
            );
        }

        /*
        --------------------------------------------------
        PREENCHER TÍTULO
        --------------------------------------------------
        */

        const codigo =
            String(linhaSelecionada.cod ?? "").trim();

        const nome =
            String(linhaSelecionada.linha ?? "").trim();

        titulo.textContent =
            `${codigo} - ${nome}`;

        /*
        --------------------------------------------------
        PREENCHER VIAGENS
        --------------------------------------------------
        */

        preencherViagens();

    } catch (erro) {

        console.error(
            "Erro ao carregar dados da linha:",
            erro
        );

        titulo.textContent =
            "Erro ao carregar linha";

        selectViagem.innerHTML =
            '<option value="">Não foi possível carregar</option>';

        mostrarMensagemHorarios(
            "Não foi possível carregar os dados da linha: " +
            erro.message
        );
    }
}


/*
==========================================================
PREENCHER CAMPO VIAGEM
==========================================================
*/

function preencherViagens() {

    const select =
        document.getElementById("viagem");

    if (!select || !linhaSelecionada) {
        return;
    }

    /*
    ------------------------------------------------------
    LIMPAR OPÇÕES
    ------------------------------------------------------
    */

    select.innerHTML = "";

    const opcaoInicial =
        document.createElement("option");

    opcaoInicial.value = "";
    opcaoInicial.textContent =
        "Selecione a viagem";

    select.appendChild(opcaoInicial);

    /*
    ------------------------------------------------------
    EMBARQUE IDA
    ------------------------------------------------------
    */

    const embarqueIda =
        String(
            linhaSelecionada.embarque_ida ?? ""
        ).trim();

    if (embarqueIda) {

        const opcaoIda =
            document.createElement("option");

        opcaoIda.value = "ida";

        opcaoIda.textContent =
            embarqueIda;

        select.appendChild(opcaoIda);
    }

    /*
    ------------------------------------------------------
    EMBARQUE VOLTA
    ------------------------------------------------------
    */

    const embarqueVolta =
        String(
            linhaSelecionada.embarque_volta ?? ""
        ).trim();

    if (embarqueVolta) {

        const opcaoVolta =
            document.createElement("option");

        opcaoVolta.value = "volta";

        opcaoVolta.textContent =
            embarqueVolta;

        select.appendChild(opcaoVolta);
    }

    /*
    ------------------------------------------------------
    VERIFICAR SE EXISTEM EMBARQUES
    ------------------------------------------------------
    */

    if (select.options.length === 1) {

        opcaoInicial.textContent =
            "Nenhum embarque cadastrado";

        mostrarMensagemHorarios(
            "Esta linha não possui embarques cadastrados."
        );
    }
}


/*
==========================================================
MOSTRAR MENSAGEM
==========================================================
*/

function mostrarMensagemHorarios(texto) {

    const elemento =
        document.getElementById("mensagemHorarios");

    if (elemento) {

        elemento.textContent = texto;
    }
}
