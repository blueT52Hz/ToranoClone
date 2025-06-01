import React from "react";
import { Image } from "@/types/image.type";
import { Plus, Trash2 } from "lucide-react";

interface SelectedImageProps {
  image: Image | null;
  onSelect: () => void;
  onRemove: () => void;
  title: string;
  size?: "sm" | "md" | "lg";
  showImageName?: boolean;
}

const sizeClasses = {
  sm: "h-20 w-20",
  md: "h-32 w-32",
  lg: "h-40 w-40",
};

export default function SelectedImage({
  image,
  onSelect,
  onRemove,
  title,
  size = "md",
  showImageName = false,
}: SelectedImageProps) {
  return (
    <div className="flex flex-col items-center">
      {title && (
        <h3 className="mb-2 text-sm font-medium text-gray-700">{title}</h3>
      )}
      {image ? (
        <div className={`relative ${sizeClasses[size]}`}>
          <img
            src={image.image_url}
            alt={image.image_name}
            className="h-full w-full rounded-md object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black bg-opacity-50 opacity-0 transition-opacity hover:opacity-100">
            <div className="flex gap-2">
              <button
                type="button"
                title="Thay đổi ảnh"
                onClick={onSelect}
                className="rounded-full bg-white p-1.5 text-gray-700 hover:bg-gray-100"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                type="button"
                title="Xóa ảnh"
                onClick={onRemove}
                className="rounded-full bg-white p-1.5 text-red-500 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          title={`Chọn ${title.toLowerCase()}`}
          className={`flex ${sizeClasses[size]} items-center justify-center rounded-md border-2 border-dashed border-gray-300 hover:border-gray-400`}
          onClick={onSelect}
        >
          <Plus className="h-8 w-8 text-gray-400" />
        </button>
      )}
      {showImageName && image && (
        <div
          className="mt-1 max-w-[120px] truncate text-xs text-gray-500"
          title={image.image_name}
        >
          {image.image_name}
        </div>
      )}
    </div>
  );
}
