{
	;('use strict')

	const select = {
		templateOf: {
			templateBook: '#template-book',
		},
		containerOf: {
			booksList: '.books-list',
			bookImg: '.book__image',
			filters: '.filters',
		},
	}

	class BooksList {
		constructor() {
			this.initData()
			this.render()
			this.initActions()
			this.hideBooks()
		}

		initData() {
			this.data = dataSource.books
		}

		render() {
			for (let book in this.data) {
				const HTMLData = {
					name: this.data[book].name,
					price: this.data[book].price,
					rating: this.data[book].rating,
					image: this.data[book].image,
					id: this.data[book].id,
					ratingWidth: this.data[book].rating * 10,
					ratingBgc: this.setBarColor(this.data[book].rating),
				}

				const templates = {
					templateBook: Handlebars.compile(document.querySelector(select.templateOf.templateBook).innerHTML),
				}

				const generatedHTML = templates.templateBook(HTMLData)
				book = utils.createDOMFromHTML(generatedHTML)
				const bookContainer = document.querySelector(select.containerOf.booksList)
				bookContainer.appendChild(book)
			}
		}

		initActions() {
			this.filters = []
			let favoriteBooks = []

			document.querySelector(select.containerOf.booksList).addEventListener('dblclick', function (e) {
				e.preventDefault()
				// console.log(e.target.offsetParent);

				if (
					!favoriteBooks.includes(e.target.offsetParent.getAttribute('data-id')) &&
					e.target.offsetParent.classList.contains('book__image')
				) {
					favoriteBooks.push(e.target.offsetParent.getAttribute('data-id'))
					e.target.offsetParent.classList.add('favorite')
				} else if (
					favoriteBooks.includes(e.target.offsetParent.getAttribute('data-id')) &&
					e.target.offsetParent.classList.contains('book__image')
				) {
					e.target.offsetParent.classList.remove('favorite')
					const bookIndex = favoriteBooks.indexOf(e.target.offsetParent.getAttribute('data-id'))
					favoriteBooks.splice(bookIndex, 1)
				}
			})

			document.querySelector(select.containerOf.filters).addEventListener('click', e => {
				if (e.target.tagName == 'INPUT' && e.target.type == 'checkbox' && e.target.name == 'filter') {
					// console.log('this', this);
					if (e.target.checked) {
						// console.log('this.filters', this.filters);
						this.filters.push(e.target.value)
					} else if (!e.target.checked) {
						const index = this.filters.indexOf(e.target.value)
						this.filters.splice(index, 1)
					}
				}
				this.hideBooks()
			})
		}

		hideBooks() {
			for (let book of this.data) {
				if (book.details.adults == true && this.filters.includes('adults')) {
					if (document.querySelector(select.containerOf.bookImg).getAttribute('data-id') == book.id) {
						document.querySelector(`[data-id="${book.id}"]`).classList.add('hidden')
					}
				} else if (book.details.adults == true && !this.filters.includes('adults')) {
					document.querySelector(`[data-id="${book.id}"]`).classList.remove('hidden')
				}

				let arr = []

				if (book.details.nonFiction == true && this.filters.includes('nonFiction')) {
					arr.push(book.id)

					for (let one of arr) {
						document.querySelector(`[data-id="${one}"]`).classList.add('hidden')
					}
				} else if (book.details.nonFiction == true && !this.filters.includes('nonFiction')) {
					arr.push(book.id)
					for (let one of arr) {
						document.querySelector(`[data-id="${one}"]`).classList.remove('hidden')
					}
				}
			}
		}

		setBarColor(rating) {
			if (rating < 6) {
				return 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)'
			} else if (rating > 6 && rating <= 8) {
				return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)'
			} else if (rating > 8 && rating <= 9) {
				return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)'
			} else if (rating > 9) {
				return 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)'
			}
		}
	}
	new BooksList()
}
