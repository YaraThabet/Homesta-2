import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import FooterBenefits from "../shop/components/FooterBenefits";
import { blogPosts } from "../../data/blogsData";

const Blogs = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const postsPerPage = 9;

    // Filter posts based on search
    const filteredPosts = blogPosts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

    // Get current posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    return (
        <div className="min-h-screen bg-background pt-[150px] flex flex-col">
            <div className="flex-grow">
                {/* Header */}
                <header className="bg-[#F6F6F6] py-12">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-3xl font-semibold text-gray-800 mb-2">Our Blogs</h1>
                        <nav className="text-sm text-gray-500">
                            <Link to="/" className="hover:text-[#205457] transition-colors">
                                Home
                            </Link>
                            <span className="mx-2">/</span>
                            <span className="text-[#205457]">Blogs</span>
                        </nav>
                    </div>
                </header>

                {/* Content */}
                <div className="container mx-auto px-4 py-10">
                    {/* Search Bar */}
                    <div className="mb-8 max-w-md mx-auto">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-[#205457] focus:ring-1 focus:ring-[#205457] transition-all"
                            />
                        </div>
                    </div>

                    {/* Blog Grid */}
                    {currentPosts.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg mb-4">No articles found</p>
                            <button
                                onClick={() => setSearchQuery("")}
                                className="text-[#205457] underline hover:text-[#18433a] transition-colors"
                            >
                                Clear search
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {currentPosts.map((post) => (
                                <article key={post.id} className="group cursor-pointer">
                                    <Link to={`/blogs/${post.id}`}>
                                        <div className="relative overflow-hidden rounded-xl mb-4">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                                                <span className="bg-[#205457] text-white px-4 py-1.5 rounded-full text-sm font-medium">
                                                    {post.date}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                    <h2 className="text-lg font-semibold text-foreground mb-2 leading-tight group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h2>
                                    <Link to={`/blogs/${post.id}`} className="inline-block text-sm bg-[#205457] text-white px-4 py-1.5 rounded-full hover:bg-[#18433a] transition-colors">
                                        Details
                                    </Link>
                                </article>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-12">
                            <button
                                className="p-2 rounded-full hover:border hover:border-border hover:bg-muted transition-colors disabled:opacity-50"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>

                            {/* First page */}
                            <button
                                onClick={() => setCurrentPage(1)}
                                className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${currentPage === 1
                                    ? 'bg-[#205457] text-white'
                                    : 'hover:border hover:border-border hover:bg-muted'
                                    }`}
                            >
                                1
                            </button>

                            {/* Show ellipsis if needed */}
                            {currentPage > 3 && (
                                <span className="px-2 text-muted-foreground">...</span>
                            )}

                            {/* Previous page */}
                            {currentPage > 2 && (
                                <button
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    className="w-10 h-10 rounded-full text-sm font-medium hover:border hover:border-border hover:bg-muted"
                                >
                                    {currentPage - 1}
                                </button>
                            )}

                            {/* Current page */}
                            {currentPage > 1 && currentPage < totalPages && (
                                <button
                                    className="w-10 h-10 rounded-full text-sm font-medium bg-[#205457] text-white"
                                >
                                    {currentPage}
                                </button>
                            )}

                            {/* Next page */}
                            {currentPage < totalPages - 1 && (
                                <button
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    className="w-10 h-10 rounded-full text-sm font-medium hover:border hover:border-border hover:bg-muted"
                                >
                                    {currentPage + 1}
                                </button>
                            )}

                            {/* Show ellipsis if needed */}
                            {currentPage < totalPages - 2 && (
                                <span className="px-2 text-muted-foreground">...</span>
                            )}

                            {/* Last page */}
                            {totalPages > 1 && (
                                <button
                                    onClick={() => setCurrentPage(totalPages)}
                                    className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${currentPage === totalPages
                                        ? 'bg-[#205457] text-white'
                                        : 'hover:border hover:border-border hover:bg-muted'
                                        }`}
                                >
                                    {totalPages}
                                </button>
                            )}

                            <button
                                className="p-2 rounded-full hover:border hover:border-border hover:bg-muted transition-colors disabled:opacity-50"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <FooterBenefits />
        </div>
    );
};

export default Blogs;
