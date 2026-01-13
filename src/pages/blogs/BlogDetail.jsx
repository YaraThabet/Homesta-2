import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Share2, BookOpen, Tag, User } from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";
import FooterBenefits from "../shop/components/FooterBenefits";
import { blogPosts } from "../../data/blogsData";
import { useAppContext } from "../../context/AppContext";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showAlert } = useAppContext();
  const post = blogPosts.find(p => String(p.id) === String(id));

  // Get related posts (exclude current post)
  const relatedPosts = blogPosts
    .filter(p => String(p.id) !== String(id))
    .slice(0, 3);

  if (!post) {
    return (
      <div className="min-h-screen pt-[150px] flex items-center justify-center bg-[#FDFCFB]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white p-12 rounded-[40px] border border-gray-100 shadow-xl max-w-md"
        >
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">Article Not Found</h2>
          <p className="text-gray-500 mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 bg-[#205457] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#1a4346] transition-all shadow-lg shadow-[#205457]/20"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blogs
          </Link>
        </motion.div>
      </div>
    );
  }

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showAlert("Link copied to clipboard!", "success", "Copied!");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB]  pb-20 font-outfit">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-[120px]">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/blogs')}
            className="group inline-flex items-center gap-3 text-gray-600 hover:text-[#205457] transition-colors font-medium"
          >
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#205457]/5 transition-all">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span>Back to All Articles</span>
          </button>
        </motion.div>

        {/* Article Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2 bg-[#205457]/5 px-4 py-2 rounded-full">
              <Calendar className="w-4 h-4 text-[#205457]" />
              <span className="text-sm font-bold text-[#205457]">{post.date}</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-600">5 min read</span>
            </div>
            <button
              onClick={shareArticle}
              className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full hover:bg-[#205457]/5 transition-all group"
            >
              <Share2 className="w-4 h-4 text-gray-400 group-hover:text-[#205457] transition-colors" />
              <span className="text-sm font-medium text-gray-600 group-hover:text-[#205457] transition-colors">Share</span>
            </button>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-600 leading-relaxed">
            {post.excerpt}
          </p>
        </motion.div>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-[40px] mb-12 aspect-[16/9] shadow-2xl shadow-gray-200/50 border border-white"
        >
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </motion.div>

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-[40px] p-8 md:p-12 border border-gray-100 shadow-sm mb-16"
        >
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg mb-6">
              {post.excerpt}
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Key Highlights</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              This comprehensive guide explores the essential elements of modern home design,
              focusing on creating spaces that are both functional and aesthetically pleasing.
              From selecting the right materials to understanding color psychology, we cover
              everything you need to know to transform your living space.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Design Principles</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Understanding the fundamentals of interior design is crucial for creating harmonious
              spaces. We delve into the principles of balance, proportion, and rhythm, showing you
              how to apply these concepts to your own home. Whether you're working with a small
              apartment or a spacious house, these timeless principles will guide your decisions.
            </p>

            <div className="bg-[#205457]/5 border-l-4 border-[#205457] p-6 rounded-r-2xl my-8">
              <p className="text-gray-700 italic leading-relaxed">
                "Great design is not just about aesthetics—it's about creating spaces that enhance
                the quality of life for those who inhabit them. Every piece of furniture, every
                color choice, tells a story."
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Practical Tips</h2>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#205457] rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">Start with a clear vision and mood board to guide your design decisions</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#205457] rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">Invest in quality pieces that will stand the test of time</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#205457] rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">Don't be afraid to mix textures and materials for visual interest</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#205457] rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">Consider the flow and functionality of each space</span>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Conclusion</h2>
            <p className="text-gray-700 leading-relaxed">
              Creating a beautiful home is a journey, not a destination. By following these
              guidelines and trusting your instincts, you can create spaces that truly reflect
              your personality and lifestyle. Remember, the best homes are those that evolve
              with their inhabitants, growing and changing over time.
            </p>
          </div>
        </motion.div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-gray-900">Related Articles</h2>
              <Link
                to="/blogs"
                className="text-[#205457] font-bold text-sm hover:underline flex items-center gap-2"
              >
                View All
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blogs/${relatedPost.id}`}
                  className="group bg-white rounded-[30px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                      <Calendar className="w-3 h-3" />
                      {relatedPost.date}
                    </div>
                    <h3 className="font-bold text-gray-900 leading-tight group-hover:text-[#205457] transition-colors line-clamp-2 mb-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <div className="mt-20">
        <FooterBenefits />
      </div>
    </div>
  );
};

export default BlogDetail;
