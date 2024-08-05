export class EleccionCuadratica {
    constructor(votos) {
        this.votos = votos;
    }

    obtenerGanador() {
        const conteo = {};

        for (let i = 0; i < this.votos.length; i++) {
            const voto = this.votos[i];
            conteo[voto] = (conteo[voto] || 0) + 1;
        }

        let ganador = null;
        let maxVotos = 0;

        for (let candidato in conteo) {
            if (conteo[candidato] > maxVotos) {
                maxVotos = conteo[candidato];
                ganador = candidato;
            }
        }

        return ganador;
    }
}
