import { EleccionCuadratica } from '../Models/EleccionCuadraticas.js';
import { EleccionLineal } from '../Models/EleccionLineal.js';
import { EleccionOrdenamiento } from '../Models/EleccionOrdenamiento.js';

export function validarVotos(votos) {
    return votos.every(voto => Number.isInteger(voto) && voto > 0);
}

function medirTiempo(algoritmo) {
    const repeticiones = 1000; // Número de repeticiones para mejorar la precisión
    let totalTiempo = 0;

    for (let i = 0; i < repeticiones; i++) {
        const inicio = performance.now();
        algoritmo.obtenerGanador();
        const fin = performance.now();
        totalTiempo += (fin - inicio);
    }

    const tiempoPromedio = totalTiempo / repeticiones;
    return tiempoPromedio;
}

let chartInstance = null;

document.getElementById('formularioDatos').addEventListener('submit', (event) => {
    event.preventDefault();

    const votosInput = document.getElementById('votos').value;
    const votos = votosInput.split(',').map(voto => parseInt(voto.trim(), 10));

    if (!validarVotos(votos)) {
        alert('Todos los votos deben ser enteros positivos.');
        return;
    }

    const tamaños = [];
    const tiemposCuadratico = [];
    const tiemposLineal = [];
    const tiemposOrdenamiento = [];

    for (let tamaño of [1, 10, 100, 500, 1000]) {
        const votosPrueba = Array(tamaño).fill().map(() => Math.floor(Math.random() * 100) + 1);
        tamaños.push(tamaño);

        const algoCuadratico = new EleccionCuadratica(votosPrueba);
        const algoLineal = new EleccionLineal(votosPrueba);
        const algoOrdenamiento = new EleccionOrdenamiento(votosPrueba);

        tiemposCuadratico.push(medirTiempo(algoCuadratico));
        tiemposLineal.push(medirTiempo(algoLineal));
        tiemposOrdenamiento.push(medirTiempo(algoOrdenamiento));
    }

    localStorage.setItem('datos', JSON.stringify({
        tamaños,
        tiemposCuadratico,
        tiemposLineal,
        tiemposOrdenamiento
    }));

    // Actualización de la tabla
    const tabla = document.getElementById('tablaDatos').getElementsByTagName('tbody')[0];
    tabla.innerHTML = '';
    for (let i = 0; i < tamaños.length; i++) {
        const fila = tabla.insertRow();
        fila.insertCell().textContent = tamaños[i];
        fila.insertCell().textContent = tiemposCuadratico[i].toFixed(2);
        fila.insertCell().textContent = tiemposLineal[i].toFixed(2);
        fila.insertCell().textContent = tiemposOrdenamiento[i].toFixed(2);
    }

    // Actualización del gráfico
    const ctx = document.getElementById('miGrafico').getContext('2d');

    // Destruir el gráfico anterior si existe
    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: tamaños,
            datasets: [
                {
                    label: 'Cuadrático O(n²)',
                    data: tiemposCuadratico,
                    borderColor: 'red',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: false
                },
                {
                    label: 'Lineal O(n)',
                    data: tiemposLineal,
                    borderColor: 'blue',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: false
                },
                {
                    label: 'Ordenamiento O(n log n)',
                    data: tiemposOrdenamiento,
                    borderColor: 'green',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: { 
                    title: { display: true, text: 'Tamaño de Entrada' },
                    ticks: {
                        autoSkip: true,
                        maxTicksLimit: 10
                    }
                },
                y: { 
                    title: { display: true, text: 'Tiempo (ms)' },
                    beginAtZero: true
                }
            }
        }
    });
});
