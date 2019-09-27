//variables globales
var db;
var not = "Notas";
var mat = "Materias";
var alm = "Alumnos";
var pro = "Profesores";
var esc = "Escuelas";
var cur = "Cursos";
var emailProfesor = "josemonzon99@gmail.com";
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
var app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'GABY',
  // App id
  id: 'com.myapp.test',
  // View
  view: {
    pushState: true,
  },
  // Enable swipe panel
  panel: {
    swipe: 'left',
  },
  // Add default routes
  routes: [
    {
      path: '/iniciar/',
      url: 'iniciarsesion.html',
    },
    {
      path: '/registrar/',
      url: 'registro.html',
    },
    {
      path: '/buscar/',
      url: 'buscar.html',
    },
    {
      path: '/agregarAlumno/',
      url: 'agregarAlumno.html',
    },
    {
      path: '/agregarEscuela/',
      url: 'agregarEscuela.html',
    },
    {
      path: '/agregarCurso/',
      url: 'agregarCurso.html',
    },
    {
      path: '/agregarMateria/',
      url: 'agregarMateria.html',
    },
  ]
  // ... other parameters
});

var mainView = app.views.create('.view-main');
// document.addEventListener("backbutton", onBackKeyDown, false);
// function onBackKeyDown() {
//   switch (mainView.router.url) {
//     case "/":

//         break;
//     default:
//         mainView.router.back();
//   }
// }
//Crea un toast y lo muestra
function crearToast(texto) {
  var toastBottom = app.toast.create({
    text: texto,
    closeTimeout: 2000,
  });
  toastBottom.open();
}

function crearUser() {
  var email = $$("#nombreRegistro").val();
  var password = $$("#contrasenaRegistro").val().toString();
  console.log("contraseña " + password);
  console.log("email " + email);
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(function (user) {
      console.log(user);
      app.dialog.alert("Se creo el usuario");
      mainView.router.navigate("/iniciar/");
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode == 'auth/weak-password') {
        app.dialog.alert('Clave muy débil.');
      } else {
        app.dialog.alert(errorMessage);
      }
      console.log(error);
    });
}

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
  console.log("Device is ready!");
  //Firebase configs
  var firebaseConfig = {
    apiKey: "AIzaSyBj6BPosJF0D4v9bExt2kg7Frtv2TRJXrg",
    authDomain: "gabylibrodecalificaciones.firebaseapp.com",
    databaseURL: "https://gabylibrodecalificaciones.firebaseio.com",
    projectId: "gabylibrodecalificaciones",
    storageBucket: "gabylibrodecalificaciones.appspot.com",
    messagingSenderId: "503297845087",
    appId: "1:503297845087:web:4777ee0c80e8f32378f8ea"
  };
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
});
// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
  //Swiper de la pagina principal
  var swiper = app.swiper.create('.swiper-container', {
    speed: 400,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    slidesPerView: 1,
    centeredSlides: true,
  });
  console.log(e);
})

$$(document).on('page:init', '.page[data-name="iniciarsesion"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  console.log("Lo ejecuta");
  //Verifica si existe el usuario
  $$("#iniciarSesion").on('click', function () {
    var formInicio = app.form.convertToData('#formIniciarSesion');
    firebase.auth().signInWithEmailAndPassword(formInicio.email, formInicio.password.toString())
      .then(function () {
        crearToast("Te loggeaste bien :D");
        mainView.router.navigate("/buscar/");
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        crearToast(errorMessage);
      });
  });
})

$$(document).on('page:init', '.page[data-name="agregarEscuela"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  console.log("agregar escuela");
  //Agregar escuelas
  $$("#agregarEscuela").on('click', function () {
    var formAgregarEscuela = app.form.convertToData('#formAgregarEscuela');
    db.collection(pro).doc(emailProfesor).collection(esc).doc(formAgregarEscuela.nombre).set({
      direccion: formAgregarEscuela.direccion,
    })
      .then(function (docRef) {
        console.log("ok");
      })
      .catch(function (error) {
        console.log("Error: " + error);
      });
  });
})


$$(document).on('page:init', '.page[data-name="agregarCurso"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  //Variables
  var escuelasArray = [];
  //Base de datos consultas
  var escuelasRef = db.collection(pro).doc(emailProfesor).collection(esc);
  escuelasRef.get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        escuelasArray.push(doc.id);
      })
    })
  //Picker Escuelas
  pickerEscuelaAgregarCurso = app.picker.create({
    inputEl: '#pickerEscuelas',
    cols: [
      {
        textAlign: 'center',
        values: escuelasArray
      }
    ],
  });
  $$("#agregarCurso").on('click', function () {
    var formAgregarCurso = app.form.convertToData('#formAgregarCurso');
    db.collection(pro).doc(emailProfesor).collection(esc).doc(formAgregarCurso.escuela).collection(cur).doc(formAgregarCurso.nombre).set({
    })
      .then(function (docRef) {
        console.log("ok");
      })
      .catch(function (error) {
        console.log("Error: " + error);
      });

  });
})


$$(document).on('page:init', '.page[data-name="agregarAlumno"]', async function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  //Picker default
  var pickerCursos = app.picker.create();
  //Variables
  var escuelasArray = [];
  var cursosArray = [];
  //Calendario
  var calendarDefault = app.calendar.create({
    inputEl: '#fechaDeNacimientoAlumno',
  });
  //Query del picker
  await db.collection(pro).doc(emailProfesor).collection(esc).get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        escuelasArray.push(doc.id);
      })
    })
  //Picker
  var pickerEscuela = app.picker.create({
    inputEl: '#demo-picker-device',
    cols: [
      {
        textAlign: 'center',
        values: escuelasArray,
      }
    ],
    on: {
      closed: async function () {
        var formAgregarAlumno = app.form.convertToData('#formAgregarAlumno');
        await db.collection(pro).doc(emailProfesor).collection(esc).doc(formAgregarAlumno.escuela).collection(cur).get()
          .then(function (querySnapshot) {
            cursosArray.splice(0, cursosArray.length);
            querySnapshot.forEach(function (doc) {
              console.log("skere");
              cursosArray.push(doc.id);
            })
          })
        if (pickerCursos.destroyed) {
          pickerCursos = app.picker.create({
            updateValuesOnMomentum: true,
            inputEl: '#pickerCurso',
            cols: [
              {
                textAlign: 'center',
                values: cursosArray,
              }
            ],
          });
        }
      },
      change: function () {
        $$("#pickerCurso").val("");
        pickerCursos.destroy();
      }
    }
  });
  // Agregar alumno boton
  $$("#agregarAlumno").on("click", function () {
    var formAgregarAlumno = app.form.convertToData('#formAgregarAlumno');
    db.collection(pro).doc(emailProfesor).collection(esc).doc(formAgregarAlumno.escuela).collection(cur).doc(formAgregarAlumno.curso).collection(alm).doc(formAgregarAlumno.dni).set({
      nombre: formAgregarAlumno.nombre,
      apellido: formAgregarAlumno.apellido,
      escuela: formAgregarAlumno.escuela,
      curso: formAgregarAlumno.curso,
      nacimiento: formAgregarAlumno.fecha,
    })
      .then(function (docRef) {
        console.log("ok");
      })
      .catch(function (error) {
        console.log("Error: " + error);
      });
  });



})
$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
})

$$(document).on('page:init', '.page[data-name="agregarMateria"]', async function (e) {
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  //Picker default
  var pickerCursosMateria = app.picker.create();
  //variables
  var escuelasArray = [];
  var cursosArray = [];
  //Query del picker
  await db.collection(pro).doc(emailProfesor).collection(esc).get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        escuelasArray.push(doc.id);
      })
    })
  //Picker
  var pickerEscuelaMateria = app.picker.create({
    inputEl: '#pickerEscuelaMateria',
    cols: [
      {
        textAlign: 'center',
        values: escuelasArray,
      }
    ],
    on: {
      closed: async function () {
        var formAgregarMateria = app.form.convertToData('#formAgregarMateria');
        await db.collection(pro).doc(emailProfesor).collection(esc).doc(formAgregarMateria.escuela).collection(cur).get()
          .then(function (querySnapshot) {
            cursosArray.splice(0, cursosArray.length);
            querySnapshot.forEach(function (doc) {
              cursosArray.push(doc.id);
            })
          })
        if (pickerCursosMateria.destroyed) {
          pickerCursosMateria = app.picker.create({
            updateValuesOnMomentum: true,
            inputEl: '#pickerCursoMateria',
            cols: [
              {
                textAlign: 'center',
                values: cursosArray,
              }
            ],
          });
        }
      },
      change: function () {
        $$("#pickerCurso").val("");
        pickerCursosMateria.destroy();
      }
    }
  });


  // Agregar materia
  $$("#agregarMateria").on("click", function () {
    var formAgregarMateria = app.form.convertToData('#formAgregarMateria');
    db.collection(pro).doc(emailProfesor).collection(esc).doc(formAgregarMateria.escuela).collection(cur).doc(formAgregarMateria.curso).collection(mat).doc(formAgregarMateria.nombre).set({
    })
      .then(function (docRef) {
        console.log("ok");
      })
      .catch(function (error) {
        console.log("Error: " + error);
      });
  })
})



$$(document).on('page:init', '.page[data-name="buscar"]', async function (e) {
  var dni;
  var pickerCursosDefinir = app.picker.create();
  var pickerMateriasDefinir = app.picker.create();
  var escuelasArrayDefinir = [];
  var cursosArrayDefinir = [];
  var materiasArrayDefinir = [];
  $$('.open-more-actions').on('click', function () {
    console.log($$(this).attr("dni"));
  });
  $$('.swipeout-delete').on('click', function () {
    dni = $$(this).attr("dni");
    console.log("lo asigna");
  });
  $$('.deleted-callback').on('swipeout:deleted', function () {
    console.log("lo borra");
    app.dialog.alert('Se ha eliminado el alumno con el dni: ' + dni);
    dni = "";
  });
  // Barra de busqueda
  var searchbar = app.searchbar.create({
    el: '.searchbar',
    searchContainer: '.buscarAca',
    searchIn: '.item-title',
    on: {
      search(sb, query, previousQuery) {
      }
    }
  });
  // Do something here when page with data-name="about" attribute loaded and initialized
  console.log(e);
  // Cambia el placeholder dependiendo de en que pestaña este
  $$("#buscar .tab-link").on("click", function () {
    $$("#buscarCampo").attr("placeholder", "Buscar " + $$("#buscar .tab-link-active").attr("name"));
  });
  // Mueve el tabbar abajo y lo oculta
  $$(".esconderNav").on("click", function () {
    $$("#searchBarBuscar").addClass("toolbar-bottom-md");
  });
  // Mueve el tabbar arriba y lo muestra
  $$(".mostrarNav").on("click", function () {
    $$("#searchBarBuscar").removeClass("toolbar-bottom-md");
  });
  // Definir
  //Query del picker
  await db.collection(pro).doc(emailProfesor).collection(esc).get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        escuelasArrayDefinir.push(doc.id);
      })
    })
  //Picker
  var pickerEscuela = app.picker.create({
    inputEl: '#pickerDefinirEscuela',
    cols: [
      {
        textAlign: 'center',
        values: escuelasArrayDefinir,
      }
    ],
    on: {
      closed: async function () {
        var formDefinir = app.form.convertToData('#formDefinir');
        await db.collection(pro).doc(emailProfesor).collection(esc).doc(formDefinir.escuela).collection(cur).get()
          .then(function (querySnapshot) {
            cursosArrayDefinir.splice(0, cursosArrayDefinir.length);
            querySnapshot.forEach(function (doc) {
              console.log("skere");
              cursosArrayDefinir.push(doc.id);
            })
          })
        if (pickerCursosDefinir.destroyed) {
          pickerCursosDefinir = app.picker.create({
            updateValuesOnMomentum: true,
            inputEl: '#pickerDefinirCurso',
            cols: [
              {
                textAlign: 'center',
                values: cursosArrayDefinir,
              }
            ],
            on: {
              closed: async function () {
                var formDefinir = app.form.convertToData('#formDefinir');
                await db.collection(pro).doc(emailProfesor).collection(esc).doc(formDefinir.escuela).collection(cur).doc(formDefinir.curso).collection(mat).get()
                  .then(function (querySnapshot) {
                    materiasArrayDefinir.splice(0, materiasArrayDefinir.length);
                    querySnapshot.forEach(function (doc) {
                      console.log("skere");
                      materiasArrayDefinir.push(doc.id);
                    })
                  })
                if (pickerMateriasDefinir.destroyed) {
                  pickerMateriasDefinir = app.picker.create({
                    inputEl: '#pickerDefinirMateria',
                    cols: [
                      {
                        textAlign: 'center',
                        values: materiasArrayDefinir,
                      }
                    ]
                  });
                }

              },
              change: function () {
                $$("#pickerDefinirMateria").val("");
                pickerMateriasDefinir.destroy();
              }
            },
          });
        }
      },
      change: function () {
        $$("#pickerDefinirCurso").val("");
        $$("#pickerDefinirMateria").val("");
        pickerCursosDefinir.destroy();
        pickerMateriasDefinir.destroy();
      }
    }
  });


  // Boton definir
  $$("#definirNota").on('click', function () {
    var formDefinir = app.form.convertToData('#formDefinir');
    db.collection(pro).doc(emailProfesor).collection(esc).doc(formDefinir.escuela).collection(cur).doc(formDefinir.curso).collection(mat).doc(formDefinir.materia).collection(not).add({
      dni: formDefinir.dni,
      nota: formDefinir.nota,
    })
      .then(function (docRef) {
        console.log("ok");
      })
      .catch(function (error) {
        console.log("Error: " + error);
      });
  })





})