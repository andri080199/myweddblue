import Image from "next/image";

const images = [
  { src: "/images/WeddingBG.jpg", alt: "Photo 1", size: "col-span-2 row-span-2" },
  { src: "/images/WeddingBG.jpg", alt: "Photo 2", size: "" },
  { src: "/images/WeddingBG.jpg", alt: "Photo 3", size: "" },
  { src: "/images/WeddingBG.jpg", alt: "Photo 4", size: "" },
  { src: "/images/WeddingBG.jpg", alt: "Photo 5", size: "col-span-2 row-span-2" },
  { src: "/images/WeddingBG.jpg", alt: "Photo 6", size: "" },
  { src: "/images/WeddingBG.jpg", alt: "Photo 7", size: "" },
  { src: "/images/WeddingBG.jpg", alt: "Photo 8", size: "" },
  { src: "/images/WeddingBG.jpg", alt: "Photo 9", size: "" },
  { src: "/images/WeddingBG.jpg", alt: "Photo 10", size: "col-span-3 row-span-2" },
];

const Gallery: React.FC = () => {
  return (
    <div className="container mx-auto p-2 bg-primary">
      <div className="grid grid-cols-3 gap-1 md:grid-cols-4">
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative overflow-hidden rounded-lg aspect-square ${image.size}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              layout="fill"
              objectFit="cover"
              className="object-cover hover:scale-110 transition-transform duration-300 ease-in-out"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
