# DolarAhora - Cotizaciones en Tiempo Real (USD, EUR, USDT)

[![Licencia](https://img.shields.io/badge/Licencia-MIT-green.svg)](LICENSE)
[![Estado del Proyecto](https://img.shields.io/badge/Estado-Activo-brightgreen)]()

**DolarAhora** es una aplicación web ligera y moderna que muestra las cotizaciones actualizadas del Dólar Estadounidense (USD), Euro (EUR) y Tether (USDT) en Bolívares Venezolanos (VES). Incluye una calculadora integrada para convertir de forma instantánea cualquier cantidad a VES.

## 🌟 Características

-   **Cotizaciones en tiempo real**: Visualiza las tasas de cambio actualizadas de USD, EUR y USDT.
-   **Calculadora integrada**: Convierte cualquier cantidad de USD, EUR o USDT a Bolívares al instante.
-   **Actualizaciones automáticas**:
    -   USDT: Se actualiza cada 10 minutos a través de la API P2P de Binance.
    -   USD y EUR: Se actualizan cada hora a través de la API de open.er-api.com.
-   **Diseño responsivo y moderno**: Funciona perfectamente en cualquier dispositivo (PC, tablet, móvil).
-   **Privacidad total**: No recopila datos personales, no utiliza cookies de seguimiento y es completamente anónimo.
-   **Información legal**: Incluye páginas de Términos y Condiciones y Política de Privacidad.

## 🚀 Demo

Puedes ver la aplicación en funcionamiento aquí: **[Añade el enlace a tu GitHub Pages o Netlify aquí]**

## 📋 Tecnologías Utilizadas

-   **HTML5**: Para la estructura semántica de la página.
-   **CSS3**: Para el diseño, animaciones y adaptabilidad a dispositivos móviles.
-   **JavaScript (ES6+)**: Para la lógica de la aplicación, consumo de APIs, y la interactividad en tiempo real.
-   **APIs Externas**:
    -   [Binance P2P API](https://www.binance.com/en/p2p): Para obtener el precio promedio de compra de USDT en VES.
    -   [Exchange Rate API](https://open.er-api.com/): Para obtener las tasas de cambio oficiales de USD y EUR a VES.

## 📁 Estructura del Proyecto

```text
📁 DolarAhora/
├── 📄 index.html        # Página principal y calculadora
├── 📄 privacidad.html   # Política de privacidad
├── 📄 terminos.html     # Términos y condiciones de uso
├── 📄 style.css         # Hoja de estilos global
├── 📄 script.js         # Lógica principal y conexión a APIs
└── 🖼️ logo.svg          # Logo vectorial de la aplicación
```

## ⚙️ Instalación y Uso Local

Sigue estos pasos para ejecutar el proyecto en tu máquina local.

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/dolarahora.git

2. Navega al directorio del proyecto:
 **Clona el repositorio:**
    ```bash
    cd dolarahora
Abre el archivo index.html en tu navegador.
Simplemente haz doble clic en el archivo o utiliza una extensión como "Live Server" de VS Code para una mejor experiencia de desarrollo.

Nota: Asegúrate de tener una conexión a internet para que las APIs funcionen correctamente.

🔧 Personalización
Puedes modificar la frecuencia de actualización de las cotizaciones editando los intervalos en script.js.

```code
// Actualizar USDT cada 10 minutos (600000 ms)
setInterval(() => {
    precioUSDTsimple();
}, 60000 * 10);

// Actualizar Dólar y Euro cada hora (3600000 ms)
setInterval(() => {
    buscarDolar();
    buscarEuro();
}, 1000 * 60 * 60);
```
📝 Aviso Legal
DolarAhora es una herramienta meramente informativa. Las cotizaciones mostradas son estimaciones basadas en datos de APIs de terceros y pueden no reflejar el valor exacto de mercado en el momento de la transacción. No ofrecemos asesoría financiera ni nos responsabilizamos por decisiones tomadas en base a la información aquí presentada. Para más detalles, consulta nuestras páginas de Términos y Condiciones y Política de Privacidad.

🤝 Contribuciones
Las contribuciones son lo que hacen a la comunidad de código abierto un lugar increíble para aprender, inspirar y crear. Cualquier contribución que hagas será muy apreciada.

Haz un Fork del proyecto.

Crea tu rama de características (git checkout -b feature/AmazingFeature).

Haz commit de tus cambios (git commit -m 'Add some AmazingFeature').

Haz push a la rama (git push origin feature/AmazingFeature).

Abre un Pull Request.

📧 Contacto
Creador: FranyelPacheco
Email: franyel.pachecocv@gmail.com

Si tienes alguna pregunta o sugerencia, no dudes en contactarme.

🙏 Agradecimientos
A las APIs de Binance y Exchange Rate API por proporcionar los datos.

A la comunidad de código abierto por su constante inspiración.
