export class EleccionLineal {
    constructor(votos) {
        this.votos = votos;
    }

    contarVotos() {
        this.conteo = {};
        for (let voto of this.votos) {
            this.conteo[voto] = (this.conteo[voto] || 0) + 1;
        }
    }

    obtenerGanador() {
        this.contarVotos();  // Asegúrate de contar los votos antes de obtener el ganador
        let ganador = null;
        let maxVotos = 0;

        for (let candidato in this.conteo) {
            if (this.conteo[candidato] > maxVotos) {
                maxVotos = this.conteo[candidato];
                ganador = candidato;
            }
        }

        return ganador;
    }
}
