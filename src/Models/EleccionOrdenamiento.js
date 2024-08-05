export class EleccionOrdenamiento {
    constructor(votos) {
        this.votos = votos;
    }

    obtenerGanador() {
        const conteo = {};
        this.votos.forEach(voto => {
            conteo[voto] = (conteo[voto] || 0) + 1;
        });

        const listaOrdenada = Object.entries(conteo).sort((a, b) => b[1] - a[1]);

        return listaOrdenada[0][0];
    }
}
