import React, { useState, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ImageDisplay from './components/ImageDisplay';
import ErrorAlert from './components/ErrorAlert';
import ShareModal from './components/ShareModal';
import AIHelperModal from './components/AIHelperModal';
import { generatePixelArt, describeImage } from './services/geminiService';

const STYLES = [
  'Pixel art, 16-bit retro style',
  'Pixel art, 8-bit classic style',
  'Isometric pixel art',
  'Vibrant synthwave pixel art',
  'Cozy, warm pixel art',
  'Monochrome pixel art',
];

const SURPRISE_ME_PROMPTS = [
  'A tiny house on the back of a giant, mossy snail.',
  'A cyberpunk street market at night, bustling with androids.',
  'An enchanted forest with glowing mushrooms and a hidden waterfall.',
  'A lone astronaut discovering an ancient alien artifact on a red planet.',
  'A retro-futuristic flying car dealership.',
  'A cozy witch\'s cottage filled with potions and a sleeping cat.',
  'An underwater city with bioluminescent buildings.',
  'A steampunk airship soaring through a cloudy sky.',
  'A peaceful Japanese garden with a koi pond and cherry blossoms.',
  'A knight facing a giant, pixelated dragon in a volcano lair.',
  'A vending machine dispensing magical potions in a subway station.',
  'A library inside a giant, ancient tree.',
  'A robot tending to a rooftop garden in a futuristic city.',
  'A ghost ship sailing on a sea of stars.',
  'A farmer\'s market on a floating island.',
];

interface ShareData {
    prompt: string;
    negativePrompt: string;
    style: string;
    seed: number;
}

function App() {
  const [prompt, setPrompt] = useState<string>('A majestic castle on a floating island');
  const [negativePrompt, setNegativePrompt] = useState<string>('blurry, photo, 3d render, text, watermark, smooth gradients');
  const [style, setStyle] = useState<string>(STYLES[0]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<{ data: string; mimeType: string } | null>(null);
  const [referenceImageForDisplay, setReferenceImageForDisplay] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [seed, setSeed] = useState<number | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [isAIHelperModalOpen, setIsAIHelperModalOpen] = useState(false);
  
  const generateFromShare = useRef(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const shareDataParam = urlParams.get('share');
    if (shareDataParam) {
        try {
            const decodedData = atob(shareDataParam);
            const data: ShareData = JSON.parse(decodedData);
            if (data.prompt && data.style && data.seed) {
                setPrompt(data.prompt);
                setNegativePrompt(data.negativePrompt || '');
                setStyle(data.style);
                setSeed(data.seed);
                setUploadedImage(null); // Shared links don't support uploaded images
                generateFromShare.current = true;
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        } catch (e) {
            console.error("Failed to parse share data:", e);
            setError("The shared link is invalid or corrupted.");
        }
    }
  }, []);

  const handleSurpriseMe = useCallback(() => {
    const randomPrompt = SURPRISE_ME_PROMPTS[Math.floor(Math.random() * SURPRISE_ME_PROMPTS.length)];
    setPrompt(randomPrompt);
  }, []);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) {
            setUploadedImage({ data: base64String, mimeType: file.type });
            setError(null);
        } else {
            setError("Could not read the uploaded image file.");
        }
    };
    reader.onerror = () => {
        setError("Error reading the image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
      setUploadedImage(null);
      setReferenceImageForDisplay(null);
  };

  const handleGenerate = useCallback(async () => {
    if (isLoading) return;
    if (!prompt.trim() && !uploadedImage) {
        setError("Please provide a prompt or upload an image to start.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setImageUrl(null);
    
    if (uploadedImage) {
        setReferenceImageForDisplay(`data:${uploadedImage.mimeType};base64,${uploadedImage.data}`);
    } else {
        setReferenceImageForDisplay(null);
    }
    
    setLoadingMessage('');

    const generationSeed = generateFromShare.current && seed ? seed : Math.floor(Math.random() * 1_000_000);
    setSeed(generationSeed);
    
    try {
      let finalPrompt = prompt;

      if (uploadedImage) {
        setLoadingMessage('Analyzing reference image...');
        const description = await describeImage(uploadedImage.data, uploadedImage.mimeType);
        
        if (prompt.trim()) {
             finalPrompt = `A pixel art version of the following scene: "${description}". Now, apply these modifications: "${prompt}".`;
        } else {
             finalPrompt = `A pixel art version of the following scene: "${description}".`;
        }
      }
      
      if (!finalPrompt.trim()){
          setError("A prompt is required.");
          setIsLoading(false);
          return;
      }

      setLoadingMessage('Generating pixel art...');
      const generatedImageUrl = await generatePixelArt(finalPrompt, style, negativePrompt, generationSeed);
      setImageUrl(generatedImageUrl);

    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
      generateFromShare.current = false;
    }
  }, [prompt, style, negativePrompt, isLoading, uploadedImage, seed]);

  useEffect(() => {
    if(generateFromShare.current){
        handleGenerate();
    }
  },[handleGenerate]);


  const handleDownload = useCallback(() => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    const filename = `${prompt.slice(0, 30).replace(/\s+/g, '_')}_${style.split(',')[0].replace(/\s+/g, '_')}.png`;
    link.download = filename.toLowerCase();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [imageUrl, prompt, style]);
  
  const handleShare = useCallback(() => {
      if (!imageUrl || seed === null) return;
      const data: ShareData = { prompt, negativePrompt, style, seed };
      const encodedData = btoa(JSON.stringify(data));
      const url = `${window.location.origin}${window.location.pathname}?share=${encodedData}`;
      setShareUrl(url);
      setIsShareModalOpen(true);
  }, [imageUrl, prompt, negativePrompt, style, seed]);
  
  const handleSelectSuggestion = useCallback((suggestion: string) => {
    setPrompt(suggestion);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-mono flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <Header />
        <main className="lg:grid lg:grid-cols-2 lg:gap-8">
          <div className="lg:col-span-1 flex flex-col gap-4">
            <PromptInput
              prompt={prompt}
              setPrompt={setPrompt}
              negativePrompt={negativePrompt}
              setNegativePrompt={setNegativePrompt}
              style={style}
              setStyle={setStyle}
              styles={STYLES}
              onGenerate={handleGenerate}
              isLoading={isLoading}
              uploadedImage={uploadedImage}
              onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove}
              onSurpriseMe={handleSurpriseMe}
              onOpenAIHelper={() => setIsAIHelperModalOpen(true)}
            />
            {error && <ErrorAlert message={error} />}
          </div>
          <div className="lg:col-span-1">
             <ImageDisplay
              imageUrl={imageUrl}
              referenceImageUrl={referenceImageForDisplay}
              isLoading={isLoading}
              prompt={prompt}
              style={style}
              onDownload={handleDownload}
              onShare={handleShare}
              loadingMessage={loadingMessage}
            />
          </div>
        </main>
        <footer className="text-center mt-8 text-gray-500 text-xs">
          <p>Powered by Google Imagen 3 & Gemini</p>
        </footer>
      </div>
      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareUrl={shareUrl}
        imageUrl={imageUrl}
      />
      <AIHelperModal
        isOpen={isAIHelperModalOpen}
        onClose={() => setIsAIHelperModalOpen(false)}
        onSelectSuggestion={handleSelectSuggestion}
        initialPrompt={prompt}
      />
    </div>
  );
}

export default App;
