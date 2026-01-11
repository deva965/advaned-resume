// Helper
const r = id => document.getElementById(id);
const v = id => document.getElementById(id).value;

let projectCount = 0;

function addProject() {
  projectCount++;
  const container = r("projects-container");
  const div = document.createElement("div");
  div.className = "project-item";
  div.innerHTML = `
    <input placeholder="Project Title" id="project-title-${projectCount}">
    <input placeholder="Role" id="project-role-${projectCount}">
    <textarea placeholder="Description" id="project-desc-${projectCount}"></textarea>
    <input placeholder="Technologies Used" id="project-tech-${projectCount}">
    <input placeholder="Optional Link (GitHub/Website)" id="project-link-${projectCount}">
  `;
  container.appendChild(div);
}

function createResume() {
  r("r-name").innerText = v("name");
  r("r-contact").innerHTML = `<i class="fa-solid fa-envelope"></i> ${v("email")} | <i class="fa-solid fa-phone"></i> ${v("phone")}`;
  r("r-summary").innerText = v("summary");

  // Skills
  const skills = v("skills").split(",");
  r("r-skills").innerHTML = "";
  skills.forEach(skill=>{
    if(skill.trim()){
      const div = document.createElement("div");
      div.className = "skill-box";
      div.innerText = skill.trim();
      r("r-skills").appendChild(div);
    }
  });

  // Projects
  r("r-projects").innerHTML = "";
  for(let i=1;i<=projectCount;i++){
    const title = v(`project-title-${i}`);
    if(title){
      const box = document.createElement("div");
      box.className = "project-box";
      const role = v(`project-role-${i}`);
      const desc = v(`project-desc-${i}`);
      const tech = v(`project-tech-${i}`);
      const link = v(`project-link-${i}`);
      box.innerHTML = `<strong>${title}</strong><br>${role}<br>${desc}<br><em>${tech}</em>${link?`<br><a href="${link}" target="_blank">${link}</a>`:""}`;
      r("r-projects").appendChild(box);
    }
  }

  r("r-education").innerText = v("education");
  r("r-experience").innerText = v("experience");
  r("r-awards").innerText = v("awards");
  r("r-hobbies").innerText = v("hobbies");
  r("r-languages").innerText = v("languages");
  r("r-interests").innerText = v("interests");

  // Photo
  const file = r("photo").files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = () => r("r-photo").src = reader.result;
    reader.readAsDataURL(file);
  }

  // Color Accent
  const color = v("colorAccent");
  document.querySelectorAll(".skill-box,.project-box").forEach(e=>e.style.background=color);
}

function resetForm(){
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
  projectCount = 0;
}

function downloadResume(){
  window.print();
}
