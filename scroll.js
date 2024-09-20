const taskInput = document.getElementById("InputOfTask");
const listContainer = document.getElementById("ContainerOfList");
var dateInput = document.getElementById('InputOfDate');

// Creating function which will get called once the button is pressed
function PuttingInTask() {
  let ValueOfTask = taskInput.value;
  let ValueOfDate = dateInput.value;
  let ValueOfPriority = document.getElementById('InputOfPriority').value; // Get the priority value
  
  // If no value is added, give an error message
  if (ValueOfTask === '') {
    alert("Value not entered!");
  } else {
    let task = {
      Detail: ValueOfTask,
      Date: ValueOfDate,
      Level: ValueOfPriority
    };

    let li = document.createElement("li");
    let textNode = document.createTextNode(`${task.Detail} - Due on: ${task.Date} - Priority Level: ${task.Level}`);
    li.appendChild(textNode);

    let span = document.createElement("span");
    span.textContent = "\u00D7"; // for cross (Delete button)
    span.className = 'close'; // class for the closing button
    li.appendChild(span);

    let shouldAppend = true;
    for (let value = 0; value < listContainer.children.length; value++) {
      let existingLi = listContainer.children[value];
      let existingPriority = existingLi.getAttribute('data-priority');
      if (ValueOfPriority === 'Very Important' && existingPriority !== 'Very Important' ||
          ValueOfPriority === 'Important' && existingPriority === 'Not Important') {
        listContainer.insertBefore(li, existingLi);
        shouldAppend = false;
        break;
      }
    }
    if (shouldAppend) {
      listContainer.appendChild(li);
    }

    // Now we set attributes for the new list
    li.setAttribute('data-priority', task.Level); // Change 'task.priority' to 'task.Level'
    li.setAttribute('data-name', task.Detail);
    li.setAttribute('data-dueDate', task.Date);

    // Clear input fields after entering the task
    taskInput.value = '';
    dateInput.value = '';
    document.getElementById('InputOfPriority').value = 'Important'; // This will also reset the priority value
    DataSave(); // Save the data
  }
}

listContainer.addEventListener("click", function(e){
  if(e.target.tagName === "LI"){
    e.target.classList.toggle("Ifchecked"); // if checked, then change the icon of the circle
    DataSave(); // save the data
  }
  else if(e.target.tagName === "SPAN"){
    e.target.parentElement.remove();
    DataSave(); // save if a task is removed
  }
}, false);

function DataSave() {
  let tasks = [];
  // Add tasks to the array
  for (let value = 0; value < listContainer.children.length; value++) {
    let li = listContainer.children[value]; 
    tasks.push({
      name: li.getAttribute('data-name'),
      dueDate: li.getAttribute('data-dueDate'),
      priority: li.getAttribute('data-priority'),
      completed: li.classList.contains('Ifchecked')
    });
  }
  // Store tasks as a JSON string
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function TaskShow() {
  let storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  storedTasks.sort((a, b) => {
    let priorities = {'Very Important': 1, 'Important': 2, 'Not Important': 3};
    return priorities[a.priority] - priorities[b.priority];
  });

  listContainer.innerHTML = ''; // Clear the list

  // Recreate the list
  storedTasks.forEach(task => {
    let li = document.createElement("li");
    if (task.completed) {
      li.classList.add('Ifchecked'); // Add the "Ifchecked" class for completed tasks
    }

    li.setAttribute('data-name', task.name);
    li.setAttribute('data-dueDate', task.dueDate);
    li.setAttribute('data-priority', task.priority);

    let textNode = document.createTextNode(`${task.name} - Due on: ${task.dueDate} - Priority Level: ${task.priority}`);
    li.appendChild(textNode);

    let span = document.createElement("span");
    span.textContent = "\u00D7";
    span.className = 'close';
    li.appendChild(span);

    listContainer.appendChild(li);
  });
}

// Call the function again to show the tasks
TaskShow();
