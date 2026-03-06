const input = document.getElementById("taskInput")
const addBtn = document.getElementById("addBtn")
const list = document.getElementById("taskList")
const priority = document.getElementById("priority")
const taskCount = document.getElementById("taskCount")

let tasks = JSON.parse(localStorage.getItem("tasks")) || []
let filter = "all"

function save(){

localStorage.setItem("tasks", JSON.stringify(tasks))

}

function render(){

list.innerHTML=""

let filtered = tasks.filter(task=>{

if(filter==="pending") return !task.completed
if(filter==="completed") return task.completed

return true

})

filtered.forEach((task,index)=>{

const li=document.createElement("li")

li.classList.add(task.priority)

if(task.completed) li.classList.add("completed")

li.innerHTML=`

<span onclick="toggle(${index})">${task.text}</span>

<i class="fa fa-trash delete"
onclick="removeTask(${index})"></i>

`

list.appendChild(li)
li.setAttribute("draggable", true)

})

updateCount()

}

function addTask(){

let text=input.value.trim()

if(text==="") return

tasks.push({

text:text,
priority:priority.value,
completed:false

})

input.value=""

save()
render()

}

function toggle(index){

tasks[index].completed=!tasks[index].completed

save()
render()

}

function removeTask(index){

tasks.splice(index,1)

save()
render()

}

function filterTasks(type){

filter=type

render()

}

function updateCount(){

let remaining=tasks.filter(t=>!t.completed).length

taskCount.textContent="Tasks Left: "+remaining

}

addBtn.addEventListener("click",addTask)

render()

const toggleBtn = document.getElementById("themeToggle")

toggleBtn.addEventListener("click",()=>{

document.body.classList.toggle("dark")

})

let draggedItem=null

document.addEventListener("dragstart",(e)=>{

if(e.target.tagName==="LI"){

draggedItem=e.target
e.target.classList.add("dragging")

}

})

document.addEventListener("dragend",(e)=>{

if(e.target.tagName==="LI"){

e.target.classList.remove("dragging")

}

})

list.addEventListener("dragover",(e)=>{

e.preventDefault()

const afterElement = getDragAfterElement(list, e.clientY)

if(afterElement == null){

list.appendChild(draggedItem)

}else{

list.insertBefore(draggedItem, afterElement)

}

})

function getDragAfterElement(container,y){

const elements=[...container.querySelectorAll("li:not(.dragging)")]

return elements.reduce((closest,child)=>{

const box=child.getBoundingClientRect()

const offset=y-box.top-box.height/2

if(offset<0 && offset>closest.offset){

return {offset:offset, element:child}

}else{

return closest

}

},{offset:Number.NEGATIVE_INFINITY}).element

}