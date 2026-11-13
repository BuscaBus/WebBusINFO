
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


/*
==========================================================
PARTE 4 - CADASTRO DE HORÁRIOS
==========================================================
*/

let horariosCadastrados = [];
let proximoIdHorario = 1;


/*
==========================================================
CONFIGURAR EVENTOS
==========================================================
*/

function configurarEventosHorarios() {

    const btnAdicionar =
        document.getElementById("btnAdicionarHorario");

    const btnLista =
        document.getElementById("btnListaHorarios");

    const btnFechar =
        document.getElementById("btnFecharLista");

    const btnCancelar =
        document.getElementById("btnCancelarLista");

    const btnSalvarLista =
        document.getElementById("btnSalvarLista");

    const modal =
        document.getElementById("modalListaHorarios");

    if (btnAdicionar) {
        btnAdicionar.addEventListener(
            "click",
            adicionarHorarioIndividual
        );
    }

    if (btnLista) {
        btnLista.addEventListener(
            "click",
            abrirModalLista
        );
    }

    if (btnFechar) {
        btnFechar.addEventListener(
            "click",
            fecharModalLista
        );
    }

    if (btnCancelar) {
        btnCancelar.addEventListener(
            "click",
            fecharModalLista
        );
    }

    if (btnSalvarLista) {
        btnSalvarLista.addEventListener(
            "click",
            adicionarListaHorarios
        );
    }

    if (modal) {
        modal.addEventListener("click", function (event) {

            if (event.target === modal) {
                fecharModalLista();
            }

        });
    }

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            fecharModalLista();
        }

    });
}


/*
==========================================================
VALIDAR HORÁRIO
==========================================================
*/

function horarioValido(horario) {

    return /^([01]\d|2[0-3]):[0-5]\d$/.test(horario);

}


/*
==========================================================
ADICIONAR HORÁRIO INDIVIDUAL
==========================================================
*/

function adicionarHorarioIndividual() {

    const viagem =
        document.getElementById("viagem").value;

    const campoHorario =
        document.getElementById("horario");

    const horario =
        campoHorario.value.trim();

    if (!viagem) {
        alert("Selecione uma viagem.");
        return;
    }

    if (!horarioValido(horario)) {
        alert("Informe um horário válido.");
        return;
    }

    if (horarioJaExiste(horario, viagem)) {
        alert("Este horário já está cadastrado nesta viagem.");
        return;
    }

    horariosCadastrados.push({
        id: proximoIdHorario++,
        id_linha: idLinhaHorarios,
        horario: horario,
        viagem: viagem
    });

    ordenarHorarios();
    exibirHorarios();

    campoHorario.value = "";
    campoHorario.focus();

    mostrarMensagemHorarios(
        "Horário adicionado à lista temporária."
    );
}


/*
==========================================================
VERIFICAR HORÁRIO DUPLICADO
==========================================================
*/

function horarioJaExiste(horario, viagem) {

    return horariosCadastrados.some(function (item) {

        return (
            item.horario === horario &&
            item.viagem === viagem
        );

    });
}


/*
==========================================================
ORDENAR HORÁRIOS
==========================================================
*/

function ordenarHorarios() {

    horariosCadastrados.sort(function (a, b) {

        return a.horario.localeCompare(b.horario);

    });
}


/*
==========================================================
ABRIR MODAL LISTA
==========================================================
*/

function abrirModalLista() {

    const viagem =
        document.getElementById("viagem").value;

    if (!viagem) {
        alert("Selecione uma viagem antes de inserir a lista.");
        return;
    }

    const modal =
        document.getElementById("modalListaHorarios");

    const campo =
        document.getElementById("listaHorariosTexto");

    campo.value = "";

    modal.classList.add("ativo");

    campo.focus();
}


/*
==========================================================
FECHAR MODAL LISTA
==========================================================
*/

function fecharModalLista() {

    const modal =
        document.getElementById("modalListaHorarios");

    if (modal) {
        modal.classList.remove("ativo");
    }
}


/*
==========================================================
ADICIONAR LISTA DE HORÁRIOS
==========================================================
*/

function adicionarListaHorarios() {

    const viagem =
        document.getElementById("viagem").value;

    const campo =
        document.getElementById("listaHorariosTexto");

    const texto =
        campo.value.trim();

    if (!viagem) {
        alert("Selecione uma viagem.");
        return;
    }

    if (!texto) {
        alert("Informe a lista de horários.");
        return;
    }

    /*
    ------------------------------------------------------
    SEPARAR HORÁRIOS
    ------------------------------------------------------
    */

    const horarios =
        texto.split(/[\s,;]+/)
            .map(item => item.trim())
            .filter(item => item !== "");

    /*
    ------------------------------------------------------
    VALIDAR TODOS OS HORÁRIOS
    ------------------------------------------------------
    */

    const invalidos =
        horarios.filter(
            horario => !horarioValido(horario)
        );

    if (invalidos.length > 0) {

        alert(
            "Existem horários inválidos:\n\n" +
            invalidos.join(", ")
        );

        return;
    }

    /*
    ------------------------------------------------------
    ADICIONAR SEM DUPLICAR
    ------------------------------------------------------
    */

    let adicionados = 0;

    horarios.forEach(function (horario) {

        if (!horarioJaExiste(horario, viagem)) {

            horariosCadastrados.push({
                id: proximoIdHorario++,
                id_linha: idLinhaHorarios,
                horario: horario,
                viagem: viagem
            });

            adicionados++;
        }

    });

    ordenarHorarios();
    exibirHorarios();
    fecharModalLista();

    mostrarMensagemHorarios(
        adicionados +
        " horário(s) adicionado(s) à lista temporária."
    );
}


/*
==========================================================
IDENTIFICAR NOME DA VIAGEM
==========================================================
*/

function obterNomeViagem(viagem) {

    if (!linhaSelecionada) {
        return viagem;
    }

    if (viagem === "ida") {

        return String(
            linhaSelecionada.embarque_ida ?? ""
        ).trim();

    }

    if (viagem === "volta") {

        return String(
            linhaSelecionada.embarque_volta ?? ""
        ).trim();

    }

    return viagem;
}


/*
==========================================================
EXIBIR HORÁRIOS
==========================================================
*/

function exibirHorarios() {

    const tbody =
        document.getElementById("listaHorarios");

    if (!tbody) {
        return;
    }

    tbody.innerHTML = "";

    if (horariosCadastrados.length === 0) {

        const tr = document.createElement("tr");
        const td = document.createElement("td");

        td.colSpan = 3;
        td.textContent = "Nenhum horário cadastrado.";

        tr.appendChild(td);
        tbody.appendChild(tr);

        return;
    }

    horariosCadastrados.forEach(function (item) {

        const tr = document.createElement("tr");

        const tdHorario = document.createElement("td");
        tdHorario.textContent = item.horario;

        const tdViagem = document.createElement("td");
        tdViagem.textContent = obterNomeViagem(item.viagem);

        const tdAcoes = document.createElement("td");

        const btnEditar = document.createElement("button");
        btnEditar.type = "button";
        btnEditar.className = "btn-editar-horario";
        btnEditar.textContent = "Editar";

        btnEditar.addEventListener("click", function () {
            editarHorario(item.id);
        });

        const btnExcluir = document.createElement("button");
        btnExcluir.type = "button";
        btnExcluir.className = "btn-excluir-horario";
        btnExcluir.textContent = "Excluir";

        btnExcluir.addEventListener("click", function () {
            excluirHorario(item.id);
        });

        tdAcoes.appendChild(btnEditar);
        tdAcoes.appendChild(btnExcluir);

        tr.appendChild(tdHorario);
        tr.appendChild(tdViagem);
        tr.appendChild(tdAcoes);

        tbody.appendChild(tr);
    });
}


/*
==========================================================
EDITAR HORÁRIO
==========================================================
*/

function editarHorario(id) {

    const registro =
        horariosCadastrados.find(item => item.id === id);

    if (!registro) {
        return;
    }

    const novoHorario = prompt(
        "Informe o novo horário:",
        registro.horario
    );

    if (novoHorario === null) {
        return;
    }

    const horario = novoHorario.trim();

    if (!horarioValido(horario)) {
        alert("Horário inválido. Use HH:MM.");
        return;
    }

    const duplicado = horariosCadastrados.some(item =>
        item.id !== id &&
        item.horario === horario &&
        item.viagem === registro.viagem
    );

    if (duplicado) {
        alert("Este horário já existe nesta viagem.");
        return;
    }

    registro.horario = horario;

    ordenarHorarios();
    exibirHorarios();
}


/*
==========================================================
EXCLUIR HORÁRIO
==========================================================
*/

function excluirHorario(id) {

    if (!confirm("Deseja excluir este horário?")) {
        return;
    }

    horariosCadastrados =
        horariosCadastrados.filter(item => item.id !== id);

    exibirHorarios();
}


/*
==========================================================
INICIALIZAR EVENTOS DA PARTE 4
==========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    configurarEventosHorarios
);
