import React, { useState, useEffect, useMemo } from 'react';
import {
    PlusIcon,
    BookOpenIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    SparklesIcon,
    PencilIcon,
    TrashIcon,
    BuildingLibraryIcon,
    DocumentTextIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EyeIcon,
    XMarkIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    ExclamationTriangleIcon,
    UserIcon,
    PhoneIcon,
    EnvelopeIcon,
    CalendarIcon,
    UserGroupIcon,
    ClockIcon,
    MapPinIcon,
    IdentificationIcon,
    TagIcon,
    BuildingOfficeIcon,
    BookmarkIcon,
    GlobeAltIcon,
    HashtagIcon,
    CurrencyDollarIcon,
    ViewColumnsIcon
} from '@heroicons/react/24/outline';
import { useParams } from 'react-router-dom';
import {
    useGetAllLibrariesQuery,
    useGetLibraryByIdQuery,
    useCreateLibraryMutation,
    useUpdateLibraryMutation,
    useDeleteLibraryMutation,
    useGetBooksByLibraryQuery,
    useGetBookDetailsQuery,
    useAddBookMutation,
    useUpdateBookMutation,
    useDeleteBookMutation
} from '../api/libraryApi';
import Form from '../../../common/components/ui/Form';
import Table from '../../../common/components/ui/Table';
import StatsCard from '../../../common/components/ui/StatsCard';
import SearchBar from '../../../common/components/ui/SearchBar';

const Library = () => {
    const { tenantName, libraryId } = useParams();
    const [selectedView, setSelectedView] = useState('libraries'); // 'libraries' or 'books'
    const [selectedLibrary, setSelectedLibrary] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(''); // 'library' or 'book'
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Form states
    const [formData, setFormData] = useState({});

    // API Hooks
    const { data: librariesData, isLoading: librariesLoading, error: librariesError, refetch: refetchLibraries } = useGetAllLibrariesQuery(tenantName);
    const { data: selectedLibraryData, refetch: refetchLibrary } = useGetLibraryByIdQuery(
        { tenantName, id: selectedLibrary?.id },
        { skip: !selectedLibrary?.id }
    );
    const { data: booksData, isLoading: booksLoading, refetch: refetchBooks } = useGetBooksByLibraryQuery(
        { tenantName, libraryId: selectedLibrary?.id },
        { skip: !selectedLibrary?.id }
    );

    const [createLibrary, { isLoading: isCreatingLibrary }] = useCreateLibraryMutation();
    const [updateLibrary, { isLoading: isUpdatingLibrary }] = useUpdateLibraryMutation();
    const [deleteLibrary] = useDeleteLibraryMutation();
    const [addBook, { isLoading: isAddingBook }] = useAddBookMutation();
    const [updateBook, { isLoading: isUpdatingBook }] = useUpdateBookMutation();
    const [deleteBook] = useDeleteBookMutation();

    // Process data
    const libraries = useMemo(() => {
        if (!librariesData) return [];
        return Array.isArray(librariesData) ? librariesData :
            librariesData?.data || librariesData?.libraries || [];
    }, [librariesData]);

    const books = useMemo(() => {
        if (!booksData) return [];
        return Array.isArray(booksData) ? booksData :
            booksData?.data || booksData?.books || [];
    }, [booksData]);

    // Filter libraries
    const filteredLibraries = useMemo(() => {
        return libraries.filter(library =>
            library.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            library.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            library.librarian?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [libraries, searchTerm]);

    // Filter books
    const filteredBooks = useMemo(() => {
        return books.filter(book =>
            book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.isbn?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.category?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [books, searchTerm]);

    // Pagination
    const paginatedLibraries = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredLibraries.slice(start, start + itemsPerPage);
    }, [filteredLibraries, currentPage]);

    const paginatedBooks = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredBooks.slice(start, start + itemsPerPage);
    }, [filteredBooks, currentPage]);

    const totalPages = Math.ceil(
        (selectedView === 'libraries' ? filteredLibraries.length : filteredBooks.length) / itemsPerPage
    );

    // Columns Configuration
    const libraryColumns = useMemo(() => [
        { key: 'name', header: 'Name', isPrimary: true },

        {
            key: 'isActive',
            header: 'Status',
            render: (item) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.isActive
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-400'
                    }`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                </span>
            )
        },
        {
            key: '_count.books',
            header: 'Books',
            render: (item) => item?._count?.books || 0
        },
        {
            key: 'createdAt',
            header: 'Created',
            render: (item) =>
                item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : '-'
        }
    ], []);


    const bookColumns = useMemo(() => [
        { key: 'title', header: 'Title', isPrimary: true },
        { key: 'author', header: 'Author' },
        { key: 'isbn', header: 'ISBN' },
        { key: 'category', header: 'Category' },
        { key: 'quantity', header: 'Qty' },
        {
            key: 'status', header: 'Status', render: (item) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.quantity > 0 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-rose-100 text-rose-800 dark:bg-rose-500/20 dark:text-rose-400'}`}>
                    {item.quantity > 0 ? 'Available' : 'Out of Stock'}
                </span>
            )
        }
    ], []);

    // Fields Configuration
    const libraryFields = {
        name: { label: 'Library Name', type: 'text', icon: BuildingLibraryIcon, tab: 'basic' },
        location: { label: 'Location', type: 'text', icon: MapPinIcon, tab: 'basic' },
        librarian: { label: 'Librarian', type: 'text', icon: UserIcon, tab: 'basic' },
        contact: { label: 'Contact', type: 'tel', icon: PhoneIcon, tab: 'contact' },
        email: { label: 'Email', type: 'email', icon: EnvelopeIcon, tab: 'contact' },
        establishedYear: { label: 'Est. Year', type: 'number', icon: CalendarIcon, tab: 'basic' },
        totalCapacity: { label: 'Capacity', type: 'number', icon: UserGroupIcon, tab: 'basic' },
        workingHours: { label: 'Working Hours', type: 'text', icon: ClockIcon, tab: 'basic' },
        description: { label: 'Description', type: 'textarea', icon: DocumentTextIcon, tab: 'basic' }
    };

    const bookFields = {
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

    // Derived state for Form initialData
    const formInitialData = useMemo(() => {
        if (!selectedItem) return null;
        if (modalType === 'library') {
            return {
                name: selectedItem.name || '',
                location: selectedItem.location || '',
                librarian: selectedItem.librarian || '',
                contact: selectedItem.contact || '',
                email: selectedItem.email || '',
                establishedYear: selectedItem.establishedYear || '',
                totalCapacity: selectedItem.totalCapacity || '',
                workingHours: selectedItem.workingHours || '',
                description: selectedItem.description || ''
            };
        } else {
            return {
                title: selectedItem.title || '',
                author: selectedItem.author || '',
                isbn: selectedItem.isbn || '',
                category: selectedItem.category || '',
                publisher: selectedItem.publisher || '',
                publishYear: selectedItem.publishYear || '',
                edition: selectedItem.edition || '',
                pages: selectedItem.pages || '',
                language: selectedItem.language || '',
                quantity: selectedItem.quantity || '',
                price: selectedItem.price || '',
                shelf: selectedItem.shelf || '',
                rack: selectedItem.rack || '',
                description: selectedItem.description || ''
            };
        }
    }, [selectedItem, modalType]);

    // Handlers
    const handleAddLibrary = () => {
        setModalType('library');
        setSelectedItem(null);
        setFormData({
            name: '',
            location: '',
            librarian: '',
            contact: '',
            email: '',
            establishedYear: '',
            totalCapacity: '',
            workingHours: '',
            description: ''
        });
        setIsModalOpen(true);
    };

    const handleAddBook = () => {
        if (!selectedLibrary) {
            alert('Please select a library first');
            return;
        }
        setModalType('book');
        setSelectedItem(null);
        setFormData({
            title: '',
            author: '',
            isbn: '',
            category: '',
            publisher: '',
            publishYear: '',
            edition: '',
            pages: '',
            language: '',
            quantity: '',
            shelf: '',
            rack: '',
            description: '',
            price: ''
        });
        setIsModalOpen(true);
    };

    const handleEditLibrary = (library) => {
        setModalType('library');
        setSelectedItem(library);
        setIsModalOpen(true);
    };

    const handleEditBook = (book) => {
        setModalType('book');
        setSelectedItem(book);
        setIsModalOpen(true);
    };

    const handleDeleteLibrary = async (id) => {
        if (window.confirm('Are you sure you want to delete this library? This will also delete all books in this library.')) {
            try {
                await deleteLibrary({ tenantName, id }).unwrap();
                refetchLibraries();
            } catch (error) {
                alert('Failed to delete library');
            }
        }
    };

    const handleDeleteBook = async (id) => {
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
            if (modalType === 'library') {
                if (selectedItem) {
                    await updateLibrary({ tenantName, id: selectedItem.id, data }).unwrap();
                } else {
                    await createLibrary({ tenantName, data }).unwrap();
                }
                refetchLibraries();
            } else {
                if (selectedItem) {
                    await updateBook({ tenantName, id: selectedItem.id, data }).unwrap();
                } else {
                    await addBook({ tenantName, libraryId: selectedLibrary.id, data }).unwrap();
                }
                refetchBooks();
            }
            setIsModalOpen(false);
        } catch (error) {
            alert(error?.data?.message || 'Something went wrong');
        }
    };

    const handleViewLibrary = (library) => {
        setSelectedLibrary(library);
        setSelectedView('books');
        setCurrentPage(1);
        setSearchTerm('');
    };

    const handleBackToLibraries = () => {
        setSelectedLibrary(null);
        setSelectedView('libraries');
        setCurrentPage(1);
        setSearchTerm('');
    };

    // Stats
    const totalLibraries = libraries.length;
    const totalBooks = books.length;
    const availableBooks = books.filter(b => b.quantity > 0).length;
    const uniqueCategories = [...new Set(books.map(b => b.category))].length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">

            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">

                {/* Header */}
                <div className="mb-8 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 rounded-3xl blur-xl"></div>
                    <div className="relative bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-gray-700/30">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-lg opacity-50"></div>
                                    <div className="relative p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl">
                                        <BuildingLibraryIcon className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        {selectedView === 'books' && selectedLibrary ? (
                                            <>
                                                <button
                                                    onClick={handleBackToLibraries}
                                                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                                                >
                                                    <ChevronLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                                </button>
                                                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                                    {selectedLibrary.name}
                                                </h1>
                                            </>
                                        ) : (
                                            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                                Library Management
                                            </h1>
                                        )}
                                        <SparklesIcon className="h-6 w-6 text-amber-500" />
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {selectedView === 'books' && selectedLibrary
                                            ? `Manage books in ${selectedLibrary.name} library`
                                            : 'Manage libraries and their book collections'}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={selectedView === 'libraries' ? handleAddLibrary : handleAddBook}
                                className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg shadow-indigo-600/30 hover:shadow-xl hover:shadow-purple-600/40 transition-all duration-300"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                <PlusIcon className="h-5 w-5 mr-2 relative z-10 transition-transform group-hover:rotate-90" />
                                <span className="relative z-10">
                                    {selectedView === 'libraries' ? 'Add Library' : 'Add Book'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                {selectedView === 'libraries' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                        <StatsCard
                            title="Total Libraries"
                            value={totalLibraries}
                            icon={BuildingLibraryIcon}
                            color="blue"
                        />
                        <StatsCard
                            title="Total Books"
                            value={totalBooks}
                            icon={BookOpenIcon}
                            color="purple"
                        />
                        <StatsCard
                            title="Available Books"
                            value={availableBooks}
                            icon={CheckCircleIcon}
                            color="emerald"
                        />
                        <StatsCard
                            title="Categories"
                            value={uniqueCategories}
                            icon={DocumentTextIcon}
                            color="amber"
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                        <StatsCard
                            title="Total Books"
                            value={totalBooks}
                            icon={BookOpenIcon}
                            color="blue"
                        />
                        <StatsCard
                            title="Available"
                            value={availableBooks}
                            icon={CheckCircleIcon}
                            color="emerald"
                        />
                        <StatsCard
                            title="Categories"
                            value={uniqueCategories}
                            icon={DocumentTextIcon}
                            color="purple"
                        />
                        <StatsCard
                            title="Issued"
                            value={totalBooks - availableBooks}
                            icon={ExclamationTriangleIcon}
                            color="amber"
                        />
                    </div>
                )}

                {/* Search Bar */}
                <div className="mb-6">
                    <SearchBar
                        onSearch={(term) => setSearchTerm(term)}
                        placeholder={selectedView === 'libraries'
                            ? "Search libraries by name, location, or librarian..."
                            : "Search books by title, author, ISBN, or category..."}
                    />
                </div>

                {/* Error Message */}
                {librariesError && (
                    <div className="mb-6 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-xl p-4 flex items-center gap-3 text-rose-600 dark:text-rose-400">
                        <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0" />
                        <p className="text-sm font-medium">
                            {librariesError?.data?.message || 'Failed to load libraries. Please check your permissions.'}
                            {librariesError?.status === 403 && ' (Access Forbidden)'}
                        </p>
                    </div>
                )}

                {/* Main Content - Libraries View */}
                {selectedView === 'libraries' && (
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-gray-700/50 overflow-hidden">
                        {librariesLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : paginatedLibraries.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <BuildingLibraryIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                                <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">No libraries found</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {searchTerm ? 'Try a different search' : 'Add your first library to get started'}
                                </p>
                            </div>
                        ) : (
                            <Table
                                data={paginatedLibraries}
                                columns={[
                                    ...libraryColumns,
                                    {
                                        key: 'actions',
                                        header: 'Actions',
                                        render: (library) => (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleViewLibrary(library)}
                                                    className="p-2 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 rounded-lg transition-colors"
                                                    title="View Books"
                                                >
                                                    <EyeIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleEditLibrary(library)}
                                                    className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/20 rounded-lg transition-colors"
                                                >
                                                    <PencilIcon className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteLibrary(library.id)}
                                                    className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/20 rounded-lg transition-colors"
                                                >
                                                    <TrashIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        )
                                    }
                                ]}
                            />
                        )}
                    </div>
                )}

                {/* Main Content - Books View */}
                {selectedView === 'books' && selectedLibrary && (
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-gray-700/50 overflow-hidden">
                        {booksLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : paginatedBooks.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <BookOpenIcon className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                                <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">No books found</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {searchTerm ? 'Try a different search' : 'Add your first book to this library'}
                                </p>
                            </div>
                        ) : (
                            <Table
                                data={paginatedBooks}
                                columns={bookColumns}
                                onEdit={handleEditBook}
                                onDelete={(id) => handleDeleteBook(id)}
                            />
                        )}
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Showing {currentPage} of {totalPages} pages
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-indigo-500 transition-colors"
                            >
                                <ChevronLeftIcon className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-indigo-500 transition-colors"
                            >
                                <ChevronRightIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Unified Modal */}
            <Form
                isOpen={isModalOpen}
                formData={formData}
                setFormData={setFormData}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={formInitialData}
                isLoading={isCreatingLibrary || isUpdatingLibrary || isAddingBook || isUpdatingBook}
                title={modalType === 'library' ? 'Library' : 'Book'}
                fields={modalType === 'library' ? libraryFields : bookFields}
            />
        </div>
    );
};

export default Library;