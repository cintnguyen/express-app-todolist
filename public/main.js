let taskItem = document.getElementsByClassName("taskItem");

//updating completed and not completed tasks
Array.from(taskItem).forEach(function (element) {
  element.addEventListener('click', function () {
    const taskId = element.id
    console.log(element)

    fetch('/tasks', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'taskId': taskId,

      })
    })
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(data => {
        console.log(data)
        window.location.reload(true)
      })
  });
});


let trash = document.getElementsByClassName("fa-trash");

//deleting selected task items
Array.from(trash).forEach(function (element) {
  element.addEventListener('click', function () {
    let name = this.parentNode.parentNode.childNodes[1].innerText
    fetch('tasks', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'taskName': name
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});



let clearBtn = document.querySelector(".clear")

// deleting all tasks
clearBtn.addEventListener("click", clearAll)
function clearAll() {
  fetch('deleteAllTasks', {
    method: 'delete',
    headers: {
      'Content-Type': 'application/json'
    },
  }).then(function (response) {
    window.location.reload()
  })
}
