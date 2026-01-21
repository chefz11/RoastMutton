export const BOOKS = [
  {
    id: 'hobbit',
    title: 'The Hobbit',
    subtitle: 'There and Back Again',
    totalPages: 275,
    movieParts: [
      { id: 'hobbit1', title: 'An Unexpected Journey', runtime: 182 },
      { id: 'hobbit2', title: 'The Desolation of Smaug', runtime: 186 },
      { id: 'hobbit3', title: 'The Battle of the Five Armies', runtime: 164 }
    ],
    chapters: [
      { number: 1, title: 'An Unexpected Party', pages: 25, moviePart: 'hobbit1' },
      { number: 2, title: 'Roast Mutton', pages: 16, moviePart: 'hobbit1' },
      { number: 3, title: 'A Short Rest', pages: 10, moviePart: 'hobbit1' },
      { number: 4, title: 'Over Hill and Under Hill', pages: 13, moviePart: 'hobbit1' },
      { number: 5, title: 'Riddles in the Dark', pages: 20, moviePart: 'hobbit1' },
      { number: 6, title: 'Out of the Frying-Pan into the Fire', pages: 20, moviePart: 'hobbit1' },
      { number: 7, title: 'Queer Lodgings', pages: 27, moviePart: 'hobbit2' },
      { number: 8, title: 'Flies and Spiders', pages: 27, moviePart: 'hobbit2' },
      { number: 9, title: 'Barrels Out of Bond', pages: 18, moviePart: 'hobbit2' },
      { number: 10, title: 'A Warm Welcome', pages: 12, moviePart: 'hobbit2' },
      { number: 11, title: 'On the Doorstep', pages: 9, moviePart: 'hobbit2' },
      { number: 12, title: 'Inside Information', pages: 20, moviePart: 'hobbit2' },
      { number: 13, title: 'Not at Home', pages: 9, moviePart: 'hobbit2' },
      { number: 14, title: 'Fire and Water', pages: 11, moviePart: 'hobbit3' },
      { number: 15, title: 'The Gathering of the Clouds', pages: 9, moviePart: 'hobbit3' },
      { number: 16, title: 'A Thief in the Night', pages: 10, moviePart: 'hobbit3' },
      { number: 17, title: 'The Clouds Burst', pages: 6, moviePart: 'hobbit3' },
      { number: 18, title: 'The Return Journey', pages: 11, moviePart: 'hobbit3' },
      { number: 19, title: 'The Last Stage', pages: 8, moviePart: 'hobbit3' }
    ]
  },
  {
    id: 'fellowship',
    title: 'The Fellowship of the Ring',
    subtitle: 'Being the First Part of The Lord of the Rings',
    totalPages: 423,
    movieParts: [
      { id: 'fotr', title: 'The Fellowship of the Ring', runtime: 228 }
    ],
    chapters: [
      { book: 1, number: 1, title: 'A Long-expected Party', pages: 26, moviePart: 'fotr' },
      { book: 1, number: 2, title: 'The Shadow of the Past', pages: 30, moviePart: 'fotr' },
      { book: 1, number: 3, title: 'Three is Company', pages: 26, moviePart: 'fotr' },
      { book: 1, number: 4, title: 'A Short Cut to Mushrooms', pages: 15, moviePart: 'fotr' },
      { book: 1, number: 5, title: 'A Conspiracy Unmasked', pages: 13, moviePart: 'fotr' },
      { book: 1, number: 6, title: 'The Old Forest', pages: 19, moviePart: 'fotr' },
      { book: 1, number: 7, title: 'In the House of Tom Bombadil', pages: 15, moviePart: null },
      { book: 1, number: 8, title: 'Fog on the Barrow-downs', pages: 17, moviePart: null },
      { book: 1, number: 9, title: 'At the Sign of the Prancing Pony', pages: 16, moviePart: 'fotr' },
      { book: 1, number: 10, title: 'Strider', pages: 18, moviePart: 'fotr' },
      { book: 1, number: 11, title: 'A Knife in the Dark', pages: 24, moviePart: 'fotr' },
      { book: 1, number: 12, title: 'Flight to the Ford', pages: 23, moviePart: 'fotr' },
      { book: 2, number: 1, title: 'Many Meetings', pages: 24, moviePart: 'fotr' },
      { book: 2, number: 2, title: 'The Council of Elrond', pages: 39, moviePart: 'fotr' },
      { book: 2, number: 3, title: 'The Ring Goes South', pages: 28, moviePart: 'fotr' },
      { book: 2, number: 4, title: 'A Journey in the Dark', pages: 30, moviePart: 'fotr' },
      { book: 2, number: 5, title: 'The Bridge of Khazad-dûm', pages: 14, moviePart: 'fotr' },
      { book: 2, number: 6, title: 'Lothlórien', pages: 24, moviePart: 'fotr' },
      { book: 2, number: 7, title: 'The Mirror of Galadriel', pages: 17, moviePart: 'fotr' },
      { book: 2, number: 8, title: 'Farewell to Lórien', pages: 18, moviePart: 'fotr' },
      { book: 2, number: 9, title: 'The Great River', pages: 17, moviePart: 'fotr' },
      { book: 2, number: 10, title: 'The Breaking of the Fellowship', pages: 14, moviePart: 'fotr' }
    ]
  },
  {
    id: 'towers',
    title: 'The Two Towers',
    subtitle: 'Being the Second Part of The Lord of the Rings',
    totalPages: 352,
    movieParts: [
      { id: 'ttt', title: 'The Two Towers', runtime: 235 }
    ],
    chapters: [
      { book: 3, number: 1, title: 'The Departure of Boromir', pages: 10, moviePart: 'ttt' },
      { book: 3, number: 2, title: 'The Riders of Rohan', pages: 32, moviePart: 'ttt' },
      { book: 3, number: 3, title: 'The Uruk-hai', pages: 19, moviePart: 'ttt' },
      { book: 3, number: 4, title: 'Treebeard', pages: 32, moviePart: 'ttt' },
      { book: 3, number: 5, title: 'The White Rider', pages: 22, moviePart: 'ttt' },
      { book: 3, number: 6, title: 'The King of the Golden Hall', pages: 24, moviePart: 'ttt' },
      { book: 3, number: 7, title: "Helm's Deep", pages: 20, moviePart: 'ttt' },
      { book: 3, number: 8, title: 'The Road to Isengard', pages: 21, moviePart: 'ttt' },
      { book: 3, number: 9, title: 'Flotsam and Jetsam', pages: 20, moviePart: 'ttt' },
      { book: 3, number: 10, title: 'The Voice of Saruman', pages: 13, moviePart: 'ttt' },
      { book: 3, number: 11, title: 'The Palantír', pages: 16, moviePart: 'ttt' },
      { book: 4, number: 1, title: 'The Taming of Sméagol', pages: 17, moviePart: 'ttt' },
      { book: 4, number: 2, title: 'The Passage of the Marshes', pages: 17, moviePart: 'ttt' },
      { book: 4, number: 3, title: 'The Black Gate is Closed', pages: 15, moviePart: 'ttt' },
      { book: 4, number: 4, title: 'Of Herbs and Stewed Rabbit', pages: 15, moviePart: 'ttt' },
      { book: 4, number: 5, title: 'The Window on the West', pages: 20, moviePart: 'ttt' },
      { book: 4, number: 6, title: 'The Forbidden Pool', pages: 11, moviePart: 'ttt' },
      { book: 4, number: 7, title: 'Journey to the Cross-roads', pages: 9, moviePart: 'ttt' },
      { book: 4, number: 8, title: 'The Stairs of Cirith Ungol', pages: 14, moviePart: 'ttt' },
      { book: 4, number: 9, title: "Shelob's Lair", pages: 11, moviePart: 'ttt' },
      { book: 4, number: 10, title: 'The Choices of Master Samwise', pages: 16, moviePart: 'ttt' }
    ]
  },
  {
    id: 'return',
    title: 'The Return of the King',
    subtitle: 'Being the Third Part of The Lord of the Rings',
    totalPages: 416,
    movieParts: [
      { id: 'rotk', title: 'The Return of the King', runtime: 263 }
    ],
    chapters: [
      { book: 5, number: 1, title: 'Minas Tirith', pages: 27, moviePart: 'rotk' },
      { book: 5, number: 2, title: 'The Passing of the Grey Company', pages: 22, moviePart: 'rotk' },
      { book: 5, number: 3, title: 'The Muster of Rohan', pages: 16, moviePart: 'rotk' },
      { book: 5, number: 4, title: 'The Siege of Gondor', pages: 26, moviePart: 'rotk' },
      { book: 5, number: 5, title: 'The Ride of the Rohirrim', pages: 12, moviePart: 'rotk' },
      { book: 5, number: 6, title: 'The Battle of the Pelennor Fields', pages: 13, moviePart: 'rotk' },
      { book: 5, number: 7, title: 'The Pyre of Denethor', pages: 10, moviePart: 'rotk' },
      { book: 5, number: 8, title: 'The Houses of Healing', pages: 16, moviePart: 'rotk' },
      { book: 5, number: 9, title: 'The Last Debate', pages: 13, moviePart: 'rotk' },
      { book: 5, number: 10, title: 'The Black Gate Opens', pages: 15, moviePart: 'rotk' },
      { book: 6, number: 1, title: 'The Tower of Cirith Ungol', pages: 22, moviePart: 'rotk' },
      { book: 6, number: 2, title: 'The Land of Shadow', pages: 21, moviePart: 'rotk' },
      { book: 6, number: 3, title: 'Mount Doom', pages: 18, moviePart: 'rotk' },
      { book: 6, number: 4, title: 'The Field of Cormallen', pages: 11, moviePart: 'rotk' },
      { book: 6, number: 5, title: 'The Steward and the King', pages: 14, moviePart: 'rotk' },
      { book: 6, number: 6, title: 'Many Partings', pages: 18, moviePart: 'rotk' },
      { book: 6, number: 7, title: 'Homeward Bound', pages: 11, moviePart: 'rotk' },
      { book: 6, number: 8, title: 'The Scouring of the Shire', pages: 25, moviePart: null },
      { book: 6, number: 9, title: 'The Grey Havens', pages: 12, moviePart: 'rotk' }
    ]
  }
];

export const getBookById = (id) => BOOKS.find(book => book.id === id);
export const getAllChapters = () => BOOKS.flatMap(book =>
  book.chapters.map(ch => ({ ...ch, bookId: book.id, bookTitle: book.title }))
);
