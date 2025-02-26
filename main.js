
// ID de tu hoja de Google Sheets (lo encuentras en la URL)
const rangeAppoitment = 'Appoitment Links!A2:B'; // Rango deseado (e.g., B1 a C10)
const rangeTools = 'Tools Links!A2:B';
const rangeVideo = 'Videos Links!A2:B';
const sheetId = '1Uk-TUa23G4g1ovRgJWHejlUqr09l7DAffJx8zVamnc0';  // Sustituye con el ID de tu hoja
const apiKey = 'AIzaSyDpvm4LjJWrTkoUUsBoMEkRmLUfqYnF3ng';  // Sustituye con tu API Key google
// URL de la API de Google Sheets para el rango
const apiUrlAppoitment = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(rangeAppoitment)}?key=${apiKey}`;
const apiUrlTools = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(rangeTools)}?key=${apiKey}`;
const apiUrlVideo = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(rangeVideo)}?key=${apiKey}`;

let persona_selected;

// Obtener el valor de interés desde Google Sheets al cargar la página
window.onload = function () {
    cargar_google_sheet();
    cargarContexto();
};
// Función para generar dinámicamente la estructura en el contenedor
function renderizarDatos(datos, container) {
    const contenedor = document.getElementById(container);

    // Iterar sobre los datos y crear elementos HTML
    datos.forEach(fila => {
        const [nombre, enlace] = fila;

        // Verificar si ambos valores (nombre y enlace) no están vacíos
        if (nombre && enlace) {
            const div_general = document.createElement('div');
            div_general.className = 'col-6 px-1';

            // Icono
            // const icono = document.createElement('i');
            // icono.className = 'bi bi-arrow-right-circle ms-1';

            // Crear el enlace <a>
            const anchor = document.createElement('a');
            anchor.className = 'col-12 px-1 rounded-2 bg-light my-1 d-flex justify-content-center align-items-center contenedor-interno';
            anchor.href = enlace; // Enlace vacío por ahora
            anchor.target = '_blank';
            anchor.style.display = 'flex'; // Asegura que el texto y el ícono estén en fila

            // Contenedor del texto con truncado
            const textContainer = document.createElement('span');
            textContainer.className = 'truncate-text';
            textContainer.textContent = nombre; // Texto del enlace

            // Agregar el texto al enlace
            anchor.appendChild(textContainer);

            // Agregar el ícono al enlace
            // anchor.appendChild(icono);

            // Agregar el div al contenedor principal
            div_general.appendChild(anchor);
            contenedor.appendChild(div_general);

        }
    });
}
//funcion para cargar del google sheets
function cargar_google_sheet() {
    // Llamadas a la función optimizada
    obtenerDatos(apiUrlAppoitment, 'contenedor');
    obtenerDatos(apiUrlTools, 'contenedor1');
    obtenerDatos(apiUrlVideo, 'contenedor2');
}
//consulta al api
function obtenerDatos(apiUrl, contenedorId) {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.values) {
                renderizarDatos(data.values, contenedorId);
            } else {
                console.warn(`No se encontraron valores en ${contenedorId}.`);
            }
        })
        .catch(error => console.error(`Error al obtener datos de ${contenedorId}:`, error));
}

//funcion para cargar el contexto de Follow Boss
function cargarContexto() {

    // Obtener los parámetros de la URL
    const urlParams = new URLSearchParams(location.search);
    const contextParam = urlParams.get('context');

    if (contextParam) {
        try {
            // Decodificar el contexto de Base64
            const decodedContext = atob(contextParam); // atob() decodifica Base64 a texto

            // Parsear el contenido decodificado como JSON
            const context = JSON.parse(decodedContext);
            // Acceder a la información dentro del contexto
            const account = context.account || {};
            const user = context.user || {};
            const person = context.person || {};

            persona_selected = person
            //renderizarDatos([])
            console.log('Cuenta:', account);
            console.log('Usuario:', user);
            console.log('Persona:', person);

            //(VA) Client Questions            
            const enlace_va_client_questions = 'https://www.jotform.com/242136224484150?nombreY646=' +
                `${person.firstName}` +
                `${person.lastName ? ' ' + person.lastName : ''}&clientId=` +
                `${person.id}&clientPhone=` +
                `${person.phones.lenght > 0 ? person.phones[0].value : ''}`;

            //(VA) Appt Cycle Form
            const enlace_va_appt_cycle = 'https://www.jotform.com/231956723207054?clientName=' +
                `${person.firstName}` +
                `${person.lastName ? ' ' + person.lastName : ''}&clientId=` +
                `${person.id}&stageActual=` +
                `${person.stage.name}&nombreDel=` +
                `${person.firstName}` +
                `${person.lastName ? ' ' + person.lastName : ''}&emailDel=` +
                `${person.emails.lenght > 0 ? person.emails[0].value : ''}`;

            //(AU) Evaluación de Captación
            const enlace_au_eval_capt = 'https://www.jotform.com/232676252838061?nombreY[first]=' +
                `${person.firstName}&nombreY[last]=` +
                `${person.lastName ? person.lastName : ''}&clientId=` +
                `${person.id}`;

            //(SA) Looking Home Form
            const enlace_sa_look_home = 'https://www.jotform.com/231225913710851?nombre[first]=' +
                `${person.firstName}&nombre[last]=` +
                `${person.lastName ? person.lastName : ''}&clientId=` +
                `${person.id}&stageActual=` +
                `${person.stage.name}`;

            //Metodo que carga los enlaces
            renderizarDatos([
                ['(VA) Client Questions', enlace_va_client_questions],
                ['(VA) Appt Cycle Form', enlace_va_appt_cycle],
                ['(AU) Evaluación de Captación', enlace_au_eval_capt],
                ['(SA) Looking Home Form', enlace_sa_look_home]
            ], 'prefilledLink')

        } catch (error) {
            console.error('Error al decodificar o parsear el contexto:', error);
        }
    } else {
        console.log('No se encontró el parámetro context en la URL.');
    }
}






