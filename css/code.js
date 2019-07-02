let estado = { valor: 0 }
let estadoCentral = {valor: 0}
let contNode = 0
let nodeLink = false
let tapEdge = true
let estadoAnt = []    
let tapNode = true
let floatDiv = true
let isNotDirected = true
let idModify = ''
let ant = ''
let antRemove = ''
let cy = cytoscape({
    container: document.getElementById('cy'),

    elements: [],
    style: [
        {
            selector: 'node',
            style: {
                'background-color': '#666',
                'label': 'data(id)'
            }
        },

        {
            selector: 'edge',
            style: {
                'width': 3,
                'line-color': '#666',
                'target-arrow-color': '#ccc',
                'target-arrow-shape': 'triangle',
                'target-arrow-color': '#ccc',
                "curve-style": "bezier"
            }
        }
    ],

    layout: {
        name: 'grid',
        rows: 1
    }

})

cy.on('tap', function (event) {
    displayOptionsNodeOff(false)
    let evtTarget = event.target
    if (evtTarget === cy) {
        cy.add({
            group: 'nodes',
            data: {
                id: String(contNode),
                weight: 1
            },
            position: { x: event.position.x, y: event.position.y }
        })
        contNode++
        nodeLink = false
    }
})

cy.on('tap', 'node', function (evt) {   
    displayOptionsNodeOff(false)
    let node = evt.target
    if (!tapNode && node.id() == antRemove) {
        cy.remove(String("#" + node.id()))
        tapNode = true
        nodeLink = false
    } else if (nodeLink) {
        cy.add({
            group: 'edges',
            data: { id: String(ant) + String(node.id()), source: String(ant), target: String(node.id()) },
            style: { label: Math.floor((Math.random() * 10) + 1) }
        })
        nodeLink = false
        tapNode = true
        //console.log(cy.$("#" + String(0) + String(1)).style().label)
        //console.log(cy.$("#" + String(2) + String(1)).style().label)
    } else {
        ant = String(node.id())
        nodeLink = true
        antRemove = node.id()
        tapNode = false
    }
})

cy.on('tap', 'edge', function (evt) {
    displayOptionsNodeOff(false)
    let edge = evt.target
    if (tapEdge) {
        antRemove = edge.id()
        tapEdge = false
    } else if (!tapEdge && edge.id() == antRemove) {
        cy.remove(String("#" + edge.id()))
        tapEdge = true
    }
   // console.log(edge.id())
})

function exportPng() {
    displayOptionsNodeOff(false)
    let png64 = cy.png('graph.png')
    document.location.href = png64.replace("image/png", "image/octet-stream")
}

function makeMatrizAdj() {
    let M = [];

    cy.nodes().map(noDaTela => {
        M[parseInt(noDaTela.data('id'))] = [];

    })

    for (i = 0; i < M.length; i++) {
        M[i] = new Array(M.length);
    }

    for (i = 0; i < M.length; i++) {
        for (j = 0; j < M.length; j++) {
            M[i][j] = 0;
        }
    }
    cy.edges().map(arestaDaTela => {
        let source = parseInt(arestaDaTela.source().data('id'))
        let target = parseInt(arestaDaTela.target().data('id'))
        //console.log("S: ", source);
        //console.log("T: ", target);
        M[source][target] = parseInt(cy.$("#" + String(source) + String(target)).style().label);
        //console.log(cy.$("#" + String(source) + String(target)).style().label)
    })

    //console.log(M);
    //console.log(M.length);
    //console.log(M);
    return M;
}

function makeListaAdj() {
    let G = []

    cy.nodes().map(noDaTela => {
        G[parseInt(noDaTela.data('id'))] = []
    })


    cy.edges().map(arestaDaTela => {
        let source = parseInt(arestaDaTela.source().data('id'))
        let target = parseInt(arestaDaTela.target().data('id'))
        //let valorPeso =parseFloat( arestaDaTela.data('label'))

        if (G[source] == undefined)
            G[source] = []
        G[source].push(target)
        if (G[target] == undefined)
            G[target] = []
        G[target].push(source)
    })

    G.forEach(element => {
        element.sort()
    })
    //console.log(G);
    return G
}


cy.on("cxttap", "node", function (evt) {
    let node = evt.target
    idModify = node.id()
    if (floatDiv) {
        document.getElementById("click").click()
        document.addEventListener('contextmenu', function onMouseUpdate(e) {
            floatDiv = false
            let x = e.pageX
            let y = e.pageY
            document.getElementById('optionsNode').style.top = String(y) + "px"
            document.getElementById('optionsNode').style.left = String(x) + "px"
            document.getElementById('optionsNode').style.display = 'block'
        })
    }
})

function displayOptionsNodeOff(optionAction) {
    if (optionAction) {
        let cor = document.getElementById('optionColor').value
        cy.style().selector("#" + String(idModify)).style('background-color', String(cor)).update()
    }
    document.getElementById('optionsNode').style.display = 'none'
    floatDiv = true
}

function resetColor() {
    cy.edges().map(ele => {
        ele.style({ "line-color": "#666" })
    })
}

function resetTudo(){
    cy.nodes().map(noDaTela => {       
        cy.remove(String("#" + noDaTela.data('id')))
    })
    contNode = 0 

}


function estadosDFS(op) {
    let estadoAnt = []
    
    if (op && estado.valor < matrizEstado.length) {
        estado.valor++
        if (estado.valor > 1)
            estadoAnt = matrizEstado[estado.valor - 1][4]
    } else if (estado.valor > 0) {
        estadoAnt = matrizEstado[estado.valor][4]
        estado.valor--
    }
    if (estado.valor < matrizEstado.length) {
        let table = document.getElementById('tableDFS');
        table.innerHTML = ""
        for (let i = 0; i < matrizEstado[estado.valor][0].length; i++) {
            let linhaEstado = "<tr><td>" + i + "</td><td>" + matrizEstado[estado.valor][0][i] + "</td><td>" + matrizEstado[estado.valor][1][i] + "</td><td>" + matrizEstado[estado.valor][2][i] + "</td><td>" + matrizEstado[estado.valor][3][i] + "</td></tr>"
            table.insertAdjacentHTML("beforeend", linhaEstado)
        }
        if (op)
            coloreGrafo(matrizEstado[estado.valor][4])
        else
            coloreGrafo(estadoAnt, "#666")
    }
}

function estadosBFS(op) {
    let estadoAnt = []
    if (op && estado.valor < matrizEstado.length) {
        estado.valor++
        if (estado.valor > 1)
            estadoAnt = matrizEstado[estado.valor - 1][4]
    } else if (estado.valor > 0) {
        estadoAnt = matrizEstado[estado.valor][4]
        estado.valor--
    }
    if (estado.valor < matrizEstado.length) {
        let filaHTML = document.getElementById('fila');
        filaHTML.innerHTML = ""
        filaHTML.insertAdjacentHTML("beforeend", matrizEstado[estado.valor][3])
        let table = document.getElementById('tableBFS');
        table.innerHTML = ""
        for (let i = 0; i < matrizEstado[estado.valor][0].length; i++) {
            let linhaEstado = "<tr><td>" + i + "</td><td>" + matrizEstado[estado.valor][0][i] + "</td><td>" + matrizEstado[estado.valor][1][i] + "</td><td>" + matrizEstado[estado.valor][2][i] + "</td></tr>"
            table.insertAdjacentHTML("beforeend", linhaEstado)
        }
        if (op)
            coloreGrafo(matrizEstado[estado.valor][4])
        else
            coloreGrafo(estadoAnt, "#666")
    }
}


function estadosFROYD(op) {


    if(estadoCentral.valor <= EstadoCompleto.length){

        if (op && estado.valor <= matrizEstado.length) {
            estado.valor++;
            if (estado.valor > 1)
                estadoAnt = matrizEstado[estado.valor - 1][4];
        } else if (estado.valor > 0) {
            estadoAnt = matrizEstado[estado.valor][4] ;
            estado.valor-- ;
        }else if(estado.valor == 0){
            if(estadoCentral.valor > 0){
                console.log('here?')
                estadoAnt = matrizEstado[estado.valor][4]
                estadoCentral.valor-- ;
                matrizEstado = EstadoCompleto[estadoCentral.valor].matrizEstado;
                estado.valor = matrizEstado.length - 1 ;

                coloreGrafo(estadoAnt, "#666") 
                parent = EstadoCompleto[estadoCentral.valor+1].parent;
                cy.edges().map(arestaDaTela => {
                    let source = parseInt(arestaDaTela.source().data('id'));
                    let target = parseInt(arestaDaTela.target().data('id'));
                    //console.log("S: ", source);
                    //console.log("T: ", target);
                    for (v = cy.nodes.length-1; v != 0; v = parent[v]) {
                        u = parent[v];
                        if(u == source && v == target){
                            let peso = parseInt(cy.$("#" + String(source) + String(target)).style().label) + EstadoCompleto[estadoCentral.valor+1].Flow 
                            cy.$("#" + String(source) + String(target)).style({label: peso})
                        }
                    }
                })
            }           
        }

        if (estado.valor < matrizEstado.length) {
            let filaHTML = document.getElementById('fila');
            filaHTML.innerHTML = ""

            filaHTML.insertAdjacentHTML("beforeend", matrizEstado[estado.valor][3])
            let table = document.getElementById("tableBFS");
            table.innerHTML = ""
            for (let i = 0; i < matrizEstado[estado.valor][0].length; i++) {
                let linhaEstado = "<tr><td>" + i + "</td><td>" + matrizEstado[estado.valor][0][i] + "</td><td>" + matrizEstado[estado.valor][1][i] + "</td><td>" + matrizEstado[estado.valor][2][i] + "</td></tr>"
                table.insertAdjacentHTML("beforeend", linhaEstado)
            }
            if (op)
                coloreGrafo(matrizEstado[estado.valor][4])
            else
                coloreGrafo(estadoAnt, "#666")
        }

        if(estado.valor == matrizEstado.length && estadoCentral.valor + 1 < EstadoCompleto.length && op)
        { 
            console.log('oi')
            console.log('Flow ' + EstadoCompleto[estadoCentral.valor].Flow);
            estadoAnt = matrizEstado[estado.valor - 1][4];
            estadoCentral.valor++;
            estado.valor=0;
    
            matrizEstado = EstadoCompleto[estadoCentral.valor].matrizEstado
            coloreGrafo(estadoAnt, "#666") 
            parent = EstadoCompleto[estadoCentral.valor - 1].parent
            cy.edges().map(arestaDaTela => {
                let source = parseInt(arestaDaTela.source().data('id'))
                let target = parseInt(arestaDaTela.target().data('id'))
 
                console.log(cy.nodes().length);
                for (v = cy.nodes().length-1; v != 0; v = parent[v]) {
                    u = parent[v];
                    if(u == source && v == target){
                        let peso = parseInt(cy.$("#" + String(source) + String(target)).style().label) - EstadoCompleto[estadoCentral.valor-1].Flow 
                        cy.$("#" + String(source) + String(target)).style({label: peso ? peso : 0})
                    }
                }
            })
        }else if (estado.valor == matrizEstado.length){
            console.log('FIM !! ' + EstadoCompleto[estadoCentral.valor].Flow);
            estado.valor--;
            estadoAnt = matrizEstado[estado.valor][4];

            coloreGrafo(estadoAnt, "#666") 
            parent = EstadoCompleto[estadoCentral.valor].parent
            cy.edges().map(arestaDaTela => {
                let source = parseInt(arestaDaTela.source().data('id'))
                let target = parseInt(arestaDaTela.target().data('id'))
                //console.log("S: ", source);
                //console.log("T: ", target);
                for (v = cy.nodes().length-1; v > 0; v = parent[v]) {
                    u = parent[v];
                    if(u == source && v == target){
                        let peso = parseInt(cy.$("#" + String(source) + String(target)).style().label) - EstadoCompleto[estadoCentral.valor].Flow 
                        cy.$("#" + String(source) + String(target)).style({label: peso ? peso : 0})
                    }
                }
                //console.log(cy.$("#" + String(source) + String(target)).style().label)
            })   
        } 

    }
    console.log(estadoCentral.valor)
    console.log(estado.valor)
    console.log('\n***\n    ')
}



function coloreGrafo(vetor, corEst) {
    if (corEst == undefined) {
        vetor.forEach(ele => {
            cy.$(ele[0]).style({ "line-color": ele[1] })
        })
    } else {
        vetor.forEach(ele => {
            cy.$(ele[0]).style({ "line-color": corEst })
        })
    }
}