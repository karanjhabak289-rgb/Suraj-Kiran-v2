const PRODUCTS = [
  {id:"premium-chai", name:"Premium Chai", price:540, image:"premium chai.PNG", desc:"A rich everyday chai with satisfying aroma and character."},
 {id:"dhaba-chai", name:"Dhaba Chai", price:400, images:["Dhaba chai.png","Dhaba chai 2.png"], desc:"A comforting, full-bodied chai inspired by classic roadside tea."},
  {id:"green-tea", name:"Green Tea", price:340, unit:"200g", image:"green tea.png", desc:"A clean, refreshing tea for a lighter everyday cup."},
  {id:"butterfly-pea", name:"Butterfly Pea Flower", price:900, image:"Butterfly Pea Flower Tea.png", desc:"A distinctive floral infusion with a naturally striking colour."},
  {id:"hibiscus-flower", name:"Hibiscus Flower Tea", price:500, image:"hibiscus flower tea.png", desc:"A vibrant floral infusion with a refreshing character."},
  {id:"chamomile-flower", name:"Chamomile Flower", price:900, image:"Chamomile flower tea.png", desc:"A gentle floral tea suited to calm, quiet moments."}
];

const money = p => p.price == null
  ? "Price on enquiry"
  : `₹${p.price.toLocaleString("en-IN")}/${p.unit || "kg"}`;
function card(p){
  const images = p.images || [p.image];

  return `<article class="product-card">
    <div class="product-media">
      <div class="product-slider">
        ${images.map((img, i) => `
          <img src="${img}" alt="${p.name}" loading="lazy">
        `).join("")}
      </div>

      <button class="quick-add" data-add="${p.id}" aria-label="Add ${p.name}">+</button>
    </div>

    <div class="product-body">
      <span class="product-cat">SURAJ KIRAN</span>
      <h3 class="product-name">${p.name}</h3>
      <p class="product-desc">${p.desc}</p>
      <div class="product-meta">
        <span class="price">${money(p)}</span>
      </div>
    </div>
  </article>`;
}
function getCart(){ try{return JSON.parse(localStorage.getItem("surajKiranCart")||"[]")}catch{return []}}
function saveCart(c){localStorage.setItem("surajKiranCart",JSON.stringify(c)); updateCount();}
function updateCount(){const n=getCart().reduce((a,x)=>a+x.qty,0);document.querySelectorAll("#cartCount").forEach(e=>e.textContent=n);}
function add(id){const p=PRODUCTS.find(x=>x.id===id); if(!p)return; let c=getCart(); let item=c.find(x=>x.id===id); if(item)item.qty++; else c.push({id,qty:1}); saveCart(c);}

document.addEventListener("click",e=>{
  const b=e.target.closest("[data-add]"); if(b){add(b.dataset.add); b.textContent="✓"; setTimeout(()=>b.textContent="+",700);}
});
const featured=document.querySelector("#featuredProducts"); if(featured) featured.innerHTML=PRODUCTS.slice(0,3).map(card).join("");
const all=document.querySelector("#allProducts");
function renderAll(list=PRODUCTS){if(all)all.innerHTML=list.map(card).join("")}
renderAll();
document.querySelector("#productSearch")?.addEventListener("input",e=>{
  const q=e.target.value.toLowerCase(); renderAll(PRODUCTS.filter(p=>p.name.toLowerCase().includes(q)));
});
function renderCart(){
  const box=document.querySelector("#cartItems"); if(!box)return;
  const c=getCart(); if(!c.length){box.innerHTML="<div class='panel'><h2>Your bag is empty.</h2><a class='text-link' href='products.html'>Explore our teas →</a></div>"; document.querySelector("#cartTotal").textContent="₹0"; return;}
  let total=0; box.innerHTML=c.map(item=>{const p=PRODUCTS.find(x=>x.id===item.id); const line=(p.price||0)*item.qty; total+=line; return `<div class="cart-item"><div class="thumb"><img src="${p.image}" alt="${p.name}"></div><div><strong>${p.name}</strong><div class="small">₹${p.price?.toLocaleString("en-IN")||"Enquiry"}/kg × ${item.qty}</div></div><div class="cart-price"><strong>${p.price?`₹${line.toLocaleString("en-IN")}`:"Enquiry"}</strong></div></div>`}).join("");
  document.querySelector("#cartTotal").textContent=`₹${total.toLocaleString("en-IN")}`;
}
renderCart(); updateCount();

document.querySelector("#menuBtn")?.addEventListener("click",()=>document.querySelector("#mainNav")?.classList.toggle("open"));
document.querySelector("#searchBtn")?.addEventListener("click",()=>document.querySelector("#productSearch")?.focus());
