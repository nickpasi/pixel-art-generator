
import React, { useRef } from 'react';

interface ImageUploaderProps {
    uploadedImage: { data: string; mimeType: string } | null;
    onImageUpload: (file: File) => void;
    onImageRemove: () => void;
    isLoading: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ uploadedImage, onImageUpload, onImageRemove, isLoading }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onImageUpload(file);
        }
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (isLoading) return;
        const file = event.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            onImageUpload(file);
        }
        event.currentTarget.classList.remove('border-cyan-500');
    };
    
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.add('border-cyan-500');

    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.remove('border-cyan-500');
    };

    const fullImageData = uploadedImage ? `data:${uploadedImage.mimeType};base64,${uploadedImage.data}` : '';

    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
                Reference Image (Optional)
            </label>
            <div className="mt-1">
                {uploadedImage ? (
                    <div className="relative group">
                         <img src={fullImageData} alt="Upload preview" className="rounded-lg w-full object-cover h-24 border-2 border-cyan-500" />
                         <button
                            onClick={onImageRemove}
                            disabled={isLoading}
                            className="absolute top-1 right-1 bg-gray-900 bg-opacity-70 text-white rounded-full p-1 leading-none hover:bg-red-600 transition-colors duration-200 disabled:cursor-not-allowed z-10"
                            aria-label="Remove image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <div
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-24 p-3 bg-gray-900 border-2 border-dashed border-gray-600 rounded-md focus-within:ring-2 focus-within:ring-cyan-500 focus:outline-none transition-colors duration-200 flex flex-col items-center justify-center text-center cursor-pointer hover:border-gray-500"
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileChange}
                            accept="image/png, image/jpeg, image/webp"
                            className="sr-only"
                            disabled={isLoading}
                        />
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-xs text-gray-500 mt-1">Click or drag & drop an image</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUploader;
