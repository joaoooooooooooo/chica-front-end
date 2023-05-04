import * as THREE from 'three';
import vertexShader from './shaders/vertexShader.glsl';
import fragmentShader from './shaders/fragmentShader.glsl';

const wraps = [...document.querySelectorAll('.wrap')];
const menuTog = document.querySelector('.menu-tog');
const menu = document.querySelector('.menu');
const menuWraps = [...document.querySelectorAll('.menu-wrap')];
let scrollable = document.querySelector('.scrollable');


// http://localhost:1337/api/no-sofas

const root = document.querySelector('html')

// Real cursor element
const cursor = document.createElement('div')
cursor.classList.add('cursor')
root.appendChild(cursor)

// Following extra cursor element
const follower = document.createElement('div')
follower.classList.add('cursor', 'cursor__follower')
root.appendChild(follower)


root.addEventListener('mousemove', (e) => {
    setPosition(follower, e)
    setPosition(cursor, e)
})

function setPosition(element, e) {
    element.style.transform = `translate3d(${e.clientX - 14}px, ${e.clientY - 17}px, 0)`
}



document.querySelectorAll("a").forEach((link) => {
    link.addEventListener("mouseenter", () => {
        cursor.classList.add("active");
    });
    link.addEventListener("mouseleave", () => {
        cursor.classList.remove("active");
    });
});
document.querySelectorAll(".menu-tog").forEach((link) => {
    link.addEventListener("mouseenter", () => {
        cursor.classList.add("active");
    });
    link.addEventListener("mouseleave", () => {
        cursor.classList.remove("active");
    });
});
fetch(' https://strapi-rpjc.onrender.com/api/no-sofas?populate=%2A')
    .then(response => response.json())
    .then(data => {
        // print the data object to the console  galerryimage
        data.data.forEach(item => {
            const imageContainer = document.createElement('div');
            imageContainer.className = 'image-container';

            // create image element
            const attributes = item.attributes;
            const imageUrl = attributes.fotos.data[0].attributes.url;
            const imgElement = document.createElement('img');
            imgElement.className = 'galerryimage';
            imgElement.src = imageUrl;


            // append image to image container div
            imageContainer.appendChild(imgElement);

            // create text element
            const textElement = document.createElement('h1');

            textElement.innerText = `${attributes.pessoa}`;

            // append text element to image container div
            imageContainer.appendChild(textElement);

            // append image container to main container
            const mainContainer = document.getElementById('container');
            mainContainer.appendChild(imageContainer);
        });
    });
const apiUrl = 'https://strapi-rpjc.onrender.com/api/ensaios?populate=%2A';

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        console.log(data); // print the data object to the console
        data.data.forEach(item => {
            const description = document.createElement('div');
            description.className = 'description';
            const line = document.createElement('div')
            const parentContainer = document.createElement('div');
            parentContainer.className = 'containerE';
            const imageContainer = document.createElement('div');
            imageContainer.className = 'image-containerE';

            // create image elements
            const attributes = item.attributes;
            const imageUrls = attributes.fotos.data.map(foto => foto.attributes.url);
            for (let i = 0; i < 4 && i < imageUrls.length; i++) {
                const imgElement = document.createElement('img');
                imgElement.className = 'galerryimageE';
                imgElement.src = imageUrls[i];
                imageContainer.appendChild(imgElement);

            }

            // create text element
            const verEnsaio = document.createElement('a');
            verEnsaio.className = 'ver-ensaio';
            verEnsaio.innerText = 'Ver ensaio completo';
            const textElement = document.createElement('h2');
            textElement.innerText = `${attributes.nome}`;
            textElement.className = 'title';

            // append text element to image container div
            description.appendChild(textElement);


            // append image container to main container
            parentContainer.appendChild(description);
            description.appendChild(verEnsaio)
            parentContainer.appendChild(imageContainer);
            const mainContainer = document.getElementById('scrollableE');
            mainContainer.appendChild(parentContainer);

            // add event listener to item container
            parentContainer.addEventListener('click', () => {
                const itemId = item.id;
                window.location.href = `marcar.html?id=${itemId}`;
            });
        });
    });





// retrieve id parameter from URL query
const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get('id');

// fetch item data using itemId



fetch(`https://strapi-rpjc.onrender.com/api/ensaios/${itemId}?populate=%2A`)
    .then(response => response.json())
    .then(data => {
        console.log(data); // print the data object to the console
        const item = data.data;

        // create elements for the item
        const description = document.createElement('div');
        description.className = 'descriptionA';
        const parentContainer = document.createElement('div');
        parentContainer.className = 'containerA';
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-containerA';

        // create image elements
        const attributes = item.attributes;
        const imageUrls = attributes.fotos.data.map(foto => foto.attributes.url);
        imageUrls.forEach(imageUrl => {
            const imgElement = document.createElement('img');
            imgElement.className = 'galerryimageA';
            imgElement.src = imageUrl;
            imageContainer.appendChild(imgElement);
        });

        // create text element
        const textElement = document.createElement('h2');
        textElement.innerText = `${attributes.nome}`;
        textElement.className = 'title';
        const textElement2 = document.createElement('p');
        textElement2.innerText = `${attributes.texto}`;
        textElement2.className = 'text';

        // append text element to image container div
        description.appendChild(textElement);
        description.appendChild(textElement2);

        // append image container to main container
        parentContainer.appendChild(description);
        parentContainer.appendChild(imageContainer);
        const mainContainer = document.getElementById('scrollableEE');
        mainContainer.appendChild(parentContainer);
    });

let current = 0.1;
let target = 0;
let isMobile = /iPhone|iPod|Android/i.test(navigator.userAgent);
let ease = isMobile ? 0.08 : 0.075;

// Linear inetepolation used for smooth scrolling and image offset uniform adjustment

function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

// init function triggered on page load to set the body height to enable scrolling and EffectCanvas initialised
function init() {
    document.body.style.height = `${scrollable.getBoundingClientRect().height}px`;
}

// translate the scrollable div using the lerp function for the smooth scrolling effect.
function smoothScroll() {
    target = window.scrollY;
    current = lerp(current, target, ease);
    scrollable.style.transform = `translate3d(0,${-current}px, 0)`;
}

class EffectCanvas {


    constructor() {
        this.container = document.querySelector('main');
        this.images = [...document.getElementsByClassName('galerryimage')];
        this.meshItems = []; // Used to store all meshes we will be creating.
        this.setupCamera();
        this.createMeshItems();
        this.render()
    }

    // Getter function used to get screen dimensions used for the camera and mesh materials
    get viewport() {
        let width = window.innerWidth;
        let height = window.innerHeight;
        let aspectRatio = width / height;
        return {
            width,
            height,
            aspectRatio
        };
    }

    setupCamera() {

        document.addEventListener('load', this.onDocumentLoad.bind(this), true);
        document.addEventListener('resize', this.onDocumentResize.bind(this), false);

        // Create new scene
        this.scene = new THREE.Scene();

        // Initialize perspective camera

        let perspective = 1000;
        const fov = (180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI; // see fov image for a picture breakdown of this fov setting.
        this.camera = new THREE.PerspectiveCamera(fov, this.viewport.aspectRatio, 1, 1000)
        this.camera.position.set(0, 0, perspective); // set the camera position on the z axis.

        // renderer
        // this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer = new THREE.WebGL1Renderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.viewport.width, this.viewport.height); // uses the getter viewport function above to set size of canvas / renderer
        this.renderer.setPixelRatio(window.devicePixelRatio); // Import to ensure image textures do not appear blurred.
        this.container.appendChild(this.renderer.domElement); // append the canvas to the main element
    }

    onDocumentLoad() {
        init();
        this.camera.aspect = this.viewport.aspectRatio; // readjust the aspect ratio.
        this.camera.updateProjectionMatrix(); // Used to recalulate projectin dimensions.
        this.renderer.setSize(this.viewport.width, this.viewport.height);
    }
    onDocumentResize() {
        init();
        this.camera.aspect = this.viewport.aspectRatio; // readjust the aspect ratio.
        this.camera.updateProjectionMatrix(); // Used to recalulate projectin dimensions.
        this.renderer.setSize(this.viewport.width, this.viewport.height);
    }

    createMeshItems() {
        // Loop thorugh all images and create new MeshItem instances. Push these instances to the meshItems array.
        this.images.forEach(image => {
            let meshItem = new MeshItem(image, this.scene);
            this.meshItems.push(meshItem);
        })
    }

    // Animate smoothscroll and meshes. Repeatedly called using requestanimationdrame
    render() {
        smoothScroll();
        for (let i = 0; i < this.meshItems.length; i++) {
            this.meshItems[i].render();
        }
        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(this.render.bind(this));
    }
}

class MeshItem {
    // Pass in the scene as we will be adding meshes to this scene.
    constructor(element, scene) {
        this.element = element;
        this.scene = scene;
        this.offset = new THREE.Vector2(0, 0); // Positions of mesh on screen. Will be updated below.
        this.sizes = new THREE.Vector2(0, 0); //Size of mesh on screen. Will be updated below.
        this.createMesh();
    }

    getDimensions() {
        const { width, height, top, left } = this.element.getBoundingClientRect();
        this.sizes.set(width, height);
        this.offset.set(left - window.innerWidth / 2 + width / 2, -top + window.innerHeight / 2 - height / 2);
    }

    createMesh() {
        this.geometry = new THREE.PlaneBufferGeometry(1, 1, 100, 100);
        this.imageTexture = new THREE.TextureLoader().load(this.element.src);
        this.uniforms = {
            uTexture: {
                //texture data
                value: this.imageTexture
            },
            uOffset: {
                //distortion strength
                value: new THREE.Vector2(0.0, 0.0)
            },
            uAlpha: {
                //opacity
                value: 1.
            }
        };
        this.material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            // wireframe: true,
            side: THREE.DoubleSide
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.getDimensions(); // set offsetand sizes for placement on the scene
        this.mesh.position.set(this.offset.x, this.offset.y, 0);
        this.mesh.scale.set(this.sizes.x, this.sizes.y, 1);

        this.scene.add(this.mesh);
    }

    render() {
        // this function is repeatidly called for each instance in the aboce 
        this.getDimensions();
        this.mesh.position.set(this.offset.x, this.offset.y, 0)
        this.mesh.scale.set(this.sizes.x, this.sizes.y, 1)
        this.uniforms.uOffset.value.set(this.offset.x * 0.0, -(target - current) * 0.0001)
    }
}

init()
new EffectCanvas()


menuTog.addEventListener('click', toggleMenu)

function displayWraps() {
    wraps.forEach((wrap, idx) => {
        setTimeout(() => {
            wrap.classList.add('active');
        }, (idx + 1) * 50)
    })
}

function toggleMenu() {
    if (menu.classList.contains('active')) {
        menuTog.classList.remove('active');
        toggleMenuWraps(false);
        setTimeout(() => {
            menu.classList.remove('active')
        }, 300)
        setTimeout(() => {
            toggleWraps(true);
        }, 300)
    } else {
        menuTog.classList.add('active');
        toggleWraps(false);
        setTimeout(() => {
            menu.classList.add('active')
        }, 300)
        setTimeout(() => {
            toggleMenuWraps(true);
        }, 300)
    }
}

function toggleWraps(active) {
    wraps.forEach(wrap => {
        toggleWrap(wrap, active);
    })
}

function toggleMenuWraps(active) {
    menuWraps.forEach(wrap => {
        toggleWrap(wrap, active);
    })
}

function toggleWrap(wrap, active) {
    setTimeout(() => {
        if (active) {
            wrap.classList.add('active');
        } else {
            wrap.classList.remove('active');
        }
    })
}






displayWraps()

