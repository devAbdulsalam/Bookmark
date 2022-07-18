const author = document.getElementById("author");
const bookName = document.getElementById("book_Name");
const date = document.getElementById("date");
const submitBtn = document.getElementById("submitBtn")
const  list = document.getElementById("book_list");
const clearBtn = document.querySelector(".clear_btn_container")

// Generate Book ID
var bookId;
var myVar = setInterval(generateBookId ,1000);
function generateBookId() {
  bookId = new Date().getTime().toString();
  return bookId
}
 // generate Book Id
generateBookId();


// edit options
let editedBook = "";
let editIsActivated = false;
let editedBookID = "";



class Book{
    constructor( author, bookName, isbn, date){ 
    this.author = author;
    this.bookName = bookName;
    this.isbn = isbn;
    this.date= date;
    }
}
 

class UI {

    addBookToList(book, bookId){
        // console.log(bookId)
        // console.log(book)
        const list = document.getElementById('book_list')
        const row = document.createElement('tr');
        // get book ID
        const BookId = document.createAttribute("data-id");
        BookId.value = bookId;
        row.setAttributeNode(BookId);
        row.innerHTML = `
        <td>${book["author"]}</td>
        <td>${book["bookName"]}</td>
        <td>${book["isbn"]}</td>
        <td class="tdWithBtn">
            <p>${book["date"]}</p>
            <div id="btn_td">
                <button class="edit-btn">
                    <i class="fa far fa-edit edit icon"></i>
                </button>
                <button class="delete_btn">
                    <i class="fa fa-trash delete icon"></i>
                </button>
            </div>
            </td>
        `;
        list.appendChild(row);
        // console.log(bookId);
        // to access the edit and delete buttons
        const deleteBtn = row.querySelector('.delete')
        const editBtn = row.querySelector('.edit')
        deleteBtn.addEventListener('click', deleteBook)
        editBtn.addEventListener('click', editBook)
    };
    
    // show alerts
    showAlert(message, className){
        const div = document.createElement('div');
        // Add class Name

        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.form_container');

        // get form
        const form = document.querySelector('#book_form');

        // insert alert
        container.insertBefore(div, form);

        // timeout after 3 sec
        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 1000);
    };

    // Show clear_btn_container
    showClearbtn(){
       let listitem = list.children.length
        for(let i = 0; i < listitem; i++ ){
            clearBtn.classList.add("show_clearBtn");
        }
    }

    clearFields(){
        document.getElementById("author").value = "";
        document.getElementById("book_Name").value = "";
        document.getElementById("isbn").value = "";
        document.getElementById("date").value = "";
        // unactivate edit
        editIsActivated = false;

    }
};

// event listener for submit
document.getElementById('book_form').addEventListener('submit', function(e){
    e.preventDefault();
     
    // get form value
    const author = document.getElementById("author").value;
    const bookName = document.getElementById("book_Name").value;
    const isbn = document.getElementById("isbn").value;
    const date = document.getElementById("date").value;
    
    // instatiate book
    const book = new Book(author, bookName, isbn, date); 
    // console.log(book);

    // instatiate UI
    const ui = new UI();   

    //Validate Form

    if (author === "" || bookName === "" || isbn === "" || date === ""){
        // errow alert
        ui.showAlert('please fill in all fields', 'error')
    } else if (editIsActivated === true){
        console.log("edit is active");
        
        
        // // add editedBook to back list
        addBookToTable()
        
        //show sucess of edit
        ui.showAlert('Book has been Edited and Added', 'success');

    }
    else {
        // Add book to list
        ui.addBookToList(book);
        // console.log(book);


        //savebok to local storage
        saveBookToLocalStorage(bookId, book)

        //show sucess
        ui.showAlert('Book Added', 'success');
        
        // Show clear_btn_container
        ui.showClearbtn()
    
        // clear fields
        ui.clearFields(); 
    };
});

// function for edit
function editBook(e){

    // activate edit
    editIsActivated = true;
   // instantiate UI
    const ui = new UI();
    // edit book

    const editedBook = e.currentTarget.parentElement.parentElement.parentElement.parentElement;

    editedBookID = editedBook.dataset.id;  // editedBookID
    // console.log(editedBookID);
 
    // // // set row to be edited to form
    // author.value = editedBook.firstElementChild.innerHTML;
    // bookName.value= editedBook.children[1].innerHTML;
    // isbn.value = editedBook.children[2].innerHTML;
    // date.value = editedBook.children[3].innerHTML;

                    //// or

    // //get Book from LocalStorage 
        let items = getlocalStorage();
            items = items.map(function (item){
                if (item.bookId === editedBookID){
                    // console.log(item)
                    // console.log(item.book)
                    author.value = item.book.author;
                    bookName.value = item.book.bookName;
                    isbn.value = item.book.isbn;
                    date.value = item.book.date;
                
                }
            });

    // change the editBook beackroung color
        changebgForEditRow(editedBook);

    editedBook.classList.add("editRowBg")

    // change submit button to edit button 
    submitBtn.value = "Edit Book";


    // show message
    ui.showAlert('You want to make changes to the book!', 'error');
    

    addBookToTable = function(){

        // add editedBook to back list
        editBookInLocalStorage(editedBookID, editedBook)

        // change the editBook beackroung color 
        editedBook.classList.remove("editRowBg")
        
        list.removeChild(editedBook)
        // change submit button to edit button
        submitBtn.value = "SUBMIT";

        
    }

};

// change the editBook beackroung color
    function changebgForEditRow(editedBook, editRowBg){
    const row = list.querySelectorAll('tr');
    row.forEach(function(checkbg){
        checkbg.classList.remove("editRowBg")
    })
};

//function to delete book,
function deleteBook(e){

    // instantiate UI
    const ui = new UI();

    // delete book
    const row = e.currentTarget.parentElement.parentElement.parentElement.parentElement;
    // delete book from local storage
    let deleteBookId = row.dataset.id;
    // console.log(deleteBookId)
    deleteBookfromLocalStorage(deleteBookId)


    list.removeChild(row)

    // Show clear_btn_container
    ui.showClearbtn()

    // clear fields
    ui.clearFields(); 

    // show message
    ui.showAlert('Book Removed!', 'success')
};
    

    // eventlistener for clear table
function clearTable(){

    // Get table and table row
    const  list = document.getElementById("book_list");
    const tablerow =document.querySelectorAll("tr")
    
    
    if (tablerow.length > 0){
        tablerow.forEach(function(){
            const tablerows = list.children;
            list.remove(tablerows);
        });
    }
    //  clear localStorage
    localStorage.clear(bookId);

    // instantiate UI for alert message
    const ui = new UI();
    
    // show message
    ui.showAlert('Table is cleared!', 'success')

    window.location.reload();
    
};


//savebok to local storage
function saveBookToLocalStorage(bookId, book){
    const Book = {bookId, book};
     let items = getlocalStorage();

     items.push(Book);
    localStorage.setItem("Books", JSON.stringify(items))
        // console.log("book has been saved");

    };

// edit book in local Storage
function editBookInLocalStorage(editedBookID){
        let items = getlocalStorage();
        items = items.map(function (item){
            if (item.bookId === editedBookID){
                console.log(item)
                console.log(item.book)

                item.book.author = author.value;
                item.book.bookName =  bookName.value;
                item.book.isbn = isbn.value;
                item.book.date = date.value;
                console.log(item.book)
                
                const ui = new UI();
            
                // Add book to list
                ui.addBookToList(item.book, item.bookId);
                window.location.reload();
            }
            return item
        })
        localStorage.setItem("Books", JSON.stringify(items));
    };

// delete book from local Storage
function deleteBookfromLocalStorage(deleteBookId){
    let items = getlocalStorage();
    items = items.filter(function (item){
        if (item.bookId !== deleteBookId){
            return item
        }
    })
    // instatiate UI
    const ui = new UI();
    
    // clear fields
    ui.clearFields(); 

    localStorage.setItem("Books", JSON.stringify(items));
};

window.addEventListener('DOMContentLoaded', setupBooks())

function setupBooks(){
    let items = getlocalStorage();
    // console.log(items)
    if (items.length > 0){
       items.forEach(function(item){
           
        //    console.log(item.book)
        //    console.log(item.bookId)
        // instatiate UI
        const ui = new UI();
    
        // Add book to list
        ui.addBookToList(item.book, item.bookId);

        // Show clear_btn_container
        ui.showClearbtn()
        
        });   
    }
};


// function to get localStorage
function getlocalStorage(){
    const fromLocal = JSON.parse(localStorage.getItem("Books"));
    if (fromLocal === null) {
        return []
    } else {
        return fromLocal
    }
    // // or using tenary operator
    // return localStorage.getItem("Books") ? 
    // JSON.parse(localStorage.getItem("Books")) : [];
}
