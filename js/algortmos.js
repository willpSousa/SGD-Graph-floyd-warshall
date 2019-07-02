let matrizEstado = []
let EstadoCompleto = []
let matrizFloyd = [];
let matrizOriginal = [];

function floyd() {
  //dist = init(graph);
  matrizOriginal = dist = makeMatrizAdj()
  let size = dist.length;
  let k = i = j = 0;
  for (k = 0; k < size; k += 1) {
    for (i = 0; i < size; i += 1) {
      for (j = 0; j < size; j += 1) {
        if (dist[i][j] > dist[i][k] + dist[k][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }
  cy.edges().map(arestaDaTela => {
    cy.remove(String("#" + arestaDaTela.id()))
  })
  
  createTable(dist);
  renderGraph(dist);
  matrizFloyd = dist;
  return dist;
}

function effectCreate(dist, i, j, timeout) {
  setTimeout(() => {
    
    cy.add({
      group: 'edges',
      data: { id: String(i) + String(j), source: String(i), target: String(j) },
      style: { label: dist[i][j] }
    })
  }, timeout);

}

function renderGraph(dist) {
  let timeout = 500;
  for (i = 0; i < dist.length; i++) {
    for (j = 0; j < dist.length; j++) {
      if (i != j && dist[i][j] != Infinity) {
        effectCreate(dist, i, j, timeout);
        timeout = timeout + 500;
      }
    }
  }
}


function createTable(matriz) {
  var table = document.getElementById('floyd-table');
  table.innerHTML = "";
  var tbody = document.createElement('tbody');

  matriz.forEach(function (dadosLinha, lin) {
    var tr = document.createElement('tr');

    dadosLinha.forEach(function (dadosColuna, col) {
      var td = document.createElement('td');
      td.id = "id_" +String(lin) + String(col);
      td.appendChild(document.createTextNode(dadosColuna));
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
}