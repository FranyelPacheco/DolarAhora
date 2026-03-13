// Variables globales para almacenar las tasas actuales
let tasasActuales = {
    USDT: 0,
    Dolar: 0,
    Euro: 0
};

// =================== FUNCIONES PRINCIPALES ===================
async function inicializarCotizaciones() {
    actualizarReloj();
    setInterval(actualizarReloj, 1000);
    
    // Configurar event listeners para los inputs
    document.getElementById('inputUSDT').addEventListener('input', (e) => manejarInputEnTiempoReal(e, 'USDT'));
    document.getElementById('inputDolar').addEventListener('input', (e) => manejarInputEnTiempoReal(e, 'Dolar'));
    document.getElementById('inputEuro').addEventListener('input', (e) => manejarInputEnTiempoReal(e, 'Euro'));
    
    // También para pegar valores
    document.getElementById('inputUSDT').addEventListener('paste', (e) => manejarPegado(e, 'USDT'));
    document.getElementById('inputDolar').addEventListener('paste', (e) => manejarPegado(e, 'Dolar'));
    document.getElementById('inputEuro').addEventListener('paste', (e) => manejarPegado(e, 'Euro'));
    
    // Cargar todas las cotizaciones
    precioUSDTsimple();
    buscarDolar();
    buscarEuro();
}

// =================== MANEJO DE INPUTS ===================
function manejarInputEnTiempoReal(event, moneda) {
    const input = event.target;
    let valor = input.value;
    
    // Permitir que el input esté vacío temporalmente
    if (valor === '') {
        input.dataset.valorTemporal = 'vacio';
        document.getElementById(`resultado${moneda}`).textContent = 'Ingrese un valor';
        return;
    }
    
    // Filtrar solo números y un punto decimal
    valor = valor.replace(/[^0-9.]/g, '');
    
    // Evitar múltiples puntos decimales
    const partes = valor.split('.');
    if (partes.length > 2) {
        valor = partes[0] + '.' + partes.slice(1).join('');
    }
    
    // Si después de filtrar está vacío, mostrar mensaje
    if (valor === '') {
        input.dataset.valorTemporal = 'vacio';
        document.getElementById(`resultado${moneda}`).textContent = 'Ingrese un valor';
        input.value = '';
        return;
    }
    
    // Actualizar el valor en el input
    input.value = valor;
    input.dataset.valorTemporal = 'valido';
    
    // Calcular conversión
    calcularConversion(moneda);
}

function manejarPegado(event, moneda) {
    // Permitir pegar y luego procesar
    setTimeout(() => {
        const input = event.target;
        let valor = input.value;
        
        // Filtrar solo números y puntos
        valor = valor.replace(/[^0-9.]/g, '');
        
        // Remover puntos duplicados
        const partes = valor.split('.');
        if (partes.length > 2) {
            valor = partes[0] + '.' + partes.slice(1).join('');
        }
        
        // Si está vacío después de filtrar
        if (valor === '') {
            input.value = '1';
            input.dataset.valorTemporal = 'valido';
            document.getElementById(`resultado${moneda}`).textContent = 'Esperando tasa...';
        } else {
            input.value = valor;
            input.dataset.valorTemporal = 'valido';
            calcularConversion(moneda);
        }
    }, 10);
}

// =================== FUNCIONES PARA COTIZACIONES ===================
async function precioUSDTsimple() {
    const valorElemento = document.getElementById('valorUSDT');
    const estadoElemento = document.getElementById('estadoUSDT');
    
    try {
        estadoElemento.textContent = 'Actualizando...';
        estadoElemento.classList.add('actualizando');
        
        const respuesta = await fetch("https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search", {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                asset: "USDT",
                fiat: "VES",
                page: 20,
                rows: 5,
                tradeType: "BUY"
            })
        });
        
        const datos = await respuesta.json();

        if (datos.data && datos.data.length > 0) {
            let sumaPrecios = 0;
            let contador = 0;
            
            for (let i = 0; i < Math.min(10, datos.data.length); i++) {
                const precioStr = datos.data[i].adv?.price;
                if (precioStr) {
                    const precioNum = parseFloat(precioStr);
                    sumaPrecios += precioNum;
                    contador++;
                }
            }
            
            const precioPromedio = contador > 0 ? sumaPrecios / contador : 0;
            tasasActuales.USDT = precioPromedio;
            
            if (precioPromedio > 0 && valorElemento) {
                const ahora = new Date();
                const horaActualizacion = ahora.toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
                
                valorElemento.innerHTML = `<span class="valorNumero">${precioPromedio.toFixed(2)}</span> <span class="valorMoneda">Bs</span>`;
                estadoElemento.textContent = `Actualizado: ${horaActualizacion}`;
                estadoElemento.classList.remove('actualizando');
                estadoElemento.classList.add('resaltar');
                
                setTimeout(() => {
                    estadoElemento.classList.remove('resaltar');
                }, 1000);
                
                // Calcular conversión si hay un valor válido en el input
                const input = document.getElementById('inputUSDT');
                if (input && input.dataset.valorTemporal === 'valido') {
                    calcularConversion('USDT');
                }
            }
        }
    } catch (error) {
        console.error("Error USDT:", error);
        manejarError(valorElemento, estadoElemento, 'USDT');
    }
}

async function buscarDolar() {
    const valorElemento = document.getElementById('valorDolar');
    const estadoElemento = document.getElementById('estadoDolar');
    
    try {
        estadoElemento.textContent = 'Actualizando...';
        estadoElemento.classList.add('actualizando');
        
        const respuesta = await fetch('https://open.er-api.com/v6/latest/USD');
        const datos = await respuesta.json();
        
        if (valorElemento && datos.rates && datos.rates.VES) {
            const tasaDolar = datos.rates.VES;
            tasasActuales.Dolar = tasaDolar;
            
            const ahora = new Date();
            const horaActualizacion = ahora.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            valorElemento.innerHTML = `<span class="valorNumero">${tasaDolar}</span> <span class="valorMoneda">Bs</span>`;
            estadoElemento.textContent = `Actualizado: ${horaActualizacion}`;
            estadoElemento.classList.remove('actualizando');
            estadoElemento.classList.add('resaltar');
            
            setTimeout(() => {
                estadoElemento.classList.remove('resaltar');
            }, 1000);
            
            // Calcular conversión si hay un valor válido en el input
            const input = document.getElementById('inputDolar');
            if (input && input.dataset.valorTemporal === 'valido') {
                calcularConversion('Dolar');
            }
        }
    } catch (error) {
        console.error("Error Dólar:", error);
        manejarError(valorElemento, estadoElemento, 'Dolar');
    }
}

async function buscarEuro() {
    const valorElemento = document.getElementById('valorEuro');
    const estadoElemento = document.getElementById('estadoEuro');
    
    try {
        estadoElemento.textContent = 'Actualizando...';
        estadoElemento.classList.add('actualizando');
        
        const respuesta = await fetch('https://open.er-api.com/v6/latest/EUR');
        const datos = await respuesta.json();
        
        if (valorElemento && datos.rates && datos.rates.VES) {
            const tasaEuro = datos.rates.VES;
            tasasActuales.Euro = tasaEuro;
            
            const ahora = new Date();
            const horaActualizacion = ahora.toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
            });
            
            valorElemento.innerHTML = `<span class="valorNumero">${tasaEuro}</span> <span class="valorMoneda">Bs</span>`;
            estadoElemento.textContent = `Actualizado: ${horaActualizacion}`;
            estadoElemento.classList.remove('actualizando');
            estadoElemento.classList.add('resaltar');
            
            setTimeout(() => {
                estadoElemento.classList.remove('resaltar');
            }, 1000);
            
            // Calcular conversión si hay un valor válido en el input
            const input = document.getElementById('inputEuro');
            if (input && input.dataset.valorTemporal === 'valido') {
                calcularConversion('Euro');
            }
        }
    } catch (error) {
        console.error("Error Euro:", error);
        manejarError(valorElemento, estadoElemento, 'Euro');
    }
}

// =================== FUNCIONES DE UTILIDAD ===================
function actualizarReloj() {
    const ahora = new Date();
    
    // Formatear hora
    const horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    const segundos = ahora.getSeconds().toString().padStart(2, '0');
    
    document.getElementById('horaActual').textContent = `${horas}:${minutos}:${segundos}`;
    
    // Formatear fecha
    const opcionesFecha = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const fechaFormateada = ahora.toLocaleDateString('es-ES', opcionesFecha);
    
    // Capitalizar primera letra
    document.getElementById('fechaActual').textContent = 
        fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1);
}

function calcularConversion(moneda) {
    const inputId = `input${moneda}`;
    const resultadoId = `resultado${moneda}`;
    const tasa = tasasActuales[moneda];
    
    const inputElement = document.getElementById(inputId);
    const resultadoElement = document.getElementById(resultadoId);
    
    if (!inputElement || !resultadoElement) return;
    
    let cantidadTexto = inputElement.value;
    
    // Si el input está vacío, no calcular
    if (cantidadTexto === '') {
        resultadoElement.textContent = 'Ingrese un valor';
        return;
    }
    
    const cantidad = parseFloat(cantidadTexto);
    
    // Validar que sea un número válido
    if (isNaN(cantidad)) {
        resultadoElement.textContent = 'Valor inválido';
        return;
    }
    
    // Permitir 0 y valores positivos
    if (cantidad < 0) {
        inputElement.value = Math.abs(cantidad).toString();
        calcularConversion(moneda);
        return;
    }
    
    if (tasa > 0) {
        const resultado = cantidad * tasa;
        const simboloMoneda = moneda === 'USDT' ? 'USDT' : moneda === 'Dolar' ? 'USD' : 'EUR';
        
        resultadoElement.innerHTML = `
            <strong>${cantidad} ${simboloMoneda}</strong> = 
            <span class="resultadoVerde">${resultado.toFixed(2)} Bs</span>
        `;
    } else {
        resultadoElement.textContent = 'Esperando tasa de cambio...';
    }
}

function manejarError(valorElemento, estadoElemento, moneda) {
    if (valorElemento && estadoElemento) {
        const ahora = new Date();
        const horaError = ahora.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        valorElemento.innerHTML = '<span class="textoError">Error al cargar</span>';
        estadoElemento.textContent = `Error: ${horaError}`;
        estadoElemento.classList.remove('actualizando');
        estadoElemento.style.color = '#F6465D';
        
        // Actualizar resultado de calculadora
        const resultadoElement = document.getElementById(`resultado${moneda}`);
        if (resultadoElement) {
            resultadoElement.textContent = 'Error obteniendo tasa';
            resultadoElement.style.color = '#F6465D';
        }
    }
}

// =================== INTERVALOS DE ACTUALIZACIÓN ===================
// Actualizar USDT cada 10 minutos
setInterval(() => {
    precioUSDTsimple();
}, 60000 * 10);

// Actualizar Dólar y Euro cada hora
setInterval(() => {
    buscarDolar();
    buscarEuro();
}, 1000 * 60 * 60);