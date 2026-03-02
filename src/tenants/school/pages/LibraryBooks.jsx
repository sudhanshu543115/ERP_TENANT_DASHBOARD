// LibraryBooks.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    BookOpenIcon,
    PlusIcon,
    UserIcon,
    IdentificationIcon,
    TagIcon,
    BuildingOfficeIcon,
    CalendarIcon,
    BookmarkIcon,
    DocumentTextIcon,
    GlobeAltIcon,
    HashtagIcon,
    CurrencyDollarIcon,
    ViewColumnsIcon,
    BuildingLibraryIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ExclamationCircleIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    XMarkIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    HeartIcon,
    EyeIcon,
    PencilSquareIcon,
    TrashIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import {
    useGetAllLibrariesQuery,
    useGetBooksByLibraryQuery,
    useAddBookMutation,
    useUpdateBookMutation,
    useDeleteBookMutation
} from '../api/libraryApi';
import Form from '../../../common/components/ui/Form';
import StatsCard from '../../../common/components/ui/StatsCard';
import SearchBar from '../../../common/components/ui/SearchBar';

const LibraryBooks = () => {
    const { tenantName } = useParams();
    const [selectedLibraryId, setSelectedLibraryId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [formData, setFormData] = useState({});
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('title');
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(12);
    const [favorites, setFavorites] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    // Fetch Libraries
    const { data: librariesData, isLoading: librariesLoading } = useGetAllLibrariesQuery(tenantName);
    
    const libraries = useMemo(() => {
        if (!librariesData) return [];
        return Array.isArray(librariesData) ? librariesData : 
               librariesData?.data || librariesData?.libraries || [];
    }, [librariesData]);

    // Auto-select first library
    useEffect(() => {
        if (libraries.length > 0 && !selectedLibraryId) {
            const firstLibId = libraries[0].id || libraries[0]._id;
            if (firstLibId) {
                setSelectedLibraryId(firstLibId);
            }
        }
    }, [libraries, selectedLibraryId]);

    // Fetch Books
    const { data: booksData, isLoading: booksLoading, error: booksError, refetch: refetchBooks } = useGetBooksByLibraryQuery(
        { tenantName, libraryId: selectedLibraryId },
        { skip: !selectedLibraryId }
    );

    const [addBook, { isLoading: isAdding }] = useAddBookMutation();
    const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
    const [deleteBook] = useDeleteBookMutation();

    const books = useMemo(() => {
        if (!booksData) return [];
        return Array.isArray(booksData) ? booksData : 
               booksData?.data || booksData?.books || [];
    }, [booksData]);

    // Get unique categories
    const categories = useMemo(() => {
        const cats = ['all', ...new Set(books.map(b => b.category).filter(Boolean))];
        return cats;
    }, [books]);

    // Filter and sort books
    const filteredBooks = useMemo(() => {
        let filtered = books.filter(book => {
            const matchesSearch = searchTerm === '' || 
                book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.isbn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.description?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
            
            return matchesSearch && matchesCategory;
        });

        // Sort
        filtered.sort((a, b) => {
            if (sortBy === 'title') return a.title?.localeCompare(b.title);
            if (sortBy === 'author') return a.author?.localeCompare(b.author);
            if (sortBy === 'year') return (b.publishYear || 0) - (a.publishYear || 0);
            if (sortBy === 'price') return (b.price || 0) - (a.price || 0);
            return 0;
        });

        return filtered;
    }, [books, searchTerm, selectedCategory, sortBy]);

    // Pagination
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
    const totalBooks = books.length;
    const availableBooks = books.filter(b => b.quantity > 0).length;
    const uniqueCategories = categories.length - 1; // subtract 'all'
    const totalValue = books.reduce((sum, book) => sum + (book.price || 0) * (book.quantity || 0), 0);

    // Configuration
    const bookFields = {
        coverImage: { label: 'Cover Image', type: 'image', icon: PhotoIcon, tab: 'basic' },
        title: { label: 'Title', type: 'text', icon: BookOpenIcon, tab: 'basic' },
        author: { label: 'Author', type: 'text', icon: UserIcon, tab: 'basic' },
        isbn: { label: 'ISBN', type: 'text', icon: IdentificationIcon, tab: 'basic' },
        category: { label: 'Category', type: 'text', icon: TagIcon, tab: 'basic' },
        publisher: { label: 'Publisher', type: 'text', icon: BuildingOfficeIcon, tab: 'basic' },
        publishYear: { label: 'Publish Year', type: 'number', icon: CalendarIcon, tab: 'basic' },
        edition: { label: 'Edition', type: 'text', icon: BookmarkIcon, tab: 'basic' },
        pages: { label: 'Pages', type: 'number', icon: DocumentTextIcon, tab: 'basic' },
        language: { label: 'Language', type: 'text', icon: GlobeAltIcon, tab: 'basic' },
        quantity: { label: 'Quantity', type: 'number', icon: HashtagIcon, tab: 'basic' },
        price: { label: 'Price', type: 'number', icon: CurrencyDollarIcon, tab: 'basic' },
        shelf: { label: 'Shelf', type: 'text', icon: ViewColumnsIcon, tab: 'location' },
        rack: { label: 'Rack', type: 'text', icon: ViewColumnsIcon, tab: 'location' },
        description: { label: 'Description', type: 'textarea', icon: DocumentTextIcon, tab: 'basic' }
    };

    // Handlers
    const handleCreate = () => {
        if (!selectedLibraryId) {
            alert("Please select a library first.");
            return;
        }
        setSelectedBook(null);
        setFormData({});
        setIsModalOpen(true);
    };

    const handleEdit = (book) => {
        setSelectedBook(book);
        setFormData(book);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await deleteBook({ tenantName, id }).unwrap();
                refetchBooks();
            } catch (error) {
                alert('Failed to delete book');
            }
        }
    };

    const handleSubmit = async (data) => {
        try {
            if (selectedBook) {
                await updateBook({ tenantName, id: selectedBook.id || selectedBook._id, data }).unwrap();
            } else {
                await addBook({ tenantName, libraryId: selectedLibraryId, data }).unwrap();
            }
            setIsModalOpen(false);
            refetchBooks();
        } catch (error) {
            alert(error?.data?.message || 'Something went wrong');
        }
    };

    const toggleFavorite = (bookId) => {
        setFavorites(prev => 
            prev.includes(bookId) 
                ? prev.filter(id => id !== bookId)
                : [...prev, bookId]
        );
    };

    // Book Card Component
    const BookCard = ({ book }) => {
        const [showDetails, setShowDetails] = useState(false);
        const bookId = book.id || book._id;
        const isFavorite = favorites.includes(bookId);

        return (
            <div 
                className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700"
                onMouseEnter={() => setShowDetails(true)}
                onMouseLeave={() => setShowDetails(false)}
            >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-700 dark:to-slate-800">
                    {book.coverImageUrl || book.image ? (
                        <img 
                            src={book.coverImageUrl || book.image} 
                            alt={book.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <PhotoIcon className="w-20 h-20 text-slate-300 dark:text-slate-600" />
                        </div>
                    )}
                    
                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute top-3 right-3 flex gap-2">
                            <button
                                onClick={() => toggleFavorite(bookId)}
                                className="p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-all transform hover:scale-110"
                            >
                                {isFavorite ? (
                                    <HeartIconSolid className="w-4 h-4 text-rose-500" />
                                ) : (
                                    <HeartIcon className="w-4 h-4 text-slate-700" />
                                )}
                            </button>
                            <button
                                onClick={() => handleEdit(book)}
                                className="p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-all transform hover:scale-110"
                            >
                                <PencilSquareIcon className="w-4 h-4 text-indigo-600" />
                            </button>
                            <button
                                onClick={() => handleDelete(bookId)}
                                className="p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-all transform hover:scale-110"
                            >
                                <TrashIcon className="w-4 h-4 text-rose-600" />
                            </button>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                            book.quantity > 0 
                                ? 'bg-emerald-500/90 text-white' 
                                : 'bg-rose-500/90 text-white'
                        }`}>
                            {book.quantity > 0 ? 'Available' : 'Out of Stock'}
                        </span>
                    </div>

                    {/* Price Badge */}
                    {book.price && (
                        <div className="absolute bottom-3 left-3">
                            <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-sm font-bold shadow-lg">
                                ${book.price}
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 line-clamp-1">
                        {book.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1">
                        <UserIcon className="w-4 h-4" />
                        {book.author || 'Unknown Author'}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                        {book.category && (
                            <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-medium">
                                {book.category}
                            </span>
                        )}
                        {book.language && (
                            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-medium">
                                {book.language}
                            </span>
                        )}
                    </div>

                    {/* Description - from API */}
                    {book.description && (
                        <div className={`mt-3 text-sm text-slate-600 dark:text-slate-400 transition-all duration-300 ${
                            showDetails ? 'line-clamp-none' : 'line-clamp-2'
                        }`}>
                            {book.description}
                        </div>
                    )}

                    {/* Quick Info */}
                    <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-3">
                        {book.publishYear && (
                            <div className="flex items-center gap-1">
                                <CalendarIcon className="w-3 h-3" />
                                <span>{book.publishYear}</span>
                            </div>
                        )}
                        {book.pages && (
                            <div className="flex items-center gap-1">
                                <DocumentTextIcon className="w-3 h-3" />
                                <span>{book.pages}p</span>
                            </div>
                        )}
                        {book.isbn && (
                            <div className="flex items-center gap-1">
                                <IdentificationIcon className="w-3 h-3" />
                                <span className="truncate">{book.isbn.slice(-4)}</span>
                            </div>
                        )}
                    </div>

                    {/* Quantity Indicator */}
                    <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            Quantity: {book.quantity || 0}
                        </span>
                        <div className="flex gap-1">
                            {[...Array(Math.min(book.quantity || 0, 5))].map((_, i) => (
                                <div key={i} className="w-2 h-2 bg-indigo-500 rounded-full" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // List View Component
    const BookListItem = ({ book }) => (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex gap-4">
                <div className="w-24 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-slate-700 dark:to-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                    {book.coverImage || book.image ? (
                        <img src={book.coverImage || book.image} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <PhotoIcon className="w-10 h-10 text-slate-400" />
                        </div>
                    )}
                </div>
                
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{book.title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                <UserIcon className="w-4 h-4" />
                                {book.author}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(book)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                                <PencilSquareIcon className="w-5 h-5 text-indigo-600" />
                            </button>
                            <button onClick={() => handleDelete(book.id || book._id)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                                <TrashIcon className="w-5 h-5 text-rose-600" />
                            </button>
                        </div>
                    </div>
                    
                    {book.description && (
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                            {book.description}
                        </p>
                    )}
                    
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1"><TagIcon className="w-3 h-3" />{book.category}</span>
                        <span className="flex items-center gap-1"><CalendarIcon className="w-3 h-3" />{book.publishYear}</span>
                        <span className="flex items-center gap-1"><DocumentTextIcon className="w-3 h-3" />{book.pages}p</span>
                        <span className="flex items-center gap-1"><CurrencyDollarIcon className="w-3 h-3" />${book.price}</span>
                        <span className={`flex items-center gap-1 ${book.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {book.quantity > 0 ? <CheckCircleIcon className="w-3 h-3" /> : <ExclamationCircleIcon className="w-3 h-3" />}
                            Qty: {book.quantity}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 px-6 py-4">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Book Management
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            {filteredBooks.length} books found • {uniqueCategories} categories
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                        {/* Library Selector */}
                        <div className="relative flex-1 lg:flex-none min-w-[200px]">
                            <BuildingLibraryIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <select
                                value={selectedLibraryId}
                                onChange={(e) => setSelectedLibraryId(e.target.value)}
                                className="w-full pl-10 pr-8 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 dark:text-slate-200 appearance-none"
                            >
                                <option value="" disabled>Select Library</option>
                                {libraries.map(lib => (
                                    <option key={lib.id || lib._id} value={lib.id || lib._id}>{lib.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* View Toggle */}
                        <div className="flex bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${
                                    viewMode === 'grid' 
                                        ? 'bg-indigo-600 text-white' 
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                <ViewColumnsIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${
                                    viewMode === 'list' 
                                        ? 'bg-indigo-600 text-white' 
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                <DocumentTextIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Add Button */}
                        <button
                            onClick={handleCreate}
                            disabled={!selectedLibraryId}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                        >
                            <PlusIcon className="w-5 h-5" />
                            Add Book
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    <StatsCard title="Total Books" value={totalBooks} icon={BookOpenIcon} color="blue" />
                    <StatsCard title="Available" value={availableBooks} icon={CheckCircleIcon} color="emerald" />
                    <StatsCard title="Categories" value={uniqueCategories} icon={TagIcon} color="purple" />
                    <StatsCard title="Total Value" value={`$${totalValue.toLocaleString()}`} icon={CurrencyDollarIcon} color="amber" />
                </div>

                {/* Search and Filters */}
                <div className="mb-8 space-y-4">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex-1 min-w-[300px]">
                            <SearchBar 
                                onSearch={setSearchTerm} 
                                placeholder="Search by title, author, ISBN, description..." 
                                className="w-full"
                            />
                        </div>
                        
                        <div className="flex gap-2">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 dark:text-slate-200"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>
                                        {cat === 'all' ? 'All Categories' : cat}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 dark:text-slate-200"
                            >
                                <option value="title">Sort by Title</option>
                                <option value="author">Sort by Author</option>
                                <option value="year">Sort by Year</option>
                                <option value="price">Sort by Price</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Books Display */}
                {booksError && (
                    <div className="text-center py-10 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-200 dark:border-red-700">
                        <ExclamationCircleIcon className="w-12 h-12 text-red-400 mx-auto mb-2" />
                        <h3 className="font-semibold text-red-800 dark:text-red-300">Error Loading Books</h3>
                        <p className="text-sm text-red-600 dark:text-red-400">
                            {booksError.data?.message || 'Could not fetch books for the selected library. Please try again.'}
                        </p>
                    </div>
                )}
                
                {booksLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
                    </div>
                ) : filteredBooks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                        <BookOpenIcon className="w-20 h-20 text-slate-400 mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No books found</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">Try adjusting your search or add a new book</p>
                    </div>
                ) : (
                    <>
                        {viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {currentBooks.map(book => (
                                    <BookCard key={book.id || book._id} book={book} />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {currentBooks.map(book => (
                                    <BookListItem key={book.id || book._id} book={book} />
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                                >
                                    <ChevronLeftIcon className="w-5 h-5" />
                                </button>
                                
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-10 h-10 rounded-lg font-medium transition-all ${
                                            currentPage === i + 1
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                                >
                                    <ChevronRightIcon className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal */}
            <Form
                isOpen={isModalOpen}
                formData={formData}
                setFormData={setFormData}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={selectedBook}
                isLoading={isAdding || isUpdating}
                title="Book"
                fields={bookFields}
            />
        </div>
    );
};

export default LibraryBooks;