import React from "react";
import { IoMdReturnLeft } from "react-icons/io";
import { useParams, Link } from "react-router-dom";
import FooterBenefits from "../shop/components/FooterBenefits";
import { blogPosts } from "../../data/blogsData";

const BlogDetail = () => {
  const { id } = useParams();
  const post = blogPosts.find(p => String(p.id) === String(id));

  if (!post) {
    return (
      <div className="min-h-screen pt-[150px] container mx-auto px-4 text-center">
        <h2 className="text-2xl font-semibold mb-4">المقال غير موجود</h2>
        <Link to="/blogs" className="text-sm text-[#205457] underline">العودة للمدونات</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-[40px]">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <img src={post.image} alt={post.title} className="w-full h-72 object-cover rounded-xl mb-6" />
          <h1 className="text-3xl font-semibold mb-2">{post.title}</h1>
          <div className="text-sm text-muted-foreground mb-4">{post.date}</div>
          <p className="text-base text-foreground leading-relaxed">{post.excerpt}</p>

          <div className="mt-6">
            <Link to="/blogs" className="text-sm text-[#205457] underline"><IoMdReturnLeft className="text-3xl" /> </Link>
          </div>
        </div>
      </div>
      {/* <FooterBenefits  /> */}
    </div>
  );
};

export default BlogDetail;
