
/*
==========================================================
API
==========================================================
*/

const API_URL =
    "https://script.google.com/macros/s/AKfycby4yCUL5jcSiE1UVBUIg1JPeoZmjE57h6rTXn14FYwIzOW3blMCNM4eIZJCgFdz0M17/exec";


/*
==========================================================
VARIÁVEIS
==========================================================
*/

let todosTerminais = [];
let idTerminalParaExcluir = null;

// ==========================================
// PAGINAÇÃO
// ==========================================

let terminaisFiltrados = [];
let paginaAtualTerminal = 1;

const itensPorPaginaTerminal = 15;

/*
==========================================================
INICIALIZAÇÃO
==========================================================
*/

document.addEventListener("DOMContentLoaded", async function () {

    const pesquisa = document.getElementById("pesquisaTerminal");

    if (pesquisa) {
        pesquisa.addEventListener("input", pesquisarTerminais);
    }

    const btnNovoTerminal = document.getElementById("btnNovoTerminal");

    if (btnNovoTerminal) {
        btnNovoTerminal.addEventListener("click", abrirNovoTerminal);
    }

    try {

        await carregarModalTerminal();
        configurarEventosModalTerminal();

        await carregarModalExclusao();
        configurarEventosModalExclusao();

    } catch (erro) {

        console.error("Erro ao carregar modais:", erro);
        mostrarMensagem(erro.message, true);

    }

    await carregarTerminais();

    document.getElementById("btnAnteriorTerminal")
    ?.addEventListener("click", function () {
        mudarPaginaTerminal(-1);
    });

    document.getElementById("btnProximaTerminal")
    ?.addEventListener("click", function () {
        mudarPaginaTerminal(1);
    });

});


/*
==========================================================
CARREGAR MODAL TERMINAL
==========================================================
*/

async function carregarModalTerminal() {

    const container =
        document.getElementById("containerModalTerminal");

    if (!container) {
        throw new Error("Container do modal Terminal não encontrado.");
    }

    const resposta = await fetch("./modals/terminal.html");

    if (!resposta.ok) {
        throw new Error("Não foi possível carregar o formulário de terminal.");
    }

    container.innerHTML = await resposta.text();
}


/*
==========================================================
CARREGAR MODAL EXCLUSÃO
==========================================================
*/

async function carregarModalExclusao() {

    const container =
        document.getElementById("containerModalExclusao");

    if (!container) {
        throw new Error("Container do modal de exclusão não encontrado.");
    }

    const resposta = await fetch("./modals/exclusao.html");

    if (!resposta.ok) {
        throw new Error("Não foi possível carregar o modal de exclusão.");
    }

    container.innerHTML = await resposta.text();
}


/*
==========================================================
EVENTOS DO MODAL TERMINAL
==========================================================
*/

function configurarEventosModalTerminal() {

    const modal = document.getElementById("modalTerminal");
    const form = document.getElementById("formTerminal");

    const btnFechar =
        document.getElementById("btnFecharModalTerminal");

    const btnCancelar =
        document.getElementById("btnCancelarTerminal");

    if (form) {
        form.addEventListener("submit", salvarTerminal);
    }

    if (btnFechar) {
        btnFechar.addEventListener("click", fecharModalTerminal);
    }

    if (btnCancelar) {
        btnCancelar.addEventListener("click", fecharModalTerminal);
    }

    if (modal) {

        modal.addEventListener("click", function (event) {

            if (event.target === modal) {
                fecharModalTerminal();
            }

        });

    }
}


/*
==========================================================
EVENTOS DO MODAL EXCLUSÃO
==========================================================
*/

function configurarEventosModalExclusao() {

    const modal = document.getElementById("modalExclusao");

    const btnFechar =
        document.getElementById("btnFecharExclusao");

    const btnCancelar =
        document.getElementById("btnCancelarExclusao");

    const btnConfirmar =
        document.getElementById("btnConfirmarExclusao");

    if (btnFechar) {
        btnFechar.addEventListener("click", fecharModalExclusao);
    }

    if (btnCancelar) {
        btnCancelar.addEventListener("click", fecharModalExclusao);
    }

    if (btnConfirmar) {
        btnConfirmar.addEventListener(
            "click",
            confirmarExclusaoTerminal
        );
    }

    if (modal) {

        modal.addEventListener("click", function (event) {

            if (event.target === modal) {
                fecharModalExclusao();
            }

        });

    }
}


/*
==========================================================
CARREGAR TERMINAIS
==========================================================
*/

async function carregarTerminais() {

    const tbody = document.getElementById("listaTerminais");

    try {

        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="3">Carregando dados...</td>
                </tr>
            `;
        }

        const resposta = await fetch(
            `${API_URL}?acao=listar_terminais`
        );

        if (!resposta.ok) {
            throw new Error("Erro ao acessar a API.");
        }

        const resultado = await resposta.json();

        if (!resultado.sucesso) {
            throw new Error(
                resultado.mensagem ||
                "Erro ao carregar terminais."
            );
        }

        todosTerminais = resultado.dados || [];

        pesquisarTerminais();

    } catch (erro) {

        console.error(erro);

        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="3">
                        Erro ao carregar terminais.
                    </td>
                </tr>
            `;
        }

        mostrarMensagem(erro.message, true);

    }
}


/*
==========================================================
EXIBIR TERMINAIS
==========================================================
*/

function exibirTerminais(terminais) {

    const tbody = document.getElementById("listaTerminais");

    if (!tbody) {
        return;
    }

    tbody.innerHTML = "";

    if (!terminais.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="3">
                    Nenhum terminal encontrado.
                </td>
            </tr>
        `;

        return;
    }

    terminais.forEach(function (item) {

        const tr = document.createElement("tr");

        const tdTerminal = document.createElement("td");
        tdTerminal.textContent = item.terminal ?? "";

        const tdBox = document.createElement("td");
        tdBox.textContent = item.box ?? "";

        const tdAcoes = document.createElement("td");

        const btnEditar = document.createElement("button");
        btnEditar.type = "button";
        btnEditar.className = "btn-editar";
        btnEditar.textContent = "Editar";

        btnEditar.addEventListener("click", function () {
            editarTerminal(item.id_terminal);
        });

        const btnExcluir = document.createElement("button");
        btnExcluir.type = "button";
        btnExcluir.className = "btn-excluir";
        btnExcluir.textContent = "Excluir";

        btnExcluir.addEventListener("click", function () {
            excluirTerminal(item.id_terminal);
        });

        tdAcoes.appendChild(btnEditar);
        tdAcoes.appendChild(document.createTextNode(" "));
        tdAcoes.appendChild(btnExcluir);

        tr.appendChild(tdTerminal);
        tr.appendChild(tdBox);
        tr.appendChild(tdAcoes);

        tbody.appendChild(tr);

    });
}


/*
==========================================================
PESQUISAR TERMINAIS
==========================================================
*/

function normalizarTextoTerminal(valor) {

    return String(valor ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

function pesquisarTerminais() {

    const campo = document.getElementById("pesquisaTerminal");

    const termo = normalizarTextoTerminal(
        campo ? campo.value : ""
    );

    terminaisFiltrados = todosTerminais.filter(function (item) {

        return (
            normalizarTextoTerminal(item.terminal).includes(termo) ||
            normalizarTextoTerminal(item.box).includes(termo)
        );

    });

    paginaAtualTerminal = 1;

    atualizarPaginacaoTerminais();
}



/* ==========================================
   ATUALIZAR PAGINAÇÃO DOS TERMINAIS
========================================== */

function atualizarPaginacaoTerminais() {

    const totalPaginas = Math.max(
        1,
        Math.ceil(
            terminaisFiltrados.length / itensPorPaginaTerminal
        )
    );

    // Evita permanecer em uma página inexistente
    paginaAtualTerminal = Math.min(
        Math.max(1, paginaAtualTerminal),
        totalPaginas
    );

    const inicio =
        (paginaAtualTerminal - 1) * itensPorPaginaTerminal;

    const fim = inicio + itensPorPaginaTerminal;

    const registrosPagina = terminaisFiltrados.slice(
        inicio,
        fim
    );

    // Reutiliza a função existente de montar a tabela
    exibirTerminais(registrosPagina);

    const infoPagina =
        document.getElementById("infoPaginaTerminal");

    if (infoPagina) {
        infoPagina.textContent =
            `Página ${paginaAtualTerminal} de ${totalPaginas}`;
    }

    const btnAnterior =
        document.getElementById("btnAnteriorTerminal");

    const btnProxima =
        document.getElementById("btnProximaTerminal");

    if (btnAnterior) {
        btnAnterior.disabled = paginaAtualTerminal <= 1;
    }

    if (btnProxima) {
        btnProxima.disabled =
            paginaAtualTerminal >= totalPaginas;
    }
}


/* ==========================================
   MUDAR PÁGINA
========================================== */

function mudarPaginaTerminal(direcao) {

    const totalPaginas = Math.max(
        1,
        Math.ceil(
            terminaisFiltrados.length / itensPorPaginaTerminal
        )
    );

    const novaPagina = paginaAtualTerminal + direcao;

    if (novaPagina < 1 || novaPagina > totalPaginas) {
        return;
    }

    paginaAtualTerminal = novaPagina;

    atualizarPaginacaoTerminais();
}


/*
==========================================================
NOVO TERMINAL
==========================================================
*/

function abrirNovoTerminal() {

    const modal = document.getElementById("modalTerminal");
    const form = document.getElementById("formTerminal");

    if (!modal || !form) {
        mostrarMensagem(
            "Formulário de terminal não carregado.",
            true
        );
        return;
    }

    form.reset();

    document.getElementById("id_terminal").value = "";

    const titulo = document.getElementById("tituloModalTerminal");

    if (titulo) {
        titulo.textContent = "Novo Terminal";
    }

    modal.classList.add("ativo");

    document.getElementById("terminal").focus();
}


/*
==========================================================
EDITAR TERMINAL
==========================================================
*/

async function editarTerminal(idTerminal) {

    try {

        const resposta = await fetch(
            `${API_URL}?acao=buscar_terminal&id_terminal=${encodeURIComponent(idTerminal)}`
        );

        if (!resposta.ok) {
            throw new Error("Erro ao acessar a API.");
        }

        const resultado = await resposta.json();

        if (!resultado.sucesso) {
            throw new Error(
                resultado.mensagem ||
                "Terminal não encontrado."
            );
        }

        const dados = resultado.dados;

        const modal = document.getElementById("modalTerminal");

        if (!modal) {
            throw new Error("Formulário de terminal não carregado.");
        }

        document.getElementById("id_terminal").value =
            dados.id_terminal ?? "";

        document.getElementById("terminal").value =
            dados.terminal ?? "";

        document.getElementById("box").value =
            dados.box ?? "";

        const titulo = document.getElementById("tituloModalTerminal");

        if (titulo) {
            titulo.textContent = "Editar Terminal";
        }

        modal.classList.add("ativo");

    } catch (erro) {

        console.error(erro);
        mostrarMensagem(erro.message, true);

    }
}


/*
==========================================================
SALVAR TERMINAL
==========================================================
*/

async function salvarTerminal(event) {

    event.preventDefault();

    const idTerminal =
        document.getElementById("id_terminal").value.trim();

    const terminal =
        document.getElementById("terminal").value.trim();

    const box =
        document.getElementById("box").value.trim();

    if (!terminal) {
        mostrarMensagem("Informe o nome do terminal.", true);
        return;
    }

    if (!box) {
        mostrarMensagem("Informe o box.", true);
        return;
    }

    const btnSalvar =
        document.getElementById("btnSalvarTerminal");

    try {

        if (btnSalvar) {
            btnSalvar.disabled = true;
            btnSalvar.textContent = "SALVANDO...";
        }

        const dados = {

            acao: idTerminal
                ? "editar_terminal"
                : "cadastrar_terminal",

            terminal: terminal,
            box: box

        };

        if (idTerminal) {
            dados.id_terminal = Number(idTerminal);
        }

        const resposta = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },

            body: JSON.stringify(dados)

        });

        if (!resposta.ok) {
            throw new Error("Erro ao acessar a API.");
        }

        const resultado = await resposta.json();

        if (!resultado.sucesso) {
            throw new Error(
                resultado.mensagem ||
                "Não foi possível salvar o terminal."
            );
        }

        fecharModalTerminal();

        mostrarMensagem(
            resultado.mensagem ||
            "Terminal salvo com sucesso."
        );

        await carregarTerminais();

    } catch (erro) {

        console.error(erro);
        mostrarMensagem(erro.message, true);

    } finally {

        if (btnSalvar) {
            btnSalvar.disabled = false;
            btnSalvar.textContent = "SALVAR";
        }

    }
}


/*
==========================================================
FECHAR MODAL TERMINAL
==========================================================
*/

function fecharModalTerminal() {

    const modal = document.getElementById("modalTerminal");

    if (modal) {
        modal.classList.remove("ativo");
    }
}


/*
==========================================================
SOLICITAR EXCLUSÃO
==========================================================
*/

function excluirTerminal(idTerminal) {

    const registro = todosTerminais.find(function (item) {

        return String(item.id_terminal) === String(idTerminal);

    });

    if (!registro) {
        mostrarMensagem("Terminal não encontrado.", true);
        return;
    }

    const modal = document.getElementById("modalExclusao");

    if (!modal) {
        mostrarMensagem(
            "Modal de exclusão não carregado.",
            true
        );
        return;
    }

    idTerminalParaExcluir = idTerminal;

    const descricao =
        document.getElementById("descricaoExclusao");

    if (descricao) {

        descricao.textContent =
            `${registro.terminal} - ${registro.box}`;

    }

    modal.classList.add("ativo");
}


/*
==========================================================
CONFIRMAR EXCLUSÃO
==========================================================
*/

async function confirmarExclusaoTerminal() {

    if (idTerminalParaExcluir === null) {
        return;
    }

    const idTerminal = idTerminalParaExcluir;

    const btnConfirmar =
        document.getElementById("btnConfirmarExclusao");

    try {

        if (btnConfirmar) {
            btnConfirmar.disabled = true;
            btnConfirmar.textContent = "EXCLUINDO...";
        }

        const resposta = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },

            body: JSON.stringify({

                acao: "excluir_terminal",
                id_terminal: idTerminal

            })

        });

        if (!resposta.ok) {
            throw new Error("Erro ao acessar a API.");
        }

        const resultado = await resposta.json();

        if (!resultado.sucesso) {
            throw new Error(
                resultado.mensagem ||
                "Não foi possível excluir o terminal."
            );
        }

        fecharModalExclusao();

        mostrarMensagem(
            resultado.mensagem ||
            "Terminal excluído com sucesso."
        );

        await carregarTerminais();

    } catch (erro) {

        console.error(erro);
        mostrarMensagem(erro.message, true);

    } finally {

        if (btnConfirmar) {
            btnConfirmar.disabled = false;
            btnConfirmar.textContent = "EXCLUIR";
        }

    }
}


/*
==========================================================
FECHAR MODAL EXCLUSÃO
==========================================================
*/

function fecharModalExclusao() {

    const modal = document.getElementById("modalExclusao");

    if (modal) {
        modal.classList.remove("ativo");
    }

    idTerminalParaExcluir = null;
}


/*
==========================================================
MENSAGENS
==========================================================
*/

function mostrarMensagem(texto, erro = false) {

    const mensagem = document.getElementById("mensagem");

    if (!mensagem) {
        return;
    }

    mensagem.textContent = texto;

    mensagem.dataset.tipo =
        erro ? "erro" : "sucesso";

    setTimeout(function () {

        if (mensagem.textContent === texto) {
            mensagem.textContent = "";
        }

    }, 5000);
}
