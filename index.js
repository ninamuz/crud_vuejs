// "use strict";

// Componente LISTADO de productos
Vue.component('listaproductos', {
    props: ['listado', 'indice', 'producto'],
    template: /*html*/`
    <div>
    <div class="container p-3 my-3 bg-primary text-white">
    <label class="float-right"><input type="search" class="form-control mr-sm-2" placeholder="Buscar" v-model="filtro"></label>
    <h4>Administrar Productos</h4>
    </div>

    <table class="table">
    <tr>
        <th>Código</th>
        <th>Producto</th>
        <th>Categoría</th>
        <th>Stock</th>
        <th>Precio</th>
        <th colspan="2"> 
        <button @click="seleccionar(producto, indiceSeleccionado, 'agregar-producto')"
        type="button" class="btn btn-success btn-sm" data-toggle="button" aria-pressed="false" autocomplete="off">
    <i class="material-icons" >add_circle</i>
    </button></th>
    </tr>
    
    <tr v-for='(producto, indiceSeleccionado) of filtrado'
    :key ="producto.indice"
    :class="{seleccionado: indiceSeleccionado == indice}">
        <td>{{producto.codigo}}</td>
        <td>{{producto.nombre}}</td>
        <td>{{producto.categoria}}</td>
        <td>{{producto.stock}}</td>
        <td>\${{producto.precio}}</td>
        <!-- Botones para editar o eliminar que activan el componente correspondiente -->
        <td><button @click="seleccionar(producto, indiceSeleccionado, 'editar-producto')"
        type="button" class="btn btn-warning btn-sm" data-toggle="button" aria-pressed="false" autocomplete="off">
        <span class="material-icons">mode</span></button></td>
        <td><button @click="seleccionar(producto, indiceSeleccionado, 'eliminar-producto')"
        type="button" class="btn btn-danger btn-sm" data-toggle="button" aria-pressed="false" autocomplete="off">
        <span class="material-icons">delete</span></button></td>
    </tr>
    </table>
    </div>
    `,
    data() {
        return {
            filtro: "",
            indiceSeleccionado: undefined
        }
    },
    computed: {
        filtrado() {
            // El método filter() crea un nuevo array con todos los elementos que cumplan la condición implementada por la función dada.
            return this.listado.filter((producto) =>
                producto.nombre.toUpperCase().includes(this.filtro.toUpperCase()));
        }
    },
    methods: {
        // Este método selecciona y deselecciona
        seleccionar(producto, indiceSeleccionado, nuevaSeccion) {
            // $emit dispara un evento en la instancia actual y pasa a la seccion seleccionada
            if (nuevaSeccion) {
                this.$emit('seleccionado', producto, indiceSeleccionado, nuevaSeccion);
            } else {
                // Si el seleccionado es igual al indice lo deselecciona
                if (indiceSeleccionado == this.indice) {
                    this.$emit('deseleccionado');
                    // Si es diferente, lo selecciona    
                } else {
                    this.$emit('seleccionado', producto, indiceSeleccionado);
                }
            }
        },
    }
})

// Componente para AGREGAR nuevo producto
Vue.component('agregar-producto', {
    props: ['listado_entrada', 'opciones'],
    template: /*html*/`
    <div>
    <div class="container p-3 my-3 bg-primary text-white">
    <h4>Agregar Producto</h4>
    </div>
    <form @submit.prevent='agregar'>
    <div class="form-group">
    <label>Código</label>
    <div>
    <input type="text" class="form-control form-control-sm" v-model="codigo">
    </div>
    </div>
    <div class="form-group">
    <label>Nombre producto</label>
    <input type="text" class="form-control form-control-sm" maxlength="20" v-model="nombre" required>
    </div>
    <div class="form-group">
    <label>Categoría</label>
    <select v-model="categoria" class="form-control form-control-sm" required>
    <option disabled value="">Seleccione una categoría</option>
    <option v-for="opcion of opciones" :value="opcion.value">
    {{opcion.text}}</option>
    </select>
    </div>
    <div class="form-group">
    <label>Stock</label>
    <input type="number" min="0" max="99999" class="form-control form-control-sm" v-model.number="stock">
    </div>
    <div class="form-group">
    <label>Precio</label>
    <input type="number" min="0" max="99999" class="form-control form-control-sm" v-model.number="precio">
    </div>
    <!-- Mensajes de alerta y confirmación según sea el caso -->
    <!-- Antes de agregar -->
    <div v-if="estado==0">
    <p class="alert alert-warning">{{mensaje}}</p>
    <button :disabled="!sepuedeagregar" class="btn btn-info">Agregar</button>
    </div>
    <!-- Después de agregar -->
    <div v-else>
    <p class="alert alert-success">{{mensaje}}</p>
    <button @click="reset" class="btn btn-info">Agregar nuevo</button>
    </div>
    </form>
    </div>
    `,
    data() {
        return {
            codigo: "",
            nombre: "",
            categoria: "",
            stock: 0,
            precio: 1,
            estado: 0,
            mensaje: "Complete los campos para agregar un nuevo producto",
            // Prueba para agregar un número al azar al input 'codigo'
            // Agregar un ':value' y un v-model en el mismo elemento genera Error 
            // azar: "0" + Math.floor((Math.random() * (99 - 001 + 1)) + 1)
        };
    },
    computed: {
        sepuedeagregar() {
            return this.nombre.length >= 3;
        }
    },
    methods: {
        agregar() {
            this.listado_entrada.push({
                codigo: this.codigo,
                nombre: this.nombre,
                categoria: this.categoria,
                stock: this.stock,
                precio: this.precio
            })

            this.codigo = "",
                this.nombre = "",
                this.categoria = "",
                this.stock = 0,
                this.precio = 0
            this.estado = 1,
                this.mensaje = "Producto ingresado correctamente"
        },
        reset() {
            this.estado = 0
            this.mensaje = "Ingresando nuevo producto"
            // this.azar = "0" + Math.floor((Math.random() * (99 - 1 + 1)) + 1)
        },
    },
})

// Componente para EDITAR un producto
Vue.component('editar-producto', {
    props: ['producto', 'opciones'],
    template: /*html*/`
    <div>
    <div class="container p-3 my-3 bg-primary text-white">
    <h4>Editar Producto</h4>
    </div>
    <form @submit.prevent='editar'>
    <div class="form-group">
    <label>Código</label>
    <div>
    <input type="text" class="form-control form-control-sm" v-model="codigo">
    </div>
    </div>
    <div class="form-group">
    <label>Nombre producto</label>
    <input type="text" class="form-control form-control-sm" maxlength="20" v-model="nombre">
    </div>
    <div class="form-group">
    <label>Categoría</label>
    <select v-model="categoria" class="form-control form-control-sm" required>
    <option disabled value="">Seleccione una categoría</option>
    <option v-for="opcion of opciones" :value="opcion.value">
    {{opcion.text}}</option>
    </select>
    </div>
    <div class="form-group">
    <label>Stock</label>
    <input type="number" min="0" max="99999" class="form-control form-control-sm" v-model.number="stock">
    </div>
    <div class="form-group">
    <label>Precio</label>
    <input type="number" min="0" max="99999" class="form-control form-control-sm" v-model.number="precio">
    </div>
    <!-- Mensaje de confirmación después de haber editado -->
    <div v-if='producto'>
    <div class="alert alert-warning">Usted está editando un producto existente</div> 
    <button :disabled="!sepuedeagregar" @click="editar" class="btn btn-info">Grabar</button>
    </div>
    <div v-else>
    <p class="alert alert-success">{{mensajeConfirmacion}}</p>
    </div>
    </form>
    </div>
    `,
    data() {
        return {
            codigo: "",
            nombre: "",
            categoria: "",
            stock: 0,
            precio: 1,
            mensajeConfirmacion: ""
        };
    },
    // El watch nos avisa si ha cambiado algún parámetro del componente
    watch: {
        producto(nuevo, anterior) {
            if (nuevo) {
                this.codigo = nuevo.codigo,
                    this.nombre = nuevo.nombre,
                    this.categoria = nuevo.categoria,
                    this.stock = nuevo.stock,
                    this.precio = nuevo.precio
            } else {
                this.codigo = "";
                this.nombre = "";
                this.categoria = "";
                this.stock = 0;
                this.precio = 0;
            }
        }
    },
    // Funciona la primera vez que se muestra el componente
    mounted() {
            this.codigo = this.producto.codigo;
            this.nombre = this.producto.nombre;
            this.categoria = this.producto.categoria;
            this.stock = this.producto.stock;
            this.precio = this.producto.precio;
    },
    computed: {
        sepuedeagregar() {
            return this.nombre.length >= 3;
        }
    },
    // Función para agregar el producto modificado
    methods: {
        editar() {
            this.producto.codigo = this.codigo;
            this.producto.nombre = this.nombre;
            this.producto.categoria = this.categoria;
            this.producto.stock = this.stock;
            this.producto.precio = this.precio;
            this.$emit('deseleccionado')
            this.mensajeConfirmacion = "Edición ingresada"
        }
    }
})

// Componente para ELIMINAR un producto
Vue.component('eliminar-producto', {
    props: ['productos', 'producto', 'listado', 'indice', 'opciones'],
    template: /*html*/`
    <div>
    <div class="container p-3 my-3 bg-primary text-white">
    <h4>Eliminar Producto</h4>
    </div>
    <form @submit.prevent='eliminar'>
    <div class="form-group">
    <label>Código</label>
    <input type="number" class="form-control form-control-sm" maxlength="20" v-model="codigo" disabled>
    </div>
    <div class="form-group">
    <label>Nombre producto</label>
    <input type="text" class="form-control form-control-sm" maxlength="20" v-model="nombre" disabled>
    </div>
    <div class="form-group">
    <label>Categoría</label>
    <select v-model="categoria" class="form-control form-control-sm" disabled>
    <option v-for="opcion of opciones" :value="opcion.value">
    {{opcion.text}}
    </option>
    </select>
    </div>
    <div class="form-group">
    <label>Stock</label>
    <input type="number" min="1" max="99999" class="form-control form-control-sm" v-model.number="stock" disabled>
    </div>
    <div class="form-group">
    <label>Precio</label>
    <input type="number" min="1" max="99999" class="form-control form-control-sm" v-model.number="precio" disabled>
    </div>
    <!-- Bloque de código que se muestra antes o después de la eliminación -->
    <div v-if='producto'>
    <div class="alert alert-danger">Confirme eliminación del producto {{producto.nombre}}</div> 
    <button class="btn btn-danger">Eliminar</button>
    </div>
    <div v-else>
    <p class="alert alert-success">{{mensajeConfirmacion}}</p>
    </div>
    </form>
    </div>
    `,
    data() {
        return {
            codigo: "",
            nombre: "",
            categoria: "",
            stock: 0,
            precio: 1,
            mensajeConfirmacion: ""
        }
    },
    // El watch nos avisa si ha cambiado algún parámetro del componente
    // No funciona la primera vez que se muestra el componente
    watch: {
        producto(nuevo, anterior) {
            if (nuevo) {
                this.codigo = nuevo.codigo,
                    this.nombre = nuevo.nombre,
                    this.categoria = nuevo.categoria,
                    this.stock = nuevo.stock,
                    this.precio = nuevo.precio
            // Después de la eliminación se muestran estos datos en el formulario
            } else {
                this.codigo = "";
                this.nombre = "";
                this.categoria = "";
                this.stock = 0;
                this.precio = 0;
            }
        }
    },
    mounted() { // Funciona la primera vez que se muestra el componente
        this.codigo = this.producto.codigo;
        this.nombre = this.producto.nombre;
        this.categoria = this.producto.categoria;
        this.stock = this.producto.stock;
        this.precio = this.producto.precio;
    },
    methods: {
        eliminar() {
            if (this.indice > -1) {
                this.listado.splice(this.indice, 1);
                this.$emit('deseleccionado')
                this.mensajeConfirmacion = "Producto eliminado"
            }
        }
    },
})

// la APP
let app = new Vue({
    el: "#app",
    data: {
        componenteActivo: 'listaproductos',
        productos: [
            {
                codigo: "0015",
                nombre: "Avena Quaker",
                categoria: "Cereales",
                stock: 49,
                precio: 2000
            },
            {
                codigo: "004",
                nombre: "Queso Edén",
                categoria: "Lácteos",
                stock: 30,
                precio: 1500
            },
            {
                codigo: "009",
                nombre: "Coliflor",
                categoria: "Verduras",
                stock: 15,
                precio: 1200
            },
            {
                codigo: "005",
                nombre: "Kiwi",
                categoria: "Frutas",
                stock: 20,
                precio: 1800
            },
        ],
        opciones: [
            { text: 'Abarrotes', value: 'Abarrotes' },
            { text: 'Bebestibles', value: 'Bebestibles' },
            { text: 'Carnes', value: 'Carnes' },
            { text: 'Cereales', value: 'Cereales' },
            { text: 'Frutas', value: 'Frutas' },
            { text: 'Panadería', value: 'Panadería' },
            { text: 'Verduras', value: 'Verduras' },
            { text: 'Lácteos', value: 'Lácteos' },
        ],
        secciones: [
            {
                componente: "agregar-producto",
                titulo: "Agregar"
            },
            {
                componente: "editar-producto",
                titulo: "Editar"
            },
            {
                componente: "eliminar-producto",
                titulo: "Eliminar"
            },
        ],
        seccionActual: undefined,
        producto: undefined,
        indice: -1,
        listado: this.productos
    },
    methods: {
        capturarSeleccionado(producto, indice, nuevaSeccion) {
            this.producto = producto;
            this.indice = indice;
            if (nuevaSeccion) {
                // Para buscar el índice en el arreglo
                let indice = this.secciones.findIndex(seccion => seccion.componente == nuevaSeccion);
                this.seccionActual = nuevaSeccion;
                if (indice > -1) {
                    this.seccionActual = this.secciones[indice];
                }
            }
        },
        quitarSeleccion() {
            this.indice = -1;
            this.producto = undefined;
        },
        cambiarSeccion(seccion) {
            this.seccionActual = seccion;
        }
    },
    mounted() {
        this.seccionActual = this.secciones[0];
    },
})

