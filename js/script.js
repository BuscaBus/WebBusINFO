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


            if (
                menu.contains(
                    event.target
                )
            ) {

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
    FOCO
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