//							Search Filed Start 							
// var CONTACTS = [{
// 	id: 1,
// 	name: "Ivan",
// 	phoneNumber: "+38066464328",
// 	img: 'http://russianpoetry.ru/images/photos/medium/article85928.jpg'
// }, 	{
// 	id: 2,
// 	name: "Sanya",
// 	phoneNumber: "+38066464328",
// 	img: 'http://russianpoetry.ru/images/photos/medium/article85928.jpg'
// },	{
// 	id: 3,
// 	name: "Dima",
// 	phoneNumber: "+38066464328",
// 	img: 'http://russianpoetry.ru/images/photos/medium/article85928.jpg'
// },	{
// 	id: 4,
// 	name: "Luba",
// 	phoneNumber: "+38066464328",
// 	img: 'http://russianpoetry.ru/images/photos/medium/article85928.jpg'
// }];

// var Contact = React.createClass({
// 	render: function(){
// 		return <li className="contact">
// 				<img className="contact-img" src={this.props.img} width="60px" height="60px" />
// 				<div className="contact-info">
// 					<div className="contact-name">{this.props.name}</div>
// 					<div className="contact-phone">{this.props.phoneNumber}</div>
// 				</div>
// 			</li>;
// 	}
// });

// var ContactsList = React.createClass({
// 	getInitialState: function() {
// 		return {
// 			displayedContacts: CONTACTS
// 		};
// 	},

// 	handleSearch: function(event)	{
// 		var searchQuery = event.target.value.toLowerCase();
// 		var displayedContacts = CONTACTS.filter(function(el){
// 			var searchValue = el.name.toLowerCase();
// 			return searchValue.indexOf(searchQuery) !==	-1;
// 		});

// 		this.setState({
// 			displayedContacts: displayedContacts
// 		});
// 	},

// 	render: function() {
// 		return(
// 			<div className="contacts">
// 				<input type="text" className="search-field" onChange={this.handleSearch} />
// 				<ul className="contacts-list">
// 					{this.state.displayedContacts.map(function(el){
// 						return <Contact
// 						key={el.id}
// 						name={el.name}
// 						phoneNumber={el.phoneNumber}
// 						img={el.img}
// 						/>;
// 						})
// 					}
// 				</ul>
// 			</div>
// 			)
// 	}
// });

// ReactDOM.render(
// 	<ContactsList />,
// 	document.getElementById("root")
// 	);

//							Search Filed Start 																																										

//			Timer Start			

// var Timer  = React.createClass({
// 	getInitialState: function() {
// 		return {
// 			seconds: 0
// 		};
// 	},

// 	componentDidMount: function() {
// 		this.timer = setInterval(this.tick, 1000);
// 	},

// 	tick: function() {
// 		this.setState({seconds: this.state.seconds + 1});
// 	},

// 	componentWillUnmount: function() {
// 		clearInterval(this.timer);
// 	},

// 	render: function() {
// 		return (
// 			<h4>Уже прошло {this.state.seconds} секунд</h4>
// 			);
// 	}
// });

// ReactDOM.render(
// 	<Timer />,
// 	document.getElementById('root')
// 	);
// 						Timer End 																																													

var Note = React.createClass({
	render: function() {
		var style = { backgroundColor: this.props.color };
		return (
			<div className="note"style={style}>
			<span className="delete-note" onClick={this.props.onDelete}> &#735; </span>
			{this.props.children}
			
			</div>
		);
	}
});

var NoteEditor = React.createClass({
	getInitialState: function() {
		return {
			text: ''
		};
	},

	handleTextChange: function(event) {
		this.setState({ text: event.target.value });
	},

	handleNoteAdd: function() {
		var newNote = {
			text: this.state.text,
			color: 'yellow',
			id: Date.now()
		};

		this.props.onNoteAdd(newNote);
		this.setState({ text: '' });
	},

	render: function() {
		return (
			<div className="note-editor">
			<textarea placeholder="Вводите сюда текст..." 
								rows={5} 
								className="textarea" 
								value={this.state.text}
								onChange={this.handleTextChange}

								/>
			<button className="add-button" onClick={this.handleNoteAdd}>Добавить</button>
			</div>
		);
	}
});

var NotesGrid = React.createClass({
	componentDidMount: function() {
			var grid = this.refs.grid;
			 this.msnry = new Masonry( grid, {
				itemSelector: '.note',
				isFitWidth: true,
				gutter: 5
			});
	},

	componentDidUpdate: function(prevProps) {
		if (this.props.notes.length !== prevProps.notes.length) {
			this.msnry.reloadItems();
			this.msnry.layout();
			}
	},

	render: function() {
		var onNoteDelete = this.props.onNoteDelete;
		return (
				<div className="notes-grid" ref="grid">
				{
					this.props.notes.map(function(note){
						return (
							<Note 
							key={note.id} 
							onDelete={onNoteDelete.bind(null, note)}
							color={note.color}> {note.text} 
							</Note>
							);
					})
				}
				</div>
			);
	}
});

var NotesApp = React.createClass({
	getInitialState: function() {
		return {
			notes: []
		};
	},

	componentDidMount: function() {
		var localNotes = JSON.parse(localStorage.getItem('notes'));
		if (localNotes) {
			this.setState({ notes: localNotes });
		}
	},

	componentDidUpdate: function() {
		this._updateLocalStorage();
	},

	handleNoteDelete: function(note) {
		var noteId = note.id;
		var newNotes = this.state.notes.filter(function(note){
			return note.id !== noteId;
		});

		this.setState({ notes: newNotes });

	},

	handleNoteAdd: function(newNote) {
		var newNotes = this.state.notes.slice();
		newNotes.unshift(newNote);
		this.setState({ notes: newNotes }, this._updateLocalStorage)
	},

	render: function() {
		return (
				<div className="notes-app">
				<NoteEditor onNoteAdd={this.handleNoteAdd} />
				<NotesGrid notes={this.state.notes} onNoteDelete={this.handleNoteDelete}/>
				</div>
			);
	},

	_updateLocalStorage: function() {
		var notes = JSON.stringify(this.state.notes);
		localStorage.setItem('notes', notes);
	},

});

ReactDOM.render(
		<NotesApp />,
		document.getElementById('root')
	);