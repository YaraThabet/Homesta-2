import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, User, Package, FolderTree } from 'lucide-react';

/**
 * SafeImage Component
 * Handles broken images and missing sources with professional placeholders
 * 
 * @param {string} src - The image source URL
 * @param {string} alt - Alt text for the image
 * @param {string} type - The type of placeholder ('product', 'profile', 'category', 'subcategory')
 * @param {string} className - Additional CSS classes
 */
const SafeImage = ({ src, alt, type = 'product', className = '', ...props }) => {
    const [error, setError] = useState(false);
    // Reset error state if src changes
    useEffect(() => {
        setError(false);
    }, [src]);

    const getPlaceholder = () => {
        const configs = {
            product: {
                icon: Package,
                bgColor: 'bg-gray-50',
                iconColor: 'text-gray-300',
                text: 'Product'
            },
            profile: {
                icon: User,
                bgColor: 'bg-blue-50',
                iconColor: 'text-blue-200',
                text: 'User'
            },
            category: {
                icon: FolderTree,
                bgColor: 'bg-green-50',
                iconColor: 'text-green-200',
                text: 'Category'
            },
            subcategory: {
                icon: FolderTree,
                bgColor: 'bg-teal-50',
                iconColor: 'text-teal-200',
                text: 'Subcategory'
            }
        };

        const config = configs[type] || configs.product;
        const Icon = config.icon;

        return (
            <div className={`flex flex-col items-center justify-center w-full h-full min-h-[inherit] ${config.bgColor} border border-dashed border-gray-200 ${className}`}>
                <Icon className={`w-1/3 h-1/3 ${config.iconColor} mb-2`} strokeWidth={1.5} />
                <span className={`text-[10px] font-bold uppercase tracking-widest ${config.iconColor} opacity-60`}>
                    No {config.text}
                </span>
            </div>
        );
    };

    // Handle relative URLs by prepending the base URL if needed
    const getImageUrl = (url) => {
        if (!url || typeof url !== 'string') return '';

        // If it's the backend URL, strip it to make it relative (so it goes through proxy)
        if (url.includes('homefinish.runasp.net')) {
            return url.replace(/^https?:\/\/homefinish\.runasp\.net/, '');
        }

        // If it's a data URL or external URL (not our backend), return as is
        if (url.startsWith('http') || url.startsWith('//') || url.startsWith('blob:') || url.startsWith('data:')) {
            return url;
        }

        // Use relative path - this is proxied by both Vite (local) and Vercel (prod)
        return `${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const imageUrl = getImageUrl(src);

    if (error || !src || src === 'null' || src === 'undefined') {
        return getPlaceholder();
    }

    return (
        <div className={`relative overflow-hidden ${className}`}>
            <img
                src={imageUrl}
                alt={alt || 'Image'}
                className="w-full h-full object-cover transition-opacity duration-300"
                referrerPolicy="no-referrer"
                loading="lazy"
                onError={() => setError(true)}
                {...props}
            />
        </div>
    );
};

export default SafeImage;
