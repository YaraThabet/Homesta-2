import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FooterBenefits from "../shop/components/FooterBenefits";

const blogPosts = [
  {
    id: 1,
    title: "Homesta Trends 2025: What's Hot and What's Not",
    excerpt: "Explore the latest furniture trends shaping modern and elegant living spaces.",
    date: "15 April 2025",
    image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    title: "The Ultimate Guide to Choosing the Perfect Sofa",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
    date: "14 April 2025",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    title: "Choosing the Right Dining Table for Your Lifestyle",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
    date: "12 April 2025",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=300&fit=crop"
  },
  {
    id: 4,
    title: "Choosing the Right Material for Your Furniture",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
    date: "11 April 2025",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
  },
  {
    id: 5,
    title: "Modern Coffee Tables for Stylish Living Rooms",
    excerpt: "Discover coffee table designs that combine functionality with contemporary aesthetics.",
    date: "10 April 2025",
    image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop"
  },
  {
    id: 6,
    title: "Minimal Sideboards for Elegant Home Storage",
    excerpt: "Learn how modern sideboards add warmth, organization, and style to your living space.",
    date: "09 April 2025",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop"
  },
  {
    id: 7,
    title: "Budget-Friendly Furniture Shopping Tips",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
    date: "08 April 2025",
    image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=400&h=300&fit=crop"
  },
  {
    id: 8,
    title: "Organizing Your Home Office with Furniture",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
    date: "07 April 2025",
    image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&h=300&fit=crop"
  },
  {
    id: 9,
    title: "Elevating Your Home Décor with Bold Furniture Choices",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
    date: "06 April 2025",
    image: "https://images.unsplash.com/photo-1616137466211-f939a420be84?w=400&h=300&fit=crop"
  },
    {
    id: 10,
    title: "Elevating Your Home Décor with Bold Furniture Choices",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
    date: "06 April 2025",
    image: "https://images.unsplash.com/photo-1616137466211-f939a420be84?w=400&h=300&fit=crop"
  },
    {
    id: 11,
    title: "Elevating Your Home Décor with Bold Furniture Choices",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
    date: "06 April 2025",
    image: "https://images.unsplash.com/photo-1616137466211-f939a420be84?w=400&h=300&fit=crop"
  }
];

const Blogs = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;
const totalPages = Math.ceil(blogPosts.length / postsPerPage);

// Get current posts
const indexOfLastPost = currentPage * postsPerPage;
const indexOfFirstPost = indexOfLastPost - postsPerPage;
const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-[#F6F6F6] py-14 text-center">
        <h1 className="text-2xl font-semibold text-foreground mb-2 tracking-tight">Our Blog</h1>
        <nav className="text-sm text-muted-foreground">
          <span className="hover:text-foreground cursor-pointer">Home</span>
          <span className="mx-1.5 text-muted-foreground/50">/</span>
          <span className="text-foreground font-medium">Our Blog</span>
        </nav>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-10">
        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentPosts.map((post) => (
            <article key={post.id} className="group cursor-pointer">
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
              <h2 className="text-lg font-semibold text-foreground mb-2 leading-tight group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {post.excerpt}
              </p>
              <a href="#" className="text-sm text-foreground underline hover:text-primary transition-colors">
                Read More
              </a>
            </article>
          ))}
        </div>

  
{/* Pagination */}
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
    className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
      currentPage === 1 
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
      className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
        currentPage === totalPages 
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
      </div>
      <FooterBenefits />
    </div>
  );
};

export default Blogs;
