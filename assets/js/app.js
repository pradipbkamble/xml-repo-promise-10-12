const cl = console.log;
const postcontainer = document.getElementById("postcontainer");
const postform = document.getElementById("postForm");
const titlecontrol= document.getElementById("title");
const bodycontrol= document.getElementById("body");
const useridcontrol=document.getElementById("userId");
const updateBtn =document.getElementById("updateBtn");
const submitBtn = document.getElementById("submitBtn");
const lader= document.getElementById("lader");




 let baseUrl =`https://promise1-7e86d-default-rtdb.asia-southeast1.firebasedatabase.app`

 let postsUrl =`${baseUrl}/posts.json`
 //cl(postsUrl)

 let onEdit=(dlt)=>{
  //cl(dlt)
  lader.classList.remove("d-none");
  let editid=dlt.closest(".card").id
  localStorage.setItem("edtid",editid)
  let edtUrl= `${baseUrl}/posts/${editid}.json`
  apiall("GET",edtUrl)
  .then(res=>{
    lader.classList.add("d-none");
    let edtpost=JSON.parse(res)
    submitBtn.classList.add("d-none")
    updateBtn.classList.remove("d-none")
    titlecontrol.value=edtpost.title
    bodycontrol.value=edtpost.body
    useridcontrol.value=edtpost.userId
    
   

  })
  .catch(cl)

 }
 let onDelet=(edt)=>{
  cl(edt)
  let dltid= edt.closest(".card").id;
  let dlturl=`${baseUrl}/posts/${dltid}.json`
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    
  });
  //
  
    apiall("DELETE",dlturl)
    .then(res=>{
      cl(res)
      let deletcard=document.getElementById(dltid);
      deletcard.remove();
      
    })
    .catch(cl)
  }
 
 



const templating=(temp)=>{
  postcontainer.innerHTML="";
   temp.forEach(elem=> {
    createcard(elem)
//     let card= document.createElement("div");
// card.className="card mb-4";
// card.id=elem.id;
// card.innerHTML=`
// <div class="card mb-4>
//                         <div class="card-header">
//                         <h2>${elem.title}</h2>
//                             </div>
//                         <div class="card-body">
//                         <p>
//                           ${elem.body}
//                             </p>
//                               </div>
//                           <div class="card-footer d-flex justify-content-between">
//                          <button class="btn btn-primary" onclick="onEdit(this)">
//                              Edit
//                             </button>
//                             <button class="btn btn-danger" onclick="onDelet(this)">
//                             Delete
//                             </button>
//                         </div>
//                      </div> 
// `
//     postcontainer.append(card);
   })
   
}
const createcard=(creobj)=>{
let card= document.createElement("div");
card.className="card mb-4";
card.id=creobj.id;
card.innerHTML=`

                        <div class="card-header">
                        <h2>${creobj.title}</h2>
                            </div>
                        <div class="card-body">
                        <p>
                          ${creobj.body}
                            </p>
                              </div>
                          <div class="card-footer d-flex justify-content-between">
                         <button class="btn btn-primary" onclick="onEdit(this)">
                             Edit
                            </button>
                            <button class="btn btn-danger" onclick="onDelet(this)">
                            Delete
                            </button>
                        </div>
                     </div> 
`
    postcontainer.append(card);
   }

const objtoarr=(obj)=>{
let arr1=[];
for(const key in obj){
  let newobj= obj[key];
  newobj.id=key;
  arr1.push(newobj)
 
} 
return arr1
}


 const apiall=(method,apiurl,databs=null)=>{
  lader.classList.remove("d-none");
  return new Promise((resolve,reject)=>{
let xhr=new XMLHttpRequest();
xhr.open(method,apiurl);
xhr.send(databs);
xhr.onload=function(){
  lader.classList.add("d-none");
  if(xhr.status >=200 && xhr.status< 300){
    resolve(xhr.responseText);
    cl(xhr.response)
  
  }
  else{
    reject(xhr.statusText);
  }
}
  })

 }
 apiall("GET",postsUrl)
.then(res=>{
let data=JSON.parse(res)
//cl(data);
let postarr=objtoarr(data);
//cl(postarr)
templating(postarr)


})
.catch(cl)



let onupdate=()=>{
  
  let updid=localStorage.getItem(`edtid`);
  let updturl=`${baseUrl}/posts/${updid}.json`
  let updobj={
    title:titlecontrol.value,
    body:bodycontrol.value,
    userId:useridcontrol.value,
    id:updid.id,
  };
  apiall("PUT",updturl,JSON.stringify(updobj))
  .then(res=>{
    cl(res)
  let updata=JSON.parse(res);
  let udtcard=document.getElementById(updid);
  cl(udtcard)
  let childcard=[...udtcard.children];
  cl(childcard)
  childcard[0].innerHTML=`<h2>${updobj.title}</h2>`
  childcard[1].innerHTML=`<p>${updobj.body}</p>`
  })
  .catch(cl)
  .finally(()=>{
    submitBtn.classList.remove("d-none")
    updateBtn.classList.add("d-none")
    postform.reset();
  })}

  const onsubmit=(eve)=>{
    eve.preventDefault();
  let newsubobj={
    title:titlecontrol.value,
    body:bodycontrol.value,
    userId:useridcontrol.value,
  }
  cl(newsubobj)
  apiall("POST",postsUrl,JSON.stringify(newsubobj))
  .then(res=>{
    cl(res)
    let subid=JSON.parse(res).name;
    cl(subid)
     newsubobj.id=subid.id;
     createcard(newsubobj);
   //
  })
  .catch(cl)
  .finally(()=>{
    postform.reset();
  })
     }

postform.addEventListener("submit",onsubmit)

updateBtn.addEventListener("click",onupdate);





 