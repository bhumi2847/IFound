const page = location.pathname.split('/').pop();

const demoLost = [
  {id:1,type:'lost',name:'Black Wallet',category:'Accessories',date:'2026-09-05',location:'Library',description:'Black leather wallet missing near the library.',contact:'9876543210',image:'assets/images/wallet.png',user:'demo'},
  {id:2,type:'lost',name:'HP Laptop',category:'Electronics',date:'2026-09-07',location:'Block A',description:'Silver HP laptop with a small sticker.',contact:'9876543211',image:'assets/images/laptop.png',user:'demo'},
  {id:3,type:'lost',name:'Black Backpack',category:'Clothing',date:'2026-09-09',location:'Cafeteria',description:'Black college backpack with books inside.',contact:'9876543212',image:'assets/images/backpack.png',user:'demo'},
  {id:7,type:'lost',name:'College ID Card',category:'Documents',date:'2026-09-10',location:'Academic Block',description:'College ID card lost near the main corridor.',contact:'9876543213',image:'assets/images/document.png',user:'demo'},
  {id:8,type:'lost',name:'Silver Watch',category:'Accessories',date:'2026-09-11',location:'Sports Complex',description:'Silver wrist watch lost after a college event.',contact:'9876543214',image:'assets/images/watch.png',user:'demo'}
];

const demoFound = [
  {id:4,type:'found',name:'Keys',category:'Other',date:'2026-09-06',location:'Main Gate',description:'A small set of keys found near the gate.',contact:'9876543220',image:'assets/images/keys.png',user:'demo'},
  {id:5,type:'found',name:'Watch',category:'Accessories',date:'2026-09-08',location:'Library',description:'Wrist watch found on a study table.',contact:'9876543221',image:'assets/images/watch.png',user:'demo'},
  {id:6,type:'found',name:'Calculator',category:'Electronics',date:'2026-09-10',location:'Lab 2',description:'Scientific calculator left in the computer lab.',contact:'9876543222',image:'assets/images/laptop.png',user:'demo'},
  {id:9,type:'found',name:'Notebook',category:'Books',date:'2026-09-11',location:'Cafeteria',description:'A college notebook found on a table.',contact:'9876543223',image:'assets/images/document.png',user:'demo'},
  {id:10,type:'found',name:'Blue Backpack',category:'Clothing',date:'2026-09-12',location:'Library',description:'Blue backpack found near the reading area.',contact:'9876543224',image:'assets/images/backpack.png',user:'demo'}
];

function addDemoItems(key, demos) {
  let items = JSON.parse(localStorage.getItem(key)) || [];
  demos.forEach(demo => {
    if (!items.some(item => item.id === demo.id)) items.push(demo);
  });
  localStorage.setItem(key, JSON.stringify(items));
}

addDemoItems('lostItems', demoLost);
addDemoItems('foundItems', demoFound);

function $(id) { return document.getElementById(id); }
function logged() { return localStorage.getItem('loggedIn') === 'true'; }

if (['lost.html','found.html','report-lost.html','report-found.html','profile.html'].includes(page) && !logged()) {
  location.href = 'login.html';
}

const menu = document.querySelector('.menu');
const nav = document.querySelector('.nav');
if (menu) menu.onclick = () => nav.classList.toggle('open');



const loading = document.querySelector('.loading');
if (loading) setTimeout(() => loading.style.display = 'none', 1600);

if ($('loginForm')) {
  $('loginForm').onsubmit = e => {
    e.preventDefault();
    let u = $('loginUser').value.trim();
    let p = $('loginPass').value.trim();
    if (!u || !p) {
      $('loginError').textContent = 'Username and password are required.';
      return;
    }
    localStorage.setItem('loggedIn', 'true');
    localStorage.setItem('username', u);
    location.href = 'index.html';
  };
}

if ($('password')) {
  $('password').oninput = () => {};
}

if ($('signupForm')) {
  $('signupForm').onsubmit = e => {
    e.preventDefault();
    let user = {
      name:$('name').value.trim(),
      gender:$('gender').value,
      reg:$('reg').value.trim(),
      faculty:$('faculty').value,
      phone:$('phone').value.trim(),
      username:$('username').value.trim(),
      password:$('password').value
    };
    let c = $('confirm').value;
    if (!user.name || !user.reg || !user.phone || !user.username) {
      $('signupMsg').textContent = 'Please fill all required fields.';
      return;
    }
    if (user.phone.length < 10 || isNaN(user.phone)) {
      $('signupMsg').textContent = 'Enter a valid phone number.';
      return;
    }
    if (user.password.length < 6) {
      $('signupMsg').textContent = 'Password must be at least 6 characters.';
      return;
    }
    if (user.password !== c) {
      $('signupMsg').textContent = 'Passwords do not match.';
      return;
    }
    localStorage.setItem('user', JSON.stringify(user));
    alert('Registration successful!');
    location.href = 'login.html';
  };
}

function showItems(type) {
  let list = JSON.parse(localStorage.getItem(type + 'Items')) || [];
  let q = ($('search').value || '').toLowerCase();
  let cat = $('category').value;
  let box = $('items');
  let result = list.filter(x =>
    (x.name + ' ' + x.category + ' ' + x.location + ' ' + x.description).toLowerCase().includes(q) &&
    (cat === 'All' || x.category === cat)
  );

  box.innerHTML = '';
  if (!result.length) {
    box.innerHTML = '<div class="empty">No matching items found.</div>';
    return;
  }

  result.forEach(x => {
    box.innerHTML += `<article class="card">
      <img src="${x.image}" alt="${x.name}">
      <div class="card-body">
        <h3>${x.name}</h3>
        <p>${x.category}</p>
        <p>${x.location}</p>
        <p>${x.date}</p>
        <span class="status ${x.type === 'found' ? 'found' : ''}">${x.type}</span>
        <a class="details-btn" href="item-details.html?id=${x.id}&type=${x.type}">View Details</a>
      </div>
    </article>`;
  });
}

if ($('items')) {
  let type = page === 'lost.html' ? 'lost' : 'found';
  showItems(type);
  $('search').oninput = () => showItems(type);
  $('category').onchange = () => showItems(type);
  $('searchBtn').onclick = () => showItems(type);
}

function saveReport(type) {
  const file = $('itemImage').files[0];
  const finish = image => {
    let arr = JSON.parse(localStorage.getItem(type + 'Items')) || [];
    let item = {
      id:Date.now(),
      type:type,
      name:$('itemName').value.trim(),
      category:$('itemCategory').value,
      date:$('itemDate').value,
      location:$('itemLocation').value.trim(),
      description:$('itemDescription').value.trim() + ' ' + $('itemExtra').value.trim(),
      contact:$('itemContact').value.trim(),
      image:image || 'assets/images/wallet.png',
      user:localStorage.getItem('username')
    };
    arr.push(item);
    localStorage.setItem(type + 'Items', JSON.stringify(arr));
    $('formMsg').textContent = type === 'lost' ? 'Lost item reported successfully!' : 'Found item reported successfully!';
    setTimeout(() => location.href = type === 'lost' ? 'lost.html' : 'found.html', 700);
  };

  if (file) {
    let r = new FileReader();
    r.onload = () => finish(r.result);
    r.readAsDataURL(file);
  } else {
    finish();
  }
}

if ($('lostForm')) $('lostForm').onsubmit = e => { e.preventDefault(); saveReport('lost'); };
if ($('foundForm')) $('foundForm').onsubmit = e => { e.preventDefault(); saveReport('found'); };

if ($('profileBox')) {
  let u = JSON.parse(localStorage.getItem('user')) || {};
  let name = u.name || localStorage.getItem('username') || 'Student';
  let initials = name.split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase();

  $('profileBox').innerHTML = `<div class="profile-avatar">${initials}</div>
    <h2>${name}</h2>
    <div class="profile-details">
      <div class="profile-detail"><small>Gender</small><b>${u.gender || 'Not available'}</b></div>
      <div class="profile-detail"><small>Register Number</small><b>${u.reg || 'Not available'}</b></div>
      <div class="profile-detail"><small>Faculty</small><b>${u.faculty || 'Not available'}</b></div>
      <div class="profile-detail"><small>Phone</small><b>${u.phone || 'Not available'}</b></div>
      <div class="profile-detail"><small>Username</small><b>${u.username || localStorage.getItem('username') || 'Not available'}</b></div>
    </div>
    <button class="primary" onclick="deleteAccount()">Delete Account</button>`;

  let all = [...(JSON.parse(localStorage.getItem('lostItems')) || []), ...(JSON.parse(localStorage.getItem('foundItems')) || [])]
    .filter(x => x.user === localStorage.getItem('username'));

  $('myItems').innerHTML = all.length
    ? all.map(x => `<div class="mini"><b>${x.name}</b><p>📍 ${x.location} · ${x.date}</p><span class="report-type ${x.type === 'found' ? 'found' : ''}">${x.type}</span></div>`).join('')
    : '<div class="empty">No reports yet. Start by reporting a lost or found item.</div>';
}

function deleteAccount() {
  if (confirm('Delete your account?')) {
    localStorage.removeItem('user');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    location.href = 'login.html';
  }
}

if ($('detail')) {
  let id = new URLSearchParams(location.search).get('id');
  let type = new URLSearchParams(location.search).get('type');
  let arr = JSON.parse(localStorage.getItem(type + 'Items')) || [];
  let x = arr.find(a => String(a.id) === id);

  if (!x) {
    $('detail').innerHTML = '<h2>Item not found.</h2>';
  } else {
    $('detail').innerHTML = `<img src="${x.image}" alt="${x.name}">
      <div class="detail-info">
        <h1>${x.name}</h1>
        <p><b>Category:</b> ${x.category}</p>
        <p><b>Date:</b> ${x.date}</p>
        <p><b>Location:</b> ${x.location}</p>
        <p><b>Description:</b> ${x.description}</p>
        <p><b>Status:</b> ${x.type}</p>
        <p><b>Reported by:</b> ${x.user}</p>
        <p><b>Contact:</b> ${x.contact}</p>
        <a class="details-btn" href="tel:${x.contact}">${x.type === 'lost' ? 'Contact Owner' : 'Contact Reporter'}</a>
      </div>`;
  }
}

function togglePassword() {
  let input = $('loginPass');
  input.type = input.type === 'password' ? 'text' : 'password';
}
