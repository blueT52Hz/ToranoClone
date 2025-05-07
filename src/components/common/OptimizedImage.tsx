import React, { useState, useCallback, memo, useMemo } from "react";
import placeholder from "@/assets/images/placeholder.svg";
import clsx from "clsx";

type OptimizedImageProps = {
  src: string;
  alt: string;
  title: string;
  loading?: "lazy" | "eager";
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  className?: string;
  placeholderSrc?: string;
  fallbackSrc?: string;
  draggable?: boolean;
  onClick?: () => void;
  isHovered?: boolean;
};

const OptimizedImage: React.FC<OptimizedImageProps> = memo(
  ({
    src,
    alt,
    title = "",
    loading = "lazy",
    objectFit = "cover",
    className = "",
    placeholderSrc = placeholder,
    fallbackSrc,
    draggable = true,
    onClick,
    isHovered = false,
  }) => {
    const [imgSrc, setImgSrc] = useState<string>(placeholderSrc);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const handleLoad = useCallback(() => {
      setIsLoading(false);
      setIsLoaded(true);
      setImgSrc(src);
    }, [src]);

    const handleError = useCallback(() => {
      setIsLoading(false);
      if (fallbackSrc && imgSrc !== fallbackSrc) {
        setImgSrc(fallbackSrc);
      } else if (imgSrc !== placeholderSrc) {
        setImgSrc(placeholderSrc);
      }
    }, [fallbackSrc, placeholderSrc, imgSrc]);

    const imageClassName = useMemo(() => {
      return clsx(
        className,
        "transition-all duration-500",
        isLoaded ? "opacity-100" : "opacity-0",
        isLoading ? "animate-pulse bg-gray-200" : "",
        isHovered ? "opacity-0" : "opacity-100"
      );
    }, [className, isLoaded, isLoading, isHovered]);

    return (
      <div className="relative">
        <img
          src={imgSrc}
          title={title}
          alt={alt}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          className={imageClassName}
          style={{ objectFit }}
          draggable={draggable}
          onClick={onClick}
        />
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
      </div>
    );
  }
);

OptimizedImage.displayName = "OptimizedImage";

export default OptimizedImage;
