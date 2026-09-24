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

let todasEmpresas = [];
let idEmpresaParaExcluir = null;


/*
==========================================================
INICIALIZAÇÃO
==========================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        /*
        ------------------------------------------------------
        PESQUISA
        ------------------------------------------------------
        */

        const pesquisa =
            document.getElementById(
                "pesquisaEmpresa"
            );

        if (pesquisa) {

            pesquisa.addEventListener(
                "input",
                pesquisarEmpresas
            );
        }


        /*
        ------------------------------------------------------
        NOVA EMPRESA
        ------------------------------------------------------
        */

        const btnNovaEmpresa =
            document.getElementById(
                "btnNovaEmpresa"
            );

        if (btnNovaEmpresa) {

            btnNovaEmpresa.addEventListener(
                "click",
                abrirNovaEmpresa
            );
        }


        /*
        ------------------------------------------------------
        CARREGAR MODAIS
        ------------------------------------------------------
        */

        try {

            await carregarModalEmpresa();

            configurarEventosModalEmpresa();


            await carregarModalExclusao();

            configurarEventosModalExclusao();

        } catch (erro) {

            console.error(
                "Erro ao carregar modais:",
                erro
            );
        }


        /*
        ------------------------------------------------------
        CARREGAR EMPRESAS
        ------------------------------------------------------
        */

        await carregarEmpresas();
    }
);


/*
==========================================================
CARREGAR MODAL EMPRESA
==========================================================
*/

async function carregarModalEmpresa() {

    const container =
        document.getElementById(
            "containerModalEmpresa"
        );

    if (!container) {
        return;
    }


    const resposta =
        await fetch(
            "./modals/empresa.html"
        );


    if (!resposta.ok) {

        throw new Error(
            "Não foi possível carregar o formulário de empresa."
        );
    }


    container.innerHTML =
        await resposta.text();
}


/*
==========================================================
CARREGAR MODAL EXCLUSÃO
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


    const resposta =
        await fetch(
            "./modals/exclusao.html"
        );


    if (!resposta.ok) {

        throw new Error(
            "Não foi possível carregar o modal de exclusão."
        );
    }


    container.innerHTML =
        await resposta.text();
}


/*
==========================================================
EVENTOS DO MODAL EMPRESA
==========================================================
*/

function configurarEventosModalEmpresa() {

    const modal =
        document.getElementById(
            "modalEmpresa"
        );

    const form =
        document.getElementById(
            "formEmpresa"
        );

    const btnFechar =
        document.getElementById(
            "btnFecharModalEmpresa"
        );

    const btnCancelar =
        document.getElementById(
            "btnCancelarEmpresa"
        );


    if (form) {

        form.addEventListener(
            "submit",
            salvarEmpresa
        );
    }


    if (btnFechar) {

        btnFechar.addEventListener(
            "click",
            fecharModalEmpresa
        );
    }


    if (btnCancelar) {

        btnCancelar.addEventListener(
            "click",
            fecharModalEmpresa
        );
    }


    if (modal) {

        modal.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === modal
                ) {

                    fecharModalEmpresa();
                }
            }
        );
    }
}


/*
==========================================================
EVENTOS DO MODAL DE EXCLUSÃO
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
            confirmarExclusaoEmpresa
        );
    }


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
CARREGAR EMPRESAS
==========================================================
*/

async function carregarEmpresas() {

    const tbody =
        document.getElementById(
            "listaEmpresas"
        );


    try {

        if (tbody) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="4">
                        Carregando dados...
                    </td>
                </tr>
            `;
        }


        const resposta =
            await fetch(
                `${API_URL}?acao=listar_empresas`
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao acessar a API."
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


        todasEmpresas =
            resultado.dados || [];


        exibirEmpresas(
            todasEmpresas
        );

    } catch (erro) {

        console.error(
            erro
        );


        if (tbody) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="4">
                        Erro ao carregar empresas.
                    </td>
                </tr>
            `;
        }


        mostrarMensagem(
            erro.message,
            true
        );
    }
}


/*
==========================================================
EXIBIR EMPRESAS
==========================================================
*/

function exibirEmpresas(empresas) {

    const tbody =
        document.getElementById(
            "listaEmpresas"
        );


    if (!tbody) {
        return;
    }


    tbody.innerHTML = "";


    if (!empresas.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="4">
                    Nenhuma empresa encontrada.
                </td>
            </tr>
        `;

        return;
    }


    empresas.forEach(
        function (item) {

            const tr =
                document.createElement(
                    "tr"
                );


            const id =
                Number(
                    item.id_empresa
                );


            /*
            --------------------------------------------------
            SITE
            --------------------------------------------------
            */

            const site =
                String(
                    item.site || ""
                ).trim();


            let siteHTML = "";


            if (site) {

                const url =
                    normalizarSite(
                        site
                    );


                siteHTML = `
                    <a
                        href="${escaparHTML(url)}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        ${escaparHTML(site)}
                    </a>
                `;

            } else {

                siteHTML = "-";
            }


            tr.innerHTML = `

                <td>
                    ${escaparHTML(item.empresa)}
                </td>

                <td>
                    ${escaparHTML(item.cidade)}
                </td>

                <td>
                    ${siteHTML}
                </td>

                <td>

                    <button
                        type="button"
                        class="btn-editar"
                        onclick="editarEmpresa(${id})"
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        class="btn-excluir"
                        onclick="excluirEmpresa(${id})"
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
PESQUISAR EMPRESAS
==========================================================
*/

function pesquisarEmpresas() {

    const campo =
        document.getElementById(
            "pesquisaEmpresa"
        );


    const termo =
        campo
            ? campo.value
                .trim()
                .toLowerCase()
            : "";


    if (!termo) {

        exibirEmpresas(
            todasEmpresas
        );

        return;
    }


    const filtradas =
        todasEmpresas.filter(
            function (item) {

                return [

                    item.empresa,
                    item.cidade,
                    item.site

                ].some(
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
            }
        );


    exibirEmpresas(
        filtradas
    );
}


/*
==========================================================
NOVA EMPRESA
==========================================================
*/

function abrirNovaEmpresa() {

    const modal =
        document.getElementById(
            "modalEmpresa"
        );

    const form =
        document.getElementById(
            "formEmpresa"
        );

    const titulo =
        document.getElementById(
            "tituloModalEmpresa"
        );

    const idEmpresa =
        document.getElementById(
            "id_empresa"
        );


    if (
        !modal ||
        !form
    ) {

        mostrarMensagem(
            "Formulário de empresa não carregado.",
            true
        );

        return;
    }


    form.reset();


    if (idEmpresa) {

        idEmpresa.value = "";
    }


    if (titulo) {

        titulo.textContent =
            "Nova Empresa";
    }


    modal.classList.add(
        "ativo"
    );


    const empresa =
        document.getElementById(
            "empresa"
        );


    if (empresa) {

        setTimeout(
            function () {

                empresa.focus();

            },
            50
        );
    }
}


/*
==========================================================
EDITAR EMPRESA
==========================================================
*/

async function editarEmpresa(
    idEmpresa
) {

    try {

        const resposta =
            await fetch(
                `${API_URL}?acao=buscar_empresa&id_empresa=${encodeURIComponent(idEmpresa)}`
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao acessar a API."
            );
        }


        const resultado =
            await resposta.json();


        if (!resultado.sucesso) {

            throw new Error(
                resultado.mensagem ||
                "Empresa não encontrada."
            );
        }


        const dados =
            resultado.dados;


        document.getElementById(
            "id_empresa"
        ).value =
            dados.id_empresa ?? "";


        document.getElementById(
            "empresa"
        ).value =
            dados.empresa ?? "";


        document.getElementById(
            "cidade"
        ).value =
            dados.cidade ?? "";


        document.getElementById(
            "site"
        ).value =
            dados.site ?? "";


        const titulo =
            document.getElementById(
                "tituloModalEmpresa"
            );


        if (titulo) {

            titulo.textContent =
                "Editar Empresa";
        }


        const modal =
            document.getElementById(
                "modalEmpresa"
            );


        if (modal) {

            modal.classList.add(
                "ativo"
            );
        }

    } catch (erro) {

        console.error(
            erro
        );


        mostrarMensagem(
            erro.message,
            true
        );
    }
}


/*
==========================================================
SALVAR EMPRESA
==========================================================
*/

async function salvarEmpresa(
    event
) {

    event.preventDefault();


    const idEmpresa =
        document.getElementById(
            "id_empresa"
        ).value.trim();


    const empresa =
        document.getElementById(
            "empresa"
        ).value.trim();


    const cidade =
        document.getElementById(
            "cidade"
        ).value.trim();


    const site =
        document.getElementById(
            "site"
        ).value.trim();


    if (!empresa) {

        mostrarMensagem(
            "Informe o nome da empresa.",
            true
        );

        return;
    }


    if (!cidade) {

        mostrarMensagem(
            "Informe a cidade.",
            true
        );

        return;
    }


    const btnSalvar =
        document.getElementById(
            "btnSalvarEmpresa"
        );


    try {

        if (btnSalvar) {

            btnSalvar.disabled =
                true;

            btnSalvar.textContent =
                "SALVANDO...";
        }


        /*
        ------------------------------------------------------
        CADASTRO OU EDIÇÃO
        ------------------------------------------------------
        */

        const dados = {

            acao:
                idEmpresa
                    ? "editar_empresa"
                    : "cadastrar_empresa",

            empresa:
                empresa,

            cidade:
                cidade,

            site:
                site
        };


        if (idEmpresa) {

            dados.id_empresa =
                Number(
                    idEmpresa
                );
        }


        const resposta =
            await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body:
                        JSON.stringify(
                            dados
                        )
                }
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao acessar a API."
            );
        }


        const resultado =
            await resposta.json();


        if (!resultado.sucesso) {

            throw new Error(
                resultado.mensagem ||
                "Não foi possível salvar a empresa."
            );
        }


        fecharModalEmpresa();


        mostrarMensagem(
            resultado.mensagem ||
            "Empresa salva com sucesso."
        );


        await carregarEmpresas();

    } catch (erro) {

        console.error(
            erro
        );


        mostrarMensagem(
            erro.message,
            true
        );

    } finally {

        if (btnSalvar) {

            btnSalvar.disabled =
                false;

            btnSalvar.textContent =
                "SALVAR";
        }
    }
}


/*
==========================================================
FECHAR MODAL EMPRESA
==========================================================
*/

function fecharModalEmpresa() {

    const modal =
        document.getElementById(
            "modalEmpresa"
        );


    if (modal) {

        modal.classList.remove(
            "ativo"
        );
    }
}


/*
==========================================================
SOLICITAR EXCLUSÃO
==========================================================
*/

function excluirEmpresa(
    idEmpresa
) {

    const registro =
        todasEmpresas.find(
            function (item) {

                return (
                    Number(
                        item.id_empresa
                    ) ===
                    Number(
                        idEmpresa
                    )
                );
            }
        );


    if (!registro) {

        mostrarMensagem(
            "Empresa não encontrada.",
            true
        );

        return;
    }


    idEmpresaParaExcluir =
        Number(
            idEmpresa
        );


    const descricao =
        document.getElementById(
            "descricaoExclusao"
        );


    if (descricao) {

        descricao.textContent =
            registro.empresa;
    }


    const modal =
        document.getElementById(
            "modalExclusao"
        );


    if (!modal) {

        mostrarMensagem(
            "Modal de exclusão não carregado.",
            true
        );

        return;
    }


    modal.classList.add(
        "ativo"
    );
}


/*
==========================================================
CONFIRMAR EXCLUSÃO
==========================================================
*/

async function confirmarExclusaoEmpresa() {

    if (
        idEmpresaParaExcluir === null
    ) {

        return;
    }


    const idEmpresa =
        idEmpresaParaExcluir;


    const btnConfirmar =
        document.getElementById(
            "btnConfirmarExclusao"
        );


    try {

        if (btnConfirmar) {

            btnConfirmar.disabled =
                true;

            btnConfirmar.textContent =
                "EXCLUINDO...";
        }


        const resposta =
            await fetch(
                API_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body:
                        JSON.stringify({
                            acao:
                                "excluir_empresa",

                            id_empresa:
                                idEmpresa
                        })
                }
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro ao acessar a API."
            );
        }


        const resultado =
            await resposta.json();


        if (!resultado.sucesso) {

            throw new Error(
                resultado.mensagem ||
                "Não foi possível excluir a empresa."
            );
        }


        fecharModalExclusao();


        mostrarMensagem(
            resultado.mensagem ||
            "Empresa excluída com sucesso."
        );


        await carregarEmpresas();

    } catch (erro) {

        console.error(
            erro
        );


        mostrarMensagem(
            erro.message,
            true
        );

    } finally {

        if (btnConfirmar) {

            btnConfirmar.disabled =
                false;

            btnConfirmar.textContent =
                "EXCLUIR";
        }
    }
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


    idEmpresaParaExcluir =
        null;
}


/*
==========================================================
NORMALIZAR SITE
==========================================================
*/

function normalizarSite(site) {

    const texto =
        String(
            site || ""
        ).trim();


    if (!texto) {

        return "";
    }


    if (
        /^https?:\/\//i.test(
            texto
        )
    ) {

        return texto;
    }


    return "https://" + texto;
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
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


/*
==========================================================
MENSAGENS
==========================================================
*/

function mostrarMensagem(
    texto,
    erro = false
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


    /*
    Pode ser usado depois para
    personalizar as cores.
    */

    mensagem.dataset.tipo =
        erro
            ? "erro"
            : "sucesso";


    /*
    ------------------------------------------------------
    LIMPAR AUTOMATICAMENTE
    ------------------------------------------------------
    */

    setTimeout(
        function () {

            if (
                mensagem.textContent ===
                texto
            ) {

                mensagem.textContent =
                    "";
            }

        },
        5000
    );
}