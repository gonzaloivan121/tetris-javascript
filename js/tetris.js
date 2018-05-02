var velocidad = 50000; //velocidad del juego
var fpi, cpi, rot; //fila, columna, y rotación de la ficha
var tablero; //matriz con el tablero
var pieza = 0; //pieza
var record = 0; //almacena la mejor puntuación
var lineas = 0; //almacena la puntuación actual
var pos = [ //Valores referencia de coordenadas relativas
  [ 0, 0 ],
  [ 0, 1 ],
  [-1, 0 ],
  [ 1, 0 ],
  [-1,-1 ],
  [ 0,-1 ],
  [ 1,-1 ],
  [ 0, -2 ]
];

var piezas = [ //Diseño de las piezas, el primer valor de cada fila corresponde con el número de rotaciones posibles
  [ 4, 0, 1, 2, 3 ],
  [ 4, 0, 1, 5, 6 ],
  [ 4, 0, 1, 5, 4 ],
  [ 2, 0, 1, 5, 7 ],
  [ 2, 0, 2, 5, 6 ],
  [ 2, 0, 3, 5, 4 ],
  [ 1, 0, 5, 6, 3 ]
];


//Genera una nueva partida inicializando las variables
function nuevaPartida() {
  velocidad = 50000;
  tablero = new Array(20);
  for (var n = 0; n < 20; n++) {
    tablero[n] = new Array(9);
    for (var m = 0; m < 9; m++) {
      tablero[n][m] = 0;    
    }
  }
  lineas = 0;
  nuevaPieza();
}


//Detecta si una fila columna del tablero está libre para ser ocupada
function cuadroNoDisponible(f, c) {
  if (f < 0) return false;
  return (c < 0 || c >= 9 || f >= 20 || tablero[f][c] > 0);
}


//Detecta si la pieza activa colisiona fuera del tablero o con otra pieza
function colisionaPieza() {
  for (var v = 1; v < 5; v++) {
    var des = piezas[pieza][v];
    var pos2 = rotarCasilla(pos[des]);
    if (cuadroNoDisponible(pos2 [ 0 ] + fpi, pos2 [ 1 ] + cpi)) {
      return true;
    }
  }
  return false;
}


//Detecta si hay líneas completas y si las hay las computa, borra y desplaza la submatriz superior
function detectarLineas() {
  for (var f = 0; f < 20; f++) {
    var contarCuadros = 0;
    for (var c = 0; c < 9; c++) {
      if (tablero[f][c] > 0) {
        contarCuadros++;
      }
    }
    if (contarCuadros === 9) {
      for (var f2 = f; f2 > 0; f2--) {
        for (var c2 = 0;  c2 < 9; c2++) {
          tablero [f2][c2] = tablero[f2-1][c2];
        }
      }
      lineas++;
    }
  }
}


//Baja la pieza, si toca otra pieza o el suelo, saca una nueva pieza
function bajarPieza() {
  fpi = fpi + 1;
  if (colisionaPieza()) {
    fpi = fpi - 1;
    for (v = 1; v < 5; v++) {
      des = piezas[pieza][v];
      var pos2 = rotarCasilla(pos[des]);
      if (pos2 [ 0 ] + fpi >= 0 && pos2 [ 0 ] + fpi < 20 &&
          pos2 [ 1 ] + cpi >= 0 && pos2 [ 1 ] + cpi < 9) {
            tablero[pos2 [ 0 ] + fpi][pos2 [ 1 ] + cpi] = pieza + 1;
      }
    }

    detectarLineas();


    //Si hay algún cuadro en la fila 0 reinicia el juego
    var reiniciar = 0;
    for (var c = 0; c < 9; c++) {
      if (tablero[ 0 ][ c ] != 0) {
        reiniciar = 1;
      }
    }
    if (reiniciar == 1) {
      if (lineas > record) {
        record = lineas;
      }
      nuevaPartida();
    } else {
      nuevaPieza();
    }
  }
}


//Mueve la pieza lateralmente
function moverPieza(des) {
  cpi = cpi + des;
  if (colisionaPieza()) {
    cpi = cpi - des;
  }
}


//Rota la pieza según el número de rotaciones posibles tenga la pieza activa
//(posición 0 de la pieza)
function rotarPieza() {
  rot = rot + 1;
  if (rot == piezas[pieza][ 0 ]) {
    rot = 0;
  }
  if (colisionaPieza()) {
    rot = rot - 1;
    if (rot == -1) {
      rot = piezas[pieza][ 0 ] - 1;
    }
  }
}


//Obtiene unas coordenadas f, c y las rota 90 grados
function rotarCasilla(celda) {
  var pos2 = [celda[ 0 ], celda[ 1 ]];
  for (var n = 0; n < rot; n++) {
    var f = pos2[ 1 ];
    var c = -pos2[ 0 ];
    pos2[ 0 ] = f;
    pos2[ 1 ] = c;
  }
  return pos2;
}


//Genera una nueva pieza aleatoriamente
function nuevaPieza() {
  cpi = 3;
  fpi = 0;
  rot = 0;
  pieza = Math.floor(Math.random() * 7);
}


//Ejecución principal del juego, realiza la animación y repinta
function tick() {
  bajarPieza();
  pintar();
  setTimeout('tick()', velocidad/100);
}


//Pinta el tablero (lo genera con html) y lo plasma en un div
function pintar() {
  var lt = " <";
  var des;
  var html = "<table class='tetris'>"
  for (var f = 0; f < 20; f++) {
    html += "<tr>";
    for (var c = 0; c < 9; c++) {
      var color = tablero[f][c];
      if (color == 0) {
        for (v = 1; v < 5; v++) {
          des = piezas[pieza][v];
          var pos2 = rotarCasilla(pos[des]);
          if (f == fpi + pos2[ 0 ] && c == cpi + pos2[ 1 ]) {
            color = pieza + 1;
          }
        }
      }
      html += "<td class='celda" + color + "'/>";
    }
    html += lt + "/tr>";
  }
  html += "<br />Lineas : " + lineas;
  html += "<br />Record : " + record;
  document.getElementById('tetris').innerHTML = html;
    velocidad = Math.max(velocidad - 1, 500);
}


//Al iniciar la página se inicia el juego
function eventoCargar() {
  nuevaPartida();
  setTimeout('tick()', 1);
}


//Al pulsar una tecla
function tecla(e) {
  var characterCode = (e && e.which)? e.which: e.keyCode;
  switch (characterCode) {
    case 37:
      moverPieza(-1);
      break;

    case 38:
      rotarPieza(-1);
      break;

    case 39:
      moverPieza(1);
      break;

    case 40:
      bajarPieza();
      break;

    default:
    break;
  }
  pintar();
}