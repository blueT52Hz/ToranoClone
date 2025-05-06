import React, { useState, useCallback, memo, useMemo } from "react";
import placeholder from "@/assets/images/placeholder.svg";

type OptimizedImageProps = {
  src: string;
  alt: string;
  title: string;
  width?: number | string;
  height?: number | string;
  loading?: "lazy" | "eager";
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  className?: string;
  placeholderSrc?: string;
  fallbackSrc?: string;
};

const OptimizedImage: React.FC<OptimizedImageProps> = memo(
  ({
    src,
    alt,
    title = "",
    width,
    height,
    loading = "lazy",
    objectFit = "cover",
    className = "",
    placeholderSrc = placeholder,
    fallbackSrc,
  }) => {
    const [imgSrc, setImgSrc] = useState<string>(placeholderSrc);
    const [isLoaded, setIsLoaded] = useState(false);

    const handleLoad = useCallback(() => {
      if (!isLoaded) {
        setIsLoaded(true);
        setImgSrc(src);
      }
    }, [src, isLoaded]);

    const handleError = useCallback(() => {
      if (fallbackSrc && imgSrc !== fallbackSrc) {
        setImgSrc(fallbackSrc);
      } else if (imgSrc !== placeholderSrc) {
        setImgSrc(placeholderSrc);
      }
    }, [fallbackSrc, placeholderSrc, imgSrc]);

    const imageClassName = useMemo(() => {
      return `${className} transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`;
    }, [className, isLoaded]);

    return (
      <img
        src={imgSrc}
        title={title}
        alt={alt}
        loading={loading}
        width={width}
        height={height}
        onLoad={handleLoad}
        onError={handleError}
        className={imageClassName}
        style={{ objectFit }}
      />
    );
  }
);

OptimizedImage.displayName = "OptimizedImage";

export default OptimizedImage;
