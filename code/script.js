let laptopsData=[];
async function loadLaptops(){
  let res=await fetch('/api/laptops');
  laptopsData=await res.json();
  let sel=document.getElementById('laptopId');
  sel.innerHTML='';
  laptopsData.forEach(l=>{
    let opt=document.createElement('option');
    opt.value=l.id;
    opt.textContent=`${l.model} - $${l.price} (${l.category})`;
    sel.appendChild(opt);
  });
  showPreview();
  loadOrders();
}
function showPreview(){
  let id=document.getElementById('laptopId').value;
  let l=laptopsData.find(x=>x.id===id);
  if(!l) return;
  document.getElementById('preview').innerHTML=`<b>${l.model}</b><br>CPU: ${l.cpu} | RAM: ${l.ram} | ${l.storage}<br><b>Price: $${l.price}</b>`;
}
document.getElementById('laptopId')?.addEventListener('change',showPreview);

document.getElementById('orderForm').addEventListener('submit',async(e)=>{
  e.preventDefault();
  let body={
    employeeName:document.getElementById('employeeName').value,
    employeeEmail:document.getElementById('employeeEmail').value,
    department:document.getElementById('department').value,
    laptopId:document.getElementById('laptopId').value
  };
  document.getElementById('flowLog').innerHTML='⏳ Flow Triggered...<br>▶ Validating...';
  let res=await fetch('/api/order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  let data=await res.json();
  let logHtml=`<b>ORDER ${data.orderId} - ${data.status}</b><br><br>TRIGGER: ${data.trigger}<br><br>`;
  data.steps.forEach(s=>{
    logHtml+=`Step ${s.step}: ${s.action} => <b>${s.status}</b><br><small>${s.details}</small><br><br>`;
  });
  document.getElementById('flowLog').innerHTML=logHtml;
  loadOrders();
});

async function loadOrders(){
  let res=await fetch('/api/orders');
  let orders=await res.json();
  let html='';
  orders.forEach(o=>{
    html+=`<div style="border:1px solid #ddd;padding:10px;border-radius:8px;margin-top:8px;font-size:13px"><b>${o.orderId}</b> - ${o.requester.employeeName} (${o.requester.department})<br>${o.laptop.model} - $${o.laptop.price}<br>Status: <b>${o.status}</b><br><small>${new Date(o.createdAt).toLocaleString()}</small></div>`;
  });
  document.getElementById('ordersList').innerHTML=html||'No orders';
}
loadLaptops();