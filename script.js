const r = id=>document.getElementById(id);
const v = id=>document.getElementById(id).value;

let projectCount=0;

// Drag & Drop
let dragSrcEl=null;
function handleDragStart(e){dragSrcEl=e;}
function handleDragOver(e){e.preventDefault();}
function handleDrop(e){
  e.preventDefault();
  if(dragSrcEl!=this){
    let parent=this.parentNode;
    parent.insertBefore(dragSrcEl,this);
    saveDraft();
  }
}
function addDragEvents(el){
  el.addEventListener('dragstart',handleDragStart);
  el.addEventListener('dragover',handleDragOver);
  el.addEventListener('drop',handleDrop);
}

document.querySelectorAll('.section').forEach(addDragEvents);

// Auto-save & load draft
function saveDraft(){
  const draft = {
    name:v("name"), email:v("email"), phone:v("phone"),
    summary:v("summary"), skills:v("skills"),
    education:v("education"), experience:v("experience"),
    awards:v("awards"), hobbies:v("hobbies"),
    languages:v("languages"), interests:v("interests"),
    projects:[]
  };
  for(let i=1;i<=projectCount;i++){
    const title=v(`project-title-${i}`);
    if(title){
      draft.projects.push({
        title,
        role:v(`project-role-${i}`),
        desc:v(`project-desc-${i}`),
        tech:v(`project-tech-${i}`),
        link:v(`project-link-${i}`)
      });
    }
  }
  localStorage.setItem('resumeDraft',JSON.stringify(draft));
}

function loadDraft(){
  const draft=JSON.parse(localStorage.getItem('resumeDraft'));
  if(!draft) return;
  r("name").value=draft.name;
  r("email").value=draft.email;
  r("phone").value=draft.phone;
  r("summary").value=draft.summary;
  r("skills").value=draft.skills;
  r("education").value=draft.education;
  r("experience").value=draft.experience;
  r("awards").value=draft.awards;
  r("hobbies").value=draft.hobbies;
  r("languages").value=draft.languages;
  r("interests").value=draft.interests;
  draft.projects.forEach(p=>{
    addProject();
    const i=projectCount;
    r(`project-title-${i}`).value=p.title;
    r(`project-role-${i}`).value=p.role;
    r(`project-desc-${i}`).value=p.desc;
    r(`project-tech-${i}`).value=p.tech;
    r(`project-link-${i}`).value=p.link;
  });
  createResume();
}

// Projects
function addProject(){
  projectCount++;
  const container=r("projects-container");
  const div=document.createElement("div");
  div.className="project-item";
  div.innerHTML=`<input placeholder="Project Title" id="project-title-${projectCount}">
    <input placeholder="Role" id="project-role-${projectCount}">
    <textarea placeholder="Description" id="project-desc-${projectCount}"></textarea>
    <input placeholder="Technologies Used" id="project-tech-${projectCount}">
    <input placeholder="Optional Link" id="project-link-${projectCount}">`;
  container.appendChild(div);
}

// Create Resume
function createResume(){
  r("r-name").innerText=v("name");
  r("r-contact").innerHTML=`<i class="fa-solid fa-envelope"></i> ${v("email")} | <i class="fa-solid fa-phone"></i> ${v("phone")}`;
  r("r-summary").innerText=v("summary");

  // Skills
  r("r-skills").innerHTML="";
  v("skills").split(',').forEach(s=>{
    if(s.trim()){
      const div=document.createElement("div");
      div.className="skill-box";
      div.innerText=s.trim();
      div.style.background=r("colorAccent").value;
      r("r-skills").appendChild(div);
    }
  });

  // Projects
  r("r-projects").innerHTML="";
  for(let i=1;i<=projectCount;i++){
    const title=v(`project-title-${i}`);
    if(title){
      const box=document.createElement("div");
      box.className="project-box";
      box.style.background=r("colorAccent").value;
      const role=v(`project-role-${i}`);
      const desc=v(`project-desc-${i}`);
      const tech=v(`project-tech-${i}`);
      const link=v(`project-link-${i}`);
      box.innerHTML=`<strong>${title}</strong><br>${role}<br>${desc}<br><em>${tech}</em>${link?`<br><a href="${link}" target="_blank">${link}</a>`:""}`;
      r("r-projects").appendChild(box);
    }
  }

  r("r-education").innerText=v("education");
  r("r-experience").innerText=v("experience");
  r("r-awards").innerText=v("awards");
  r("r-hobbies").innerText=v("hobbies");
  r("r-languages").innerText=v("languages");
  r("r-interests").innerText=v("interests");

  // Photo
  const file=r("photo").files[0];
  if(file){
    const reader=new FileReader();
    reader.onload=()=>r("r-photo").src=reader.result;
    reader.readAsDataURL(file);
  }

  saveDraft(); // autosave
}

// Reset Form
function resetForm(){
  if(confirm("Reset all fields?")){
    document.querySelectorAll("input,textarea").forEach(e=>e.value="");
    r("r-photo").src="";
    r("r-skills").innerHTML="";
    r("r-projects").innerHTML="";
    r("r-summary").innerText="";
    r("r-education").innerText="";
    r("r-experience").innerText="";
    r("r-awards").innerText="";
    r("r-hobbies").innerText="";
    r("r-languages").innerText="";
    r("r-interests").innerText="";
    r("projects-container").innerHTML="";
    projectCount=0;
    localStorage.removeItem("resumeDraft");
  }
}

// Download PDF
function downloadResume(){ window.print(); }

// Load draft on page load
window.onload=loadDraft;

// Drag & Drop events for dynamic sections
document.querySelectorAll('.section').forEach(el=>el.addEventListener('dragstart', e=>{e.dataTransfer.setData('text/plain', el.id);}));
document.querySelectorAll('.section').forEach(el=>{
  el.addEventListener('dragover',e=>e.preventDefault());
  el.addEventListener('drop', e=>{
    e.preventDefault();
    const srcId=e.dataTransfer.getData('text/plain');
    const srcEl=document.getElementById(srcId);
    const parent=e.target.closest(".resume-sections");
    if(srcEl && parent) parent.insertBefore(srcEl,e.target.closest(".section"));
    saveDraft();
  });
});
