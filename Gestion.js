// Datos de las ciudades según el departamento
const ciudadesPorDepartamento = {
    "Cundinamarca": ["Bogotá", "Soacha", "Chía"],
    "Antioquia": ["Medellín", "Envigado", "Bello"],
    "Valle del Cauca": ["Cali", "Palmira", "Buenaventura","Cartago","Palmira","Tulua"],
    "Risaralda":["Pereira","Marsella","Dos quebradas","Santa Rosa","La virginia"],
    "Caldas":["Manizales"]
};

// Actualiza las ciudades cuando se selecciona un departamento
function actualizarCiudades() {
    const departamento = document.getElementById("departamento").value;
    const ciudadSelect = document.getElementById("ciudad");

    // Limpiar las opciones previas de la ciudad
    ciudadSelect.innerHTML = "<option value=''>Selecciona una Ciudad</option>";

    if (departamento && ciudadesPorDepartamento[departamento]) {
        // Agregar las ciudades correspondientes al departamento seleccionado
        ciudadesPorDepartamento[departamento].forEach(ciudad => {
            const option = document.createElement("option");
            option.value = ciudad;
            option.textContent = ciudad;
            ciudadSelect.appendChild(option);
        });
    }
}

// Manejo del array de usuarios
let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];  // Cargar los usuarios desde el localStorage si existen

// Mostrar usuarios al cargar la página
mostrarUsuarios();

// Evento al enviar el formulario
document.getElementById("userForm").addEventListener("submit", (e) => {
    e.preventDefault();
    agregarOActualizarUsuario();
});

// Agregar o actualizar usuario
function agregarOActualizarUsuario() {
    let nombre = document.getElementById("nombre").value;
    let cedula = document.getElementById("cedula").value;
    let edad = document.getElementById("edad").value;
    let celular = document.getElementById("celular").value;
    let telefono = document.getElementById("telefono").value || "";
    let email = document.getElementById("email").value;
    let departamento = document.getElementById("departamento").value;
    let ciudad = document.getElementById("ciudad").value;
    let fechaNacimiento = document.getElementById("fechaNacimiento").value;
    let foto = document.getElementById("foto").files[0];

    // Validar campos obligatorios
    if (!nombre || !cedula || !edad || !celular || !email || !departamento || !ciudad || !fechaNacimiento || !foto) {
        alert("Por favor, complete todos los campos obligatorios.");
        return;
    }

    // Validar cédula única
    let usuarioExistente = usuarios.find(u => u.cedula === cedula);
    if (usuarioExistente) {
        alert("Ya existe un usuario con esta cédula.");
        return;
    }

    // Convertir la foto a una URL para mostrarla
    let fotoURL = URL.createObjectURL(foto);

    let usuario = { nombre, cedula, edad, celular, telefono, email, departamento, ciudad, fechaNacimiento, fotoURL };
    usuarios.push(usuario);
    
    // Guardar en localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    limpiarFormulario();
    mostrarUsuarios();
}

// Limpiar el formulario
function limpiarFormulario() {
    document.getElementById("userForm").reset();
    document.getElementById("ciudad").innerHTML = "<option value=''>Selecciona una Ciudad</option>"; // Restablecer el menú de ciudad
}

// Mostrar los usuarios en la tabla
function mostrarUsuarios() {
    let tbody = document.getElementById("userTableBody");
    tbody.innerHTML = "";

    usuarios.forEach((usuario, index) => {
        let row = `<tr>
            <td>${usuario.nombre}</td>
            <td>${usuario.cedula}</td>
            <td>${usuario.edad}</td>
            <td>${usuario.celular}</td>
            <td>${usuario.telefono}</td>
            <td>${usuario.email}</td>
            <td>${usuario.departamento}</td>
            <td>${usuario.ciudad}</td>
            <td>${usuario.fechaNacimiento}</td>
            <td>${usuario.fotoURL ? `<img src="${usuario.fotoURL}" alt="Foto" width="50">` : "No disponible"}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

// Buscar usuario por cédula
function buscarPorCedula() {
    let cedula = document.getElementById("buscarCedula").value;
    let usuario = usuarios.find(u => u.cedula === cedula);
    if (usuario) {
        mostrarUsuariosFiltrados([usuario]); // Mostrar solo el usuario encontrado
        resaltarUsuario(usuario.cedula); // Resaltar la fila
    } else {
        alert("Usuario no encontrado.");
        mostrarUsuarios(); // Mostrar todos los usuarios si no se encuentra
    }
}

// Buscar usuario por nombre
function buscarPorNombre() {
    let nombre = document.getElementById("buscarNombre").value;
    let usuario = usuarios.find(u => u.nombre === nombre);
    if (usuario) {
        mostrarUsuariosFiltrados([usuario]); // Mostrar solo el usuario encontrado
        resaltarUsuario(usuario.cedula); // Resaltar la fila
    } else {
        alert("Usuario no encontrado.");
        mostrarUsuarios(); // Mostrar todos los usuarios si no se encuentra
    }
}

// Resaltar usuario en la tabla
function resaltarUsuario(cedula) {
    const rows = document.querySelectorAll("#userTableBody tr");
    rows.forEach(row => {
        if (row.cells[1].textContent === cedula) {
            row.style.backgroundColor = "#ffeb3b"; // Color de fondo para resaltar
        } else {
            row.style.backgroundColor = ""; // Restablecer color de fondo para otros usuarios
        }
    });
}


// Editar usuario
// Buscar usuario por ID
function buscarPorID() {
    let id = document.getElementById("buscarID").value;
    let usuario = usuarios.find(u => u.cedula === id); // Cambiar 'cedula' por el campo que usas como ID
    if (usuario) {
        mostrarFormularioEdicion(usuario); // Función para mostrar el formulario de edición
    } else {
        alert("Usuario no encontrado.");
    }
}

// Mostrar el formulario de edición
function mostrarFormularioEdicion(usuario) {
    // Crear un formulario de edición y mostrarlo
    let formularioEdicion = `<div>
        <h2>Editar Usuario</h2>
        <label for="editNombre">Nombre:</label>
        <input type="text" id="editNombre" value="${usuario.nombre}" required>
        <br>
        <label for="editCedula">Cédula:</label>
        <input type="text" id="editCedula" value="${usuario.cedula}" required readonly>
        <br>
        <label for="editEdad">Edad:</label>
        <input type="number" id="editEdad" value="${usuario.edad}" required>
        <br>
         <label for="editFechaNacimiento">Fecha de Nacimiento:</label>
        <input type="date" id="editFechaNacimiento" value="${usuario.fechaNacimiento}" required>
        <br>
        <label for="editCelular">Celular:</label>
        <input type="text" id="editCelular" value="${usuario.celular}" required>
        <br>
        <label for="editTelefono">Teléfono:</label>
        <input type="text" id="editTelefono" value="${usuario.telefono}">
        <br>
        <label for="editEmail">Email:</label>
        <input type="email" id="editEmail" value="${usuario.email}" required>
        <br>
        <label for="editDepartamento">Departamento:</label>
        <select id="editDepartamento" required>
            <option value="${usuario.departamento}">${usuario.departamento}</option>
            <option value="Cundinamarca">Cundinamarca</option>
            <option value="Antioquia">Antioquia</option>
            <option value="Valle del Cauca">Valle del Cauca</option>
        </select>
        <br>
        <label for="editCiudad">Ciudad:</label>
        <input type="text" id="editCiudad" value="${usuario.ciudad}" required>
        <br>
        <button onclick="guardarEdicion('${usuario.cedula}')">Guardar Cambios</button>
    </div>`;
    
    // Mostrar el formulario en un modal o en un div específico
    document.getElementById("userTableBody").innerHTML = formularioEdicion; // Para propósitos de visualización, aquí solo lo agrego a la tabla, puedes cambiar esto
}

// Guardar los cambios en el usuario
function guardarEdicion(cedula) {
    let usuario = usuarios.find(u => u.cedula === cedula);
    if (usuario) {
        usuario.nombre = document.getElementById("editNombre").value;
        usuario.edad = document.getElementById("editEdad").value;
        usuario.celular = document.getElementById("editCelular").value;
        usuario.telefono = document.getElementById("editTelefono").value;
        usuario.email = document.getElementById("editEmail").value;
        usuario.departamento = document.getElementById("editDepartamento").value;
        usuario.ciudad = document.getElementById("editCiudad").value;

        // Actualizar el localStorage
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        // Mostrar la tabla actualizada
        mostrarUsuarios();
    }
}


// Borrar usuario
function borrarUsuario() {
    let id = document.getElementById("borrarID").value.trim(); // Cambia a "borrarID"
    if (!id) {
        alert("Por favor, ingresa un ID válido.");
        return;
    }

    // Verificar si el usuario existe
    const usuarioExistente = usuarios.find(u => u.cedula === id);
    if (!usuarioExistente) {
        alert("Usuario no encontrado.");
        return;
    }

    // Eliminar el usuario
    usuarios = usuarios.filter(u => u.cedula !== id);
    
    // Actualizar localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    mostrarUsuarios();
    alert("Usuario borrado con éxito.");
}





// Filtrar usuarios por ciudad y/o departamento
function filtrarUsuarios() {
    const departamentoFiltro = document.getElementById("filtroDepartamento").value;
    const ciudadFiltro = document.getElementById("filtroCiudad").value;

    // Filtrar usuarios según los criterios
    let usuariosFiltrados = usuarios.filter(usuario => {
        const filtraPorDepartamento = departamentoFiltro ? usuario.departamento === departamentoFiltro : true;
        const filtraPorCiudad = ciudadFiltro ? usuario.ciudad === ciudadFiltro : true;
        
        // Retorna true solo si el usuario coincide con ambos filtros o con el que esté seleccionado
        return filtraPorDepartamento && filtraPorCiudad;
    });

    mostrarUsuariosFiltrados(usuariosFiltrados); // Mostrar los resultados filtrados
}

// Mostrar los usuarios filtrados en la tabla
function mostrarUsuariosFiltrados(usuariosFiltrados) {
    let tbody = document.getElementById("userTableBody");
    tbody.innerHTML = "";

    usuariosFiltrados.forEach((usuario, index) => {
        let row = `<tr>
            <td>${usuario.nombre}</td>
            <td>${usuario.cedula}</td>
            <td>${usuario.edad}</td>
            <td>${usuario.celular}</td>
            <td>${usuario.telefono}</td>
            <td>${usuario.email}</td>
            <td>${usuario.departamento}</td>
            <td>${usuario.ciudad}</td>
            <td>${usuario.fechaNacimiento}</td>
            <td>${usuario.fotoURL ? `<img src="${usuario.fotoURL}" alt="Foto" width="50">` : "No disponible"}</td>
            <td>
                <button onclick="editarUsuario('${usuario.cedula}')">Editar</button>
                <button onclick="borrarUsuario('${usuario.cedula}')">Borrar</button>
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

// Limpiar el formulario después de guardar o actualizar un usuario
function limpiarFormulario() {
    form.reset();
}

