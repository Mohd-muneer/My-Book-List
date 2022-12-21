// functionality that we are going to perform 

// Book Class: Represents a Book.........................................................
class Book {
    constructor(title, author, isbn) {
      this.title = title;
      this.author = author;
      this.isbn = isbn;
    }
  }
  
  // UI Class: Handle UI Tasks...............................................................
  class UI {
    static displayBooks() {
        // const storedBooks =[
         //     {
         //         title:'Book One',
         //         author:'John Doe',
         //         isbn:'3434434',
         //     },
         //     {
         //         title:'Book Two',
         //         author:'Jane Doe',
         //         isbn:'45545',
         //     }
         // ];
      const books = Store.getBooks();
  
      books.forEach((book) => UI.addBookToList(book));
    }
  
    static addBookToList(book) {
      const list = document.querySelector('#book-list');
  
      const row = document.createElement('tr');
  
      row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete" id="delete">X</a></td>
        <td><button class="btn btn-success btn-sm" id="edit" onclick="editBook(${book.isbn})">EDIT</button></td>
      `;
  
      list.appendChild(row);
    }
  
    static deleteBook(el) {
      if(el.classList.contains('delete')) {
        el.parentElement.parentElement.remove();
      }
    }
  
    static showAlert(message, className) {
      const div = document.createElement('div');
      div.className = `alert alert-${className}`;
      div.appendChild(document.createTextNode(message));
      const container = document.querySelector('.container');
      const form = document.querySelector('#book-form');
      container.insertBefore(div, form);
  
      // Vanish in 3 seconds
      setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }
  
    static clearFields() {
      document.querySelector('#title').value = '';
      document.querySelector('#author').value = '';
      document.querySelector('#isbn').value = '';
    }
  }
  
  function editBook(isbn) {
    // Set Button Text
    document.getElementById('addBook').value="Edit Book";
    // Get Books
    const books = Store.getBooks();
    // Assign values to there respective fields
    books.forEach((book, index) => {
      // console.log(book.title +" "+ typeof book.isbn+" "+typeof isbn);
      if(book.isbn == isbn) {
        // console.log(book.title);
        console.log('entering edit book fun');
        document.getElementById('title').value=book.title;
        document.getElementById('author').value=book.author;
        document.getElementById('isbn').value=book.isbn;
      }
    });
    
    
  }
  // Store Class: Handles Storage....................................................
  class Store {
    static getBooks() {
      let books;
      if(localStorage.getItem('books') === null) {
        books = [];
      } else {
        books = JSON.parse(localStorage.getItem('books'));
      }
  
      return books;
    }
  
    static addBook(book) {
      // console.log(book);
      const books = Store.getBooks();
      books.push(book);
      localStorage.setItem('books', JSON.stringify(books));
      console.log('entering add book fun');
    }

    static editBook(editData) {
      const books = Store.getBooks();
      let edited = false;
      books.forEach((book, index) => {
        // console.log(book.title +" "+ typeof book.isbn+" "+typeof isbn);
        if(book.isbn == editData.isbn) {
          edited = true;
          books.splice(index, 1);
          books.splice(index, 0, editData);
        }
      });
      // console.log('enetring edit data');
      //resfresh
      window.location.reload();
      if (!edited){
        books.push(editData);
        localStorage.setItem('books', JSON.stringify(books));
        UI.showAlert('ISBN update Added New Book', 'success');
      } else {
        localStorage.setItem('books', JSON.stringify(books));
        UI.showAlert('Details Updated', 'success');
      }
    }
  
    static removeBook(isbn) {
      const books = Store.getBooks();
  
      books.forEach((book, index) => {
        if(book.isbn === isbn) {
          books.splice(index, 1);
        }
      });
  
      localStorage.setItem('books', JSON.stringify(books));
    }
  }
  // console.log(localStorage);
  
  // Event: Display Books.........................................................................
  document.addEventListener('DOMContentLoaded', UI.displayBooks);
  
  // Event: Add a Book............................................................................
  document.querySelector('#book-form').addEventListener('submit', (e) => {
    // Prevent actual submit
    e.preventDefault();

    if (document.getElementById('addBook').value === 'Add Book'){
      // Get form values
      const title = document.querySelector('#title').value;
      const author = document.querySelector('#author').value;
      const isbn = document.querySelector('#isbn').value;
    
      // Validate
      if(title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all fields', 'danger');
      } else {
        // Instatiate book
        const book = new Book(title, author, isbn);
    
        // Add Book to UI
        UI.addBookToList(book);
    
        // Add book to store
        Store.addBook(book);
    
        // Show success message
        UI.showAlert('Book Added Successfully', 'success');
    
        // Clear fields
        UI.clearFields();
      }
    } else if (document.getElementById('addBook').value === 'Edit Book'){
      const title = document.querySelector('#title').value;
      const author = document.querySelector('#author').value;
      const isbn = document.querySelector('#isbn').value;
    
      // Validate
      if(title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all fields', 'danger');
      }else {
        const book = new Book(title,author,isbn);

        //Edit Book in UI

        //Edit Book Store
        Store.editBook(book);

        UI.displayBooks();
      }
      // console.log("it's Edit");
    }
  });
  
  // Event: Remove a Book................................................................................
  document.querySelector('#book-list').addEventListener('click', (e) => {
    const action = e.target.id;

    if (action === 'delete') {
      // Remove book from UI
      UI.deleteBook(e.target);
    
      // Remove book from store
      Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    
      // Show success message
      UI.showAlert('Book Removed', 'success');
    }
  });