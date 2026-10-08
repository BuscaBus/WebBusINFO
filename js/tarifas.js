/*
==========================================================
CONFIGURAÇÃO
==========================================================
*/

const API_URL =
    "https://script.google.com/macros/s/AKfycby4yCUL5jcSiE1UVBUIg1JPeoZmjE57h6rTXn14FYwIzOW3blMCNM4eIZJCgFdz0M17/exec";


let todasTarifas = [];

let idTarifaExcluir = null;


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
                "pesquisaTarifa"
            );


        if (pesquisa) {

            pesquisa.addEventListener(
                "input",
                filtrarTarifas
            );
        }


        /*
        --------------------------------------------------
        BOTÃO NOVA TARIFA
        --------------------------------------------------
        */

        const btnNovaTarifa =
            document.getElementById(
                "btnNovaTarifa"
            );


        if (btnNovaTarifa) {

            btnNovaTarifa.addEventListener(
                "click",
                abrirNovaTarifa
            );
        }


        /*
        --------------------------------------------------
        CARREGAR MODAIS
        --------------------------------------------------
        */

        await carregarModalTarifa();

        configurarEventosModalTarifa();


        await carregarModalExclusao();

        configurarEventosModalExclusao();


        /*
        --------------------------------------------------
        CARREGAR TARIFAS
        --------------------------------------------------
        */

        await carregarTarifas();

    }
);


/*
==========================================================
CARREGAR MODAL TARIFA
==========================================================
*/

async function carregarModalTarifa() {

    const container =
        document.getElementById(
            "containerModalTarifa"
        );


    if (!container) {

        return;
    }


    try {

        const resposta =
            await fetch(
                "./modals/tarifa.html?v=1"
            );


        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar o modal de tarifa."
            );
        }


        container.innerHTML =
            await resposta.text();


    } catch (erro) {

        console.error(
            "Erro ao carregar modal de tarifa:",
            erro
        );
    }
}


/*
==========================================================
CONFIGURAR EVENTOS DO MODAL TARIFA
==========================================================
*/

function configurarEventosModalTarifa() {

    const form =
        document.getElementById(
            "formTarifa"
        );

    const btnFechar =
        document.getElementById(
            "btnFecharModalTarifa"
        );

    const btnCancelar =
        document.getElementById(
            "btnCancelarTarifa"
        );

    const modal =
        document.getElementById(
            "modalTarifa"
        );


    if (form) {

        form.addEventListener(
            "submit",
            salvarTarifa
        );
    }


    if (btnFechar) {

        btnFechar.addEventListener(
            "click",
            fecharModalTarifa
        );
    }


    if (btnCancelar) {

        btnCancelar.addEventListener(
            "click",
            fecharModalTarifa
        );
    }


    /*
    Fechar clicando fora do conteúdo
    */

    if (modal) {

        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === modal
                ) {

                    fecharModalTarifa();
                }
            }
        );
    }
}


/*
==========================================================
ABRIR NOVA TARIFA
==========================================================
*/

function abrirNovaTarifa() {

    const modal =
        document.getElementById(
            "modalTarifa"
        );

    const form =
        document.getElementById(
            "formTarifa"
        );

    const titulo =
        document.getElementById(
            "tituloModalTarifa"
        );

    const idTarifa =
        document.getElementById(
            "id_tarifa"
        );


    if (!modal || !form) {

        return;
    }


    form.reset();


    if (idTarifa) {

        idTarifa.value = "";
    }


    if (titulo) {

        titulo.textContent =
            "Nova Tarifa";
    }


    /*
    Data atual como padrão
    */

    const atualizacao =
        document.getElementById(
            "atualizacao"
        );


    if (atualizacao) {

        atualizacao.value =
            obterDataAtual();
    }


    modal.classList.add(
        "ativo"
    );


    const tipo =
        document.getElementById(
            "tipo"
        );


    if (tipo) {

        tipo.focus();
    }
}


/*
==========================================================
FECHAR MODAL TARIFA
==========================================================
*/

function fecharModalTarifa() {

    const modal =
        document.getElementById(
            "modalTarifa"
        );


    if (modal) {

        modal.classList.remove(
            "ativo"
        );
    }
}


/*
==========================================================
SALVAR TARIFA
==========================================================
*/

async function salvarTarifa(event) {

    event.preventDefault();


    const idTarifa =
        document.getElementById(
            "id_tarifa"
        ).value.trim();


    const tipo =
        document.getElementById(
            "tipo"
        ).value.trim();


    const tarifaCartao =
        document.getElementById(
            "tarifa_cartao"
        ).value;


    const tarifaDinheiro =
        document.getElementById(
            "tarifa_dinheiro"
        ).value;


    const atualizacao =
        document.getElementById(
            "atualizacao"
        ).value;


    if (!tipo) {

        mostrarMensagem(
            "Informe o tipo da tarifa.",
            "erro"
        );

        return;
    }


    /*
    ------------------------------------------------------
    MONTAR DADOS
    ------------------------------------------------------
    */

    const dados = {

        acao:
            idTarifa
                ? "editar_tarifa"
                : "cadastrar_tarifa",

        tipo: tipo,

        tarifa_cartao:
            tarifaCartao === ""
                ? ""
                : Number(tarifaCartao),

        tarifa_dinheiro:
            tarifaDinheiro === ""
                ? ""
                : Number(tarifaDinheiro),

        atualizacao:
            atualizacao

    };


    if (idTarifa) {

        dados.id_tarifa =
            idTarifa;
    }


    try {

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
                "Erro na comunicação com o servidor."
            );
        }


        const resultado =
            await resposta.json();


        if (!resultado.sucesso) {

            throw new Error(
                resultado.mensagem ||
                "Não foi possível salvar a tarifa."
            );
        }


        fecharModalTarifa();


        mostrarMensagem(
            resultado.mensagem ||
            "Tarifa salva com sucesso.",
            "sucesso"
        );


        await carregarTarifas();


    } catch (erro) {

        console.error(
            "Erro ao salvar tarifa:",
            erro
        );


        mostrarMensagem(
            erro.message,
            "erro"
        );
    }
}


/*
==========================================================
CARREGAR TARIFAS
==========================================================
*/

async function carregarTarifas() {

    const lista =
        document.getElementById(
            "listaTarifas"
        );


    if (!lista) {

        return;
    }


    lista.innerHTML = `
        <tr>
            <td colspan="5">
                Carregando dados...
            </td>
        </tr>
    `;


    try {

       const resposta =
        await fetch(
            `${API_URL}?acao=listar_tarifas&_=${Date.now()}`,
            {
                cache: "no-store"
            }
        );

        if (!resposta.ok) {

            throw new Error(
                "Erro ao carregar tarifas."
            );
        }


        const resultado =
            await resposta.json();


        if (!resultado.sucesso) {

            throw new Error(
                resultado.mensagem ||
                "Não foi possível carregar as tarifas."
            );
        }

            /*
            ==========================================================
            DIAGNÓSTICO DOS DADOS RECEBIDOS
            ==========================================================
            */

            console.log(
                "RESPOSTA TARIFAS:",
                resultado
            );

            console.log(
                "PRIMEIRA TARIFA:",
                resultado.dados?.[0]
            );

            console.log(
                "COLUNAS RECEBIDAS:",
                Object.keys(resultado.dados?.[0] || {})
            );

            console.table(
                (resultado.dados || []).slice(0, 5)
            );

        todasTarifas = (resultado.dados || []).map(item => {

            const registro = {};

            Object.keys(item).forEach(chave => {

                const chaveCorrigida = chave.trim();

                registro[chaveCorrigida] = item[chave];

            });

            return registro;

        });

                const primeiraTarifa = todasTarifas[0];

        console.log(
            "CHAVES COM CÓDIGOS:",
            Object.keys(primeiraTarifa || {}).map(chave => ({
                nome: JSON.stringify(chave),
                codigos: Array.from(chave).map(c => c.codePointAt(0)),
                valor: primeiraTarifa[chave]
            }))
        );

                const primeiraTarifa = todasTarifas[0];

        Object.keys(primeiraTarifa || {}).forEach(chave => {

            console.log(
                "CHAVE:",
                JSON.stringify(chave),
                "CÓDIGOS:",
                Array.from(chave).map(
                    caractere => caractere.codePointAt(0)
                ),
                "VALOR:",
                primeiraTarifa[chave]
            );

        });

                console.log(
            "COLUNAS NORMALIZADAS:",
            Object.keys(todasTarifas[0] || {})
        );

        console.log(
            "DATA NORMALIZADA:",
            todasTarifas[0]?.atualizacao
        );

        console.log(
            "DATA EM TODAS TARIFAS:",
            todasTarifas[0]?.atualizacao
        );

        console.log(
            "OBJETO COMPLETO:",
            JSON.stringify(todasTarifas[0], null, 2)
        );
                    
        /*
        Ordenar pelo ID
        */

        todasTarifas.sort(
            (a, b) =>
                Number(a.id_tarifa) -
                Number(b.id_tarifa)
        );


        renderizarTarifas(
            todasTarifas
        );


    } catch (erro) {

        console.error(
            "Erro ao carregar tarifas:",
            erro
        );


        lista.innerHTML = `
            <tr>
                <td colspan="5">
                    Erro ao carregar tarifas.
                </td>
            </tr>
        `;


        mostrarMensagem(
            erro.message,
            "erro"
        );
    }
}


/*
==========================================================
RENDERIZAR TARIFAS
==========================================================
*/

function renderizarTarifas(tarifas) {

    const lista =
        document.getElementById(
            "listaTarifas"
        );


    if (!lista) {

        return;
    }


    lista.innerHTML = "";


    if (!tarifas.length) {

        lista.innerHTML = `
            <tr>
                <td colspan="5">
                    Nenhuma tarifa encontrada.
                </td>
            </tr>
        `;

        return;
    }


    tarifas.forEach(
        tarifa => {

            const tr =
                document.createElement(
                    "tr"
                );


            tr.innerHTML = `

                <td>
                    ${escaparHTML(
                        tarifa.tipo
                    )}
                </td>

                <td>
                    ${formatarMoeda(
                        tarifa.tarifa_cartao
                    )}
                </td>

                <td>
                    ${formatarMoeda(
                        tarifa.tarifa_dinheiro
                    )}
                </td>

               <td>
                    ${escaparHTML(
                        formatarData(
                            tarifa.atualizacao
                        )
                    )}
                </td>

                <td class="acoes">

                    <button
                        type="button"
                        class="btn-editar"
                        onclick="editarTarifa('${escaparJS(
                            tarifa.id_tarifa
                        )}')"
                    >
                        EDITAR
                    </button>

                    <button
                        type="button"
                        class="btn-excluir"
                        onclick="confirmarExclusaoTarifa('${escaparJS(
                            tarifa.id_tarifa
                        )}')"
                    >
                        EXCLUIR
                    </button>

                </td>

            `;


            lista.appendChild(
                tr
            );

            console.log(
                "TESTE DATA:",
                tarifa.tipo,
                "ORIGINAL:",
                tarifa.atualizacao,
                "FORMATADA:",
                formatarData(tarifa.atualizacao)
            );
        }
    );

}


/*
==========================================================
FILTRAR TARIFAS
==========================================================
*/

function filtrarTarifas() {

    const pesquisa =
        document.getElementById(
            "pesquisaTarifa"
        );


    if (!pesquisa) {

        return;
    }


    const termo =
        normalizarTexto(
            pesquisa.value
        );


    if (!termo) {

        renderizarTarifas(
            todasTarifas
        );

        return;
    }


    const filtradas =
        todasTarifas.filter(
            tarifa => {

                const texto =
                    normalizarTexto(
                        [
                            tarifa.tipo,
                            tarifa.tarifa_cartao,
                            tarifa.tarifa_dinheiro,
                            formatarData(
                                tarifa.atualizacao
                            )
                        ].join(" ")
                    );


                return texto.includes(
                    termo
                );
            }
        );


    renderizarTarifas(
        filtradas
    );
}


/*
==========================================================
EDITAR TARIFA
==========================================================
*/

async function editarTarifa(idTarifa) {

    try {

        const resposta =
            await fetch(
                `${API_URL}?acao=buscar_tarifa&id_tarifa=${encodeURIComponent(
                    idTarifa
                )}`
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao buscar tarifa."
            );
        }


        const resultado =
            await resposta.json();

        console.log(
            "RESPOSTA TARIFAS:",
            resultado
        );

        
        if (!resultado.sucesso) {

            throw new Error(
                resultado.mensagem ||
                "Tarifa não encontrada."
            );
        }


        const tarifa =
            resultado.dados;


        document.getElementById(
            "id_tarifa"
        ).value =
            tarifa.id_tarifa ?? "";


        document.getElementById(
            "tipo"
        ).value =
            tarifa.tipo ?? "";


        document.getElementById(
            "tarifa_cartao"
        ).value =
            valorParaInput(
                tarifa.tarifa_cartao
            );


        document.getElementById(
            "tarifa_dinheiro"
        ).value =
            valorParaInput(
                tarifa.tarifa_dinheiro
            );


        document.getElementById(
            "atualizacao"
        ).value =
            dataParaInput(
                tarifa.atualizacao
            );


        const titulo =
            document.getElementById(
                "tituloModalTarifa"
            );


        if (titulo) {

            titulo.textContent =
                "Editar Tarifa";
        }


        const modal =
            document.getElementById(
                "modalTarifa"
            );


        if (modal) {

            modal.classList.add(
                "ativo"
            );
        }


    } catch (erro) {

        console.error(
            "Erro ao editar tarifa:",
            erro
        );


        mostrarMensagem(
            erro.message,
            "erro"
        );
    }
}


/*
==========================================================
CARREGAR MODAL DE EXCLUSÃO
==========================================================
*/

async function carregarModalExclusao() {

    const container =
        document.getElementById(
            "containerModalExclusao"
        );


    if (!container) {

        return;
    }


    try {

        const resposta =
            await fetch(
                "./modals/exclusao.html?v=1"
            );


        if (!resposta.ok) {

            throw new Error(
                "Não foi possível carregar o modal de exclusão."
            );
        }


        container.innerHTML =
            await resposta.text();


    } catch (erro) {

        console.error(
            "Erro ao carregar modal de exclusão:",
            erro
        );
    }
}


/*
==========================================================
CONFIGURAR MODAL DE EXCLUSÃO
==========================================================
*/

function configurarEventosModalExclusao() {

    const btnCancelar =
        document.getElementById(
            "btnCancelarExclusao"
        );

    const btnConfirmar =
        document.getElementById(
            "btnConfirmarExclusao"
        );

    const btnFechar =
        document.getElementById(
            "btnFecharExclusao"
        );

    const modal =
        document.getElementById(
            "modalExclusao"
        );


    if (btnCancelar) {

        btnCancelar.addEventListener(
            "click",
            fecharModalExclusao
        );
    }


    if (btnFechar) {

        btnFechar.addEventListener(
            "click",
            fecharModalExclusao
        );
    }


    if (btnConfirmar) {

        btnConfirmar.addEventListener(
            "click",
            excluirTarifa
        );
    }


    /*
    Fechar clicando fora do modal
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
CONFIRMAR EXCLUSÃO DE TARIFA
==========================================================
*/

function confirmarExclusaoTarifa(
    idTarifa
) {

    idTarifaExcluir =
        idTarifa;


    const modal =
        document.getElementById(
            "modalExclusao"
        );


    if (!modal) {

        const confirmar =
            window.confirm(
                "Deseja realmente excluir esta tarifa?"
            );


        if (confirmar) {

            excluirTarifa();
        }


        return;
    }


    /*
    Alterar texto principal
    */

    const paragrafo =
        modal.querySelector(
            ".modal-exclusao-corpo p"
        );


    if (paragrafo) {

        paragrafo.textContent =
            "Deseja realmente excluir esta tarifa?";
    }


    /*
    Encontrar a tarifa
    */

    const tarifa =
        todasTarifas.find(
            item =>
                String(item.id_tarifa) ===
                String(idTarifa)
        );


    /*
    Mostrar descrição
    */

    const descricao =
        document.getElementById(
            "descricaoExclusao"
        );


    if (descricao) {

        if (tarifa) {

            descricao.textContent =
                tarifa.tipo || "";

        } else {

            descricao.textContent =
                "";
        }
    }


    /*
    Abrir modal
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


    idTarifaExcluir = null;
}


/*
==========================================================
EXCLUIR TARIFA
==========================================================
*/

async function excluirTarifa() {

    if (!idTarifaExcluir) {

        return;
    }


    const id =
        idTarifaExcluir;


    try {

        const resposta =
            await fetch(
                API_URL,
                {

                    method: "POST",

                    body:
                        JSON.stringify({

                            acao:
                                "excluir_tarifa",

                            id_tarifa:
                                id

                        })

                }
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro na comunicação com o servidor."
            );
        }


        const resultado =
            await resposta.json();

        

    
        if (!resultado.sucesso) {

            throw new Error(
                resultado.mensagem ||
                "Não foi possível excluir a tarifa."
            );
        }


        fecharModalExclusao();


        mostrarMensagem(
            resultado.mensagem ||
            "Tarifa excluída com sucesso.",
            "sucesso"
        );


        await carregarTarifas();


    } catch (erro) {

        console.error(
            "Erro ao excluir tarifa:",
            erro
        );


        mostrarMensagem(
            erro.message,
            "erro"
        );
    }
}


/*
==========================================================
FORMATAR MOEDA
==========================================================
*/

function formatarMoeda(valor) {

    if (
        valor === "" ||
        valor === null ||
        valor === undefined
    ) {

        return "";
    }


    const numero =
        Number(valor);


    if (Number.isNaN(numero)) {

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
VALOR PARA INPUT
==========================================================
*/

function valorParaInput(valor) {

    if (
        valor === "" ||
        valor === null ||
        valor === undefined
    ) {

        return "";
    }


    const numero =
        Number(valor);


    if (Number.isNaN(numero)) {

        return "";
    }


    return numero;
}


    /*
    ==========================================================
    FORMATAR DATA PARA EXIBIÇÃO
    ==========================================================
    */

    function formatarData(valor) {

        if (valor === null || valor === undefined || valor === "") {
            return "";
        }

        const texto = String(valor).trim();

        // Data brasileira: DD/MM/YYYY
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(texto)) {
            return texto;
        }

        // Data simples: YYYY-MM-DD
        const simples = texto.match(/^(\d{4})-(\d{2})-(\d{2})$/);

        if (simples) {
            return `${simples[3]}/${simples[2]}/${simples[1]}`;
        }

        // Data ISO com horário
        const data = new Date(texto);

        if (!Number.isNaN(data.getTime())) {
            const dia = String(data.getUTCDate()).padStart(2, "0");
            const mes = String(data.getUTCMonth() + 1).padStart(2, "0");
            const ano = data.getUTCFullYear();

            return `${dia}/${mes}/${ano}`;
        }

        return texto;
    }

/*
==========================================================
DATA PARA INPUT TYPE="DATE"
==========================================================
*/

function dataParaInput(valor) {

    if (!valor) {
        return "";
    }

    const texto = String(valor).trim();

    // Já está em YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(texto)) {
        return texto;
    }

    // Converter DD/MM/YYYY para YYYY-MM-DD
    const brasileira = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

    if (brasileira) {
        return `${brasileira[3]}-${brasileira[2]}-${brasileira[1]}`;
    }

    // Data ISO
    const data = new Date(texto);

    if (Number.isNaN(data.getTime())) {
        return "";
    }

    const ano = data.getUTCFullYear();
    const mes = String(data.getUTCMonth() + 1).padStart(2, "0");
    const dia = String(data.getUTCDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}


/*
==========================================================
DATA ATUAL
==========================================================
*/

function obterDataAtual() {

    const data =
        new Date();


    const ano =
        data.getFullYear();


    const mes =
        String(
            data.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const dia =
        String(
            data.getDate()
        ).padStart(
            2,
            "0"
        );


    return (
        ano +
        "-" +
        mes +
        "-" +
        dia
    );
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
        .toLowerCase()
        .trim();
}


/*
==========================================================
ESCAPAR HTML
==========================================================
*/

function escaparHTML(valor) {

    return String(
        valor ?? ""
    )
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
ESCAPAR JAVASCRIPT
==========================================================
*/

function escaparJS(valor) {

    return String(
        valor ?? ""
    )
        .replaceAll(
            "\\",
            "\\\\"
        )
        .replaceAll(
            "'",
            "\\'"
        )
        .replaceAll(
            "\r",
            ""
        )
        .replaceAll(
            "\n",
            "\\n"
        );
}


/*
==========================================================
MENSAGEM
==========================================================
*/

function mostrarMensagem(
    texto,
    tipo = ""
) {

    const mensagem =
        document.getElementById(
            "mensagem"
        );


    if (!mensagem) {

        return;
    }


    mensagem.textContent =
        texto;


    mensagem.className =
        "mensagem";


    if (tipo) {

        mensagem.classList.add(
            tipo
        );
    }


    /*
    Limpar automaticamente
    */

    window.clearTimeout(
        mostrarMensagem.timer
    );


    mostrarMensagem.timer =
        window.setTimeout(
            function () {

                mensagem.textContent =
                    "";

                mensagem.className =
                    "mensagem";

            },
            5000
        );
}