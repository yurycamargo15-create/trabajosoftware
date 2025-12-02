const productGrid = document.getElementById('product-grid');
const searchInput = document.getElementById('search');

function formatPrice(p){ return '$' + p.toFixed(2); }

function renderProducts(list){
  productGrid.innerHTML = '';
  list.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <div class="product-body">
        <div>
          <div class="product-title">${p.name}</div>
          <div class="product-sku">${p.id} · Tallas: ${p.size.join(', ')}</div>
        </div>
        <div class="product-meta">
          <div class="price">${formatPrice(p.price)}</div>
          <div>
            <span class="badge">${p.stock} en stock</span>
          </div>
        </div>
        <div style="margin-top:10px; display:flex; gap:8px;">
          <button class="btn primary" onclick="openModal('${p.id}')">Detalles</button>
          <button class="btn outline" onclick="addToCart('${p.id}')">Agregar</button>
        </div>
      </div>
    `;
    productGrid.appendChild(card);
  })
}

// SEARCH
searchInput.addEventListener('input', (e)=>{
  const q = e.target.value.trim().toLowerCase();
  const filtered = products.filter(p => (p.name + ' ' + p.id).toLowerCase().includes(q));
  renderProducts(filtered);
});

// MODAL
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');
const btnLogin = document.getElementById('btn-login');

function openModal(id){
  const p = products.find(x=>x.id===id);
  if(!p) return;
  modalBody.innerHTML = `
    <div style="display:flex; gap:16px; padding:18px; align-items:flex-start">
      <img src="${p.img}" alt="${p.name}" style="width:240px; height:240px; object-fit:cover; border-radius:8px">
      <div style="flex:1">
        <h2 style="margin:0 0 6px">${p.name}</h2>
        <div style="color:#555; margin-bottom:10px">${p.id} · ${p.size.join(', ')}</div>
        <p style="color:#333; margin-bottom:8px">Precio: <strong>${formatPrice(p.price)}</strong></p>
        <p style="color:#333; margin-bottom:8px">Stock disponible: <strong>${p.stock}</strong></p>
        <p style="color:#333; margin-bottom:12px">Descripción: Producto de calidad, ideal para tu tienda. Registra ventas y entradas, y recibe alertas cuando el stock baje.</p>
        <div style="display:flex; gap:8px;">
          <button class="btn primary" onclick="addToCart('${p.id}')">Agregar al inventario</button>
          <button class="btn outline" onclick="closeModal()">Cerrar</button>
        </div>
      </div>
    </div>
  `;
  modal.setAttribute('aria-hidden','false');
}

function closeModal(){
  modal.setAttribute('aria-hidden','true');
}
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e)=>{
  if(e.target===modal) closeModal();
});

// LOGIN FORM (DEMO)
btnLogin.addEventListener('click', ()=>{
  modalBody.innerHTML = `
    <div style="padding:18px">
      <h2 style="margin-top:0">Iniciar sesión</h2>
      <form id="login-form">
        <div class="form-row">
          <label for="login-email">Email</label>
          <input id="login-email" class="input" type="email" placeholder="tu@email.com" required>
          <div id="email-error" class="error" style="display:none">Ingresa un email válido</div>
        </div>
        <div class="form-row">
          <label for="login-pass">Contraseña</label>
          <div class="form-inline">
            <input id="login-pass" class="input" type="password" placeholder="••••••••" required>
            <button id="toggle-pass" class="toggle-eye" type="button" aria-label="Mostrar u ocultar contraseña">👁</button>
          </div>
          <div class="helper">Mínimo 6 caracteres</div>
        </div>
        <div class="form-inline" style="justify-content:space-between">
          <label style="display:flex; gap:6px; align-items:center">
            <input id="remember-me" type="checkbox"> Recordarme
          </label>
          <a href="#" onclick="alert('Recuperación de contraseña (demo)')">¿Olvidaste tu contraseña?</a>
        </div>
        <div style="display:flex; gap:8px; margin-top:12px">
          <button class="btn primary" type="submit" id="login-submit" disabled>Entrar</button>
          <button class="btn outline" type="button" onclick="closeModal()">Cancelar</button>
        </div>
      </form>
    </div>
  `;
  modal.setAttribute('aria-hidden','false');

  const email = document.getElementById('login-email');
  const pass = document.getElementById('login-pass');
  const submit = document.getElementById('login-submit');
  const emailErr = document.getElementById('email-error');
  const toggle = document.getElementById('toggle-pass');

  function validateEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)}
  function updateState(){
    const ok = validateEmail(email.value) && pass.value.trim().length >= 6;
    submit.disabled = !ok;
    emailErr.style.display = email.value && !validateEmail(email.value) ? 'block' : 'none';
  }
  email.addEventListener('input', updateState);
  pass.addEventListener('input', updateState);
  toggle.addEventListener('click', ()=>{
    pass.type = pass.type === 'password' ? 'text' : 'password';
  });

  document.getElementById('login-form').addEventListener('submit', (e)=>{
    e.preventDefault();
    alert('Inicio de sesión (demo)');
    closeModal();
  });
});

// CARRO SIMPLIFICADO (EN MEMORIA)
let cart = [];
function addToCart(id){
  const p = products.find(x=>x.id===id);
  if(!p) return alert('Producto no encontrado');
  // acción de demo: restar stock
  if(p.stock <= 0) return alert('Sin stock');
  p.stock -= 1;
  cart.push({id: p.id, name: p.name, price: p.price});
  renderProducts(products);
  alert(`${p.name} agregado. Stock restante: ${p.stock}`);
}

// DESCARGA FALSA (DEMO)
function fakeDownload(platform){
  alert('Esta es una demo. En producción aquí redirigirías a Google Play o App Store.');
}

// CONTACT FORM
function handleContact(e){
  e.preventDefault();
  const f = e.target;
  const name = f.name.value.trim();
  const email = f.email.value.trim();
  const message = f.message.value.trim();
  if(!name || !email || !message) return alert('Completa todos los campos');
  // En una app real mandar a backend; aquí solo mostramos confirmación
  alert(`Gracias ${name}. Hemos recibido tu mensaje y te contactaremos a ${email}.`);
  f.reset();
}

// MOBILE MENU
const mobileToggle = document.getElementById('mobile-toggle');
const nav = document.getElementById('nav');
mobileToggle.addEventListener('click', ()=>{
  if(nav.style.display === 'flex') nav.style.display = 'none';
  else nav.style.display = 'flex';
  nav.style.flexDirection = 'column';
  nav.style.position = 'absolute';
  nav.style.right = '20px';
  nav.style.top = '70px';
  nav.style.background = 'rgba(2,6,23,0.8)';
  nav.style.padding = '12px';
  nav.style.borderRadius = '8px';
});

// INIT
window.addEventListener('scroll', ()=>{
  const header = document.querySelector('.site-header');
  if(window.scrollY > 6) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
});
document.getElementById('year').textContent = new Date().getFullYear();
renderProducts(products);